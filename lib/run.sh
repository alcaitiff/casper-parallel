#!/bin/bash
#Configuration/Data File. This file will be ignored in all folders
CONF="map.js";
#Delay between max proccess verifications
DELAY=0.8
#Maximum number of open proccess
MAXPROC=50
#Colors
COLOR_SUCCESS_LINE="34m"
COLOR_PASS="\e[32m"
COLOR_FAIL="\e[31m"
COLOR_TIME="\e[1m"
COLOR_NORMAL="\e[m"
#Extra confguration line when running casper
EXTRA="--includes=conf.js  --verbose --log-level=debug"
#Internal USE Do Not Change!
NUM=0;
BEGIN=$(date '+%H:%M:%S');
FILES=()
#Helper functions
terminal_width(){
  local width_height
  width_height=$(stty size)
  echo "${width_height/* /}"
}
string_times_n(){
  local s=$1
  local n=$2
  local i=0;
  for((i=0;i<n; i++)); do echo -n "$s"; done
}
##The actual function
bar(){
  local percentage=$1
  local text=$2
  local width
  width=$(echo "scale=0; 0.8 * $(terminal_width)" | bc | cut -d. -f1)
  local equals_n
  equals_n=$(echo "$percentage * $width / 100" | bc | cut -d. -f1)
  local dots_n
  dots_n=$((width - equals_n))

  #ANSI escape sequence magic
  local Esc="\033["
  local up="$Esc""K""$Esc""1A""$Esc""K"

  #Clear the line
  string_times_n ' ' "$width"
  echo -ne "\r${text} "

  #Print the current screen
  printf  "%3s%% [" "$percentage"
    string_times_n '=' "$equals_n"
    string_times_n '.' "$dots_n"
  echo -n "]"

  #Go up unless finished
  if [[ "$percentage" == 100 ]]
  then
    echo
  else
    echo -e "$up"
  fi
}
clearLine(){
    local ceol
    ceol=$(tput el)
    echo -ne "\r${ceol}"
}
progress(){
	printBar "$1" "$2";
    local currProc
    currProc=$(jobs -rp | wc -l);
    local curr=$2;
    local max=$1;
    local line=$((max-curr));
    local done=$((curr-currProc));
	if [ "${max}" -gt "${done}" ];then
		sleep "${DELAY}";
		progress "$1" "$2";
	fi
}

printBar(){
    local currProc
    currProc=$(jobs -rp | wc -l);
    local curr=$2;
    local max=$1;
    local line=$((max-curr));
    local done=$((curr-currProc));
    local perc=$((done*100/max));
    bar ${perc} "${done}/$1 (${line})";
}

runtest(){
	{  local cmd="casperjs test --cookies-file=/tmp/${1}.cookies.txt ${1} ${EXTRA}" && ($cmd) > /tmp/"${1}".log && clearLine && tail -n 1 /tmp/"${1}".log | sed "s/\[37;42;1m/\[${COLOR_SUCCESS_LINE}/g"; } || { echo "Fail ${1} logs:" && cat /tmp/"${1}".log && date '+%Y %b %d %H:%M:%S'; }
}

pipeIt(){
    local currentProcs
    currentProcs=$(jobs -rp | wc -l);
    while ((MAXPROC<=currentProcs));do
        sleep "${DELAY}"
        printBar "${2}" "${3}"
        local currentProcs
        currentProcs=$(jobs -rp | wc -l);
    done
    runtest "${1}"&
}

for i in "$@";do
    mkdir -p /tmp/"${i}"
	for filename in "$i"/*.js;do
		if [[ "${filename}" != *"${CONF}" ]]; then
			((NUM++));
             echo "${NUM}: ${filename}"
			FILES+=("${filename}")
		fi
	done
done
echo "Total:${NUM}";
m=$((NUM-1))
new=$(shuf -i 0-${m})
i=0;
for index in $new; do
    pipeIt "${FILES[$index]}" ${NUM} ${i}
    ((i++));
done
progress ${NUM} ${i}
END=$(date '+%H:%M:%S')
PAST=$(( $(date --date="${END} UTC" +%s) - $(date --date="${BEGIN} UTC" +%s) ))
echo -e "Begin=${BEGIN} End=${END}";
echo -e "Done in ${COLOR_TIME}${PAST}s${COLOR_NORMAL}";
PASS=0;
FAIL=0;
F=0;
PP=0;
PF=0;
for index in $new; do
    F=$(grep "\[37;41;1mFAIL " /tmp/"${FILES[$index]}".log | sed "s/.*FAIL .* executed in.*passed, \(.*\) failed.*/\1/g"; )
    FAIL=$((FAIL+F))
    PF=$(grep "\[37;41;1mFAIL " /tmp/"${FILES[$index]}".log | sed "s/.*FAIL .* executed in.*s, \(.*\) passed.*/\1/g"; )
    PASS=$((PASS+PF))
    PP=$(grep "\[37;42;1mPASS " /tmp/"${FILES[$index]}".log | sed "s/.*PASS \(.*\) test.*executed in.*/\1/g"; )
    PASS=$((PASS+PP))
done
echo -e "PASS: ${COLOR_PASS}${PASS} ${COLOR_NORMAL}FAIL: ${COLOR_FAIL}${FAIL}${COLOR_NORMAL}";
