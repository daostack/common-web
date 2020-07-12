#!/bin/bash

CURRENTDIR=`pwd`
DIRNAME=`dirname "$0"`

stagingENV="$CURRENTDIR/$DIRNAME/staging/env_secrets.json"
productionENV="$CURRENTDIR/$DIRNAME/production/env_secrets.json"
currentENV="$CURRENTDIR/$DIRNAME/env_secrets.json"

stagingCONFIG="$CURRENTDIR/config/staging/env_config.json"
productionCONFIG="$CURRENTDIR/config/production/env_config.json"
currentCONFIG="$CURRENTDIR/$DIRNAME/env_config.json"

if [[ $1 == "-stg" ]]; then
  echo "Switching $(tput setaf 2) staging $(tput sgr0) environment ..."
  cp -f "$stagingENV" "$currentENV"
  cp -f "$stagingCONFIG" "$currentCONFIG"
  cp -f "$CURRENTDIR/$DIRNAME/staging/adminsdk-keys.json" "$CURRENTDIR/$DIRNAME/adminsdk-keys.json"
  echo "Configuration changed"
  exit
fi

if [[ $1 = "-prod" ]]; then
  echo "Switching $(tput setaf 2) production $(tput sgr0) environment ..."
  cp -f "$productionENV" "$currentENV"
  cp -f "$productionCONFIG" "$currentCONFIG"
  cp -f "$CURRENTDIR/$DIRNAME/production/adminsdk-keys.json" "$CURRENTDIR/$DIRNAME/adminsdk-keys.json"
  echo "Configuration changed"
  exit
fi

currentMD5=`md5sum $currentENV | awk '{ print $1 }'`
stagingMD5=`md5sum $stagingENV | awk '{ print $1 }'`
productionMD5=`md5sum $productionENV | awk '{ print $1 }'`

currentBranch=`git branch --no-color | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`

if [ "$currentMD5" = "$stagingMD5" ]; then
  echo "Current environment is $(tput setaf 2)Staging $(tput sgr0)"
  if [[ $1 = "-check" ]]; then
    if [[ "$currentBranch" = "dev" ]]; then
      echo "$(tput setaf 2)Enviroment check ok$(tput sgr0)"
      exit
    fi
    echo "$(tput setaf 1)Enviroment mismatched$(tput sgr0)"
    echo "Current branch is $(tput setaf 1) $currentBranch $(tput sgr0), you need to either switch environment, or checkout $(tput setaf 1) dev $(tput sgr0) branch"
    echo "Only$(tput setaf 1) dev $(tput sgr0)branch can deploy to $(tput setaf 1)Staging Environment$(tput sgr0)"
    exit 1
  fi
elif [ "$currentMD5" = "$productionMD5" ]; then
  echo "Current environment is $(tput setaf 2)Production $(tput sgr0)"
  if [[ $1 = "-check" ]]; then
    if [[ "$currentBranch" = "master" ]]; then
      echo "$(tput setaf 2)Enviroment check pass$(tput sgr0)"
      exit
    fi
    echo "$(tput setaf 1)Enviroment mismatched$(tput sgr0)"
    echo "Current branch is $(tput setaf 1)$currentBranch$(tput sgr0), you need switch to $(tput setaf 1)master $(tput sgr0)"
    echo "Only$(tput setaf 1) Master $(tput sgr0)branch can depoly to $(tput setaf 1)Production Environment$(tput sgr0)\n"
    exit 1
  fi
else
   echo "Environment not match"
fi
exit