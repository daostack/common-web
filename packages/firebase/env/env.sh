#!/bin/bash

CURRENTDIR=$(pwd)
DIRNAME=$(dirname "$0")
OUTPUTDIR="$CURRENTDIR/functions/src/constants/env"

echo "Writing config files to $OUTPUTDIR"

devENV="$CURRENTDIR/env/dev/env_secrets.dev.json"
devCONFIG="$CURRENTDIR/env/dev/env_config.dev.json"
devAdminKeys="$CURRENTDIR/env/dev/adminsdk-keys.dev.json"

productionENV="$CURRENTDIR/$DIRNAME/production/env_secrets.json"
productionCONFIG="$CURRENTDIR/env/production/env_config.json"
productionAdminKeys="$CURRENTDIR/env/production/adminsdk-keys.json"


stagingENV="$CURRENTDIR/$DIRNAME/staging/env_secrets.json"
stagingCONFIG="$CURRENTDIR/env/staging/env_config.json"
stagingAdminKeys="$CURRENTDIR/env/staging/adminsdk-keys.json"


currentENV="$OUTPUTDIR/env_secrets.json"
currentCONFIG="$OUTPUTDIR/env_config.json"
currentAdminKeys="$OUTPUTDIR/adminsdk-keys.json"


if ! command -v md5sum &> /dev/null
then
    echo "$(tput setaf 1)md5sum $(tput sgr0) could not be found"
    echo "You can use $(tput setaf 2)brew install md5sha1sum $(tput sgr0)"

    exit
fi

if [[ $1 == "-stg" ]]; then
  echo "🚀 Switching $(tput setaf 2) staging $(tput sgr0) environment ..."

  cp -f "$stagingENV" "$currentENV"
  cp -f "$stagingCONFIG" "$currentCONFIG"
  cp -f "$stagingAdminKeys" "$currentAdminKeys"

  echo "✨ Configuration changed to staging"

  exit
fi

if [[ $1 = "-prod" ]]; then
  echo "🚀 Switching $(tput setaf 2) production $(tput sgr0) environment ..."

  cp -f "$productionENV" "$currentENV"
  cp -f "$productionCONFIG" "$currentCONFIG"
  cp -f "$productionAdminKeys" "$currentAdminKeys"

  echo "✨ Configuration changed to production"

  exit
fi

if [[ $1 = "-dev" ]]; then
  echo "🚀 Switching $(tput setaf 2) development/testing $(tput sgr0) environment ..."

  cp -f "$devENV" "$currentENV"
  cp -f "$devCONFIG" "$currentCONFIG"
  cp -f "$devAdminKeys" "$currentAdminKeys"

  echo "✨ Configuration changed"

  exit
fi


devMD5=$(md5sum "$devENV" | awk '{ print $1 }')
currentMD5=$(md5sum "$currentENV" | awk '{ print $1 }')
stagingMD5=$(md5sum "$stagingENV" | awk '{ print $1 }')
productionMD5=$(md5sum "$productionENV" | awk '{ print $1 }')

currentBranch=$(git branch --no-color | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')

if [ "$currentMD5" = "$stagingMD5" ]; then
  echo "Current environment is $(tput setaf 2)Staging $(tput sgr0)"

  if [[ $1 = "-check" ]]; then
    if [[ "$currentBranch" = "environment/staging" ]]; then
      echo "$(tput setaf 2)Environment check ok$(tput sgr0)"
      exit
    fi

    echo "$(tput setaf 1)Environment mismatched$(tput sgr0)"

    exit 1
  fi

elif [ "$currentMD5" = "$productionMD5" ]; then
  echo "Current environment is $(tput setaf 2)Production $(tput sgr0)"
  if [[ $1 = "-check" ]]; then
    if [[ "$currentBranch" = "environment/production" ]]; then
      echo "$(tput setaf 2)Environment check pass$(tput sgr0)"
      exit
    fi

    echo "$(tput setaf 1)Environment mismatched$(tput sgr0)"

    exit 1
  fi

elif [ "$currentMD5" = "$devMD5" ]; then
  echo "Current environment is $(tput setaf 2)Development $(tput sgr0)"

else
  echo "Environment not match"
fi
exit