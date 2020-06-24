#!/bin/bash

CURRENTDIR=`pwd`
DIRNAME=`dirname "$0"`

stagingENV="$CURRENTDIR/$DIRNAME/staging/env.json"
productionENV="$CURRENTDIR/$DIRNAME/production/env.json"
currentENV="$CURRENTDIR/$DIRNAME/env.json"

if [[ $1 == "-stg" ]]; then
  echo "Switching $(tput setaf 1) staging $(tput sgr0) environment ..."
  cp -f "$stagingENV" "$currentENV"
  cp -f "$CURRENTDIR/$DIRNAME/staging/adminsdk-keys.json" "$CURRENTDIR/$DIRNAME/adminsdk-keys.json"
  echo "Configuration changed"
  exit
fi

if [[ $1 = "-prod" ]]; then
  echo "Switching $(tput setaf 1) production $(tput sgr0) environment ..."
  cp -f "$productionENV" "$currentENV"
  cp -f "$CURRENTDIR/$DIRNAME/production/adminsdk-keys.json" "$CURRENTDIR/$DIRNAME/adminsdk-keys.json"
  echo "Configuration changed"
  exit
fi

currentMD5=`md5sum $currentENV | awk '{ print $1 }'`
stagingMD5=`md5sum $stagingENV | awk '{ print $1 }'`
productionMD5=`md5sum $productionENV | awk '{ print $1 }'`

if [ "$currentMD5" = "$stagingMD5" ]; then
  echo "Current environment is $(tput setaf 1) Staging $(tput sgr0)"
elif [ "$currentMD5" = "$productionMD5" ]; then
  echo "Current environment is $(tput setaf 1) Production $(tput sgr0)"
else
   echo "Environment not match"
fi
exit