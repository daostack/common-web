#!/bin/bash

CURRENTDIR=`pwd`
DIRNAME=`dirname "$0"`

ENV_String=`yarn env`
Date=`date +"%FT%T%z(%Z)"`
SOURCE="Production"
if echo "$ENV_String" | grep -q "$SOURCE"; then
	echo "Backup $(tput setaf 2) Production $(tput sgr0) Firestore ..."
	gcloud firestore export gs://common-daostack.appspot.com/backup/$Date
	gsutil cp -r gs://common-daostack.appspot.com/backup $CURRENTDIR/$DIRNAME
else
	echo "Backup $(tput setaf 2) Staging $(tput sgr0) Firestore ..."
	gcloud firestore export gs://common-staging-50741.appspot.com/backup/$Date
	gsutil cp -r gs://common-staging-50741.appspot.com/backup $CURRENTDIR/$DIRNAME
fi

#firebase emulators:start --import backup_2020072818