#!/bin/bash

CURRENTDIR=`pwd`
DIRNAME=`dirname "$0"`

devENV="$CURRENTDIR/env/dev/env_secrets.dev.json"
stagingENV="$CURRENTDIR/$DIRNAME/staging/env_secrets.json"
productionENV="$CURRENTDIR/$DIRNAME/production/env_secrets.json"
currentENV="$CURRENTDIR/$DIRNAME/env_secrets.json"

devCONFIG="$CURRENTDIR/env/dev/env_config.dev.json"
stagingCONFIG="$CURRENTDIR/env/staging/env_config.json"
productionCONFIG="$CURRENTDIR/env/production/env_config.json"
currentCONFIG="$CURRENTDIR/$DIRNAME/env_config.json"

echo $devENV
echo $devCONFIG

if ! command -v md5sum &> /dev/null
then
    echo "$(tput setaf 1)md5sum $(tput sgr0) could not be found"
    echo "You can use $(tput setaf 2)brew install md5sha1sum $(tput sgr0)"
    exit
fi

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

if [[ $1 = "-dev" ]]; then
  echo "Switching $(tput setaf 2) development/testing $(tput sgr0) environment ..."
  cp -f "$devENV" "$currentENV"
  cp -f "$devCONFIG" "$currentCONFIG"
  cp -f "$CURRENTDIR/$DIRNAME/dev/adminsdk-keys.dev.json" "$CURRENTDIR/$DIRNAME/adminsdk-keys.json"
  echo "Configuration changed"
  exit
fi

devMD5=`md5sum $devMD5 | awk '{ print $1 }'`
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
elif [ "$currentMD5" = "$developmentMD5" ]; then
  echo "Current environment is $(tput setaf 2)Development $(tput sgr0)"
else
  echo "Environment not match"
fi
exit