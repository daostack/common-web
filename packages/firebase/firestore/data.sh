#!/bin/bash

CURRENTDIR=`pwd`
DIRNAME=`dirname "$0"`

ENV_String=`yarn env`
Date=`date +"%FT%T%z(%Z)"`
SOURCE="Production"

stagingPATH="$CURRENTDIR/$DIRNAME/backup/staging"
productionPATH="$CURRENTDIR/$DIRNAME/backup/production"

if [ ! -d $stagingPATH ]; then
	mkdir -p $stagingPATH
fi

if [ ! -d $productionPATH ]; then
	mkdir -p $productionPATH
fi

if ! command -v gsutil &> /dev/null
then
    echo "$(tput setaf 1)gsutil $(tput sgr0) could not be found"
    echo "Check this out: $(tput setaf 2) https://cloud.google.com/storage/docs/gsutil_install#install $(tput sgr0)"
    exit
fi

if [[ $1 == "-backup" ]]; then
	if echo "$ENV_String" | grep -q "$SOURCE"; then
		echo "Backup $(tput setaf 2) Production $(tput sgr0) Firestore ..."
		echo "Crating $(tput setaf 2) $Date $(tput sgr0) ..."
		gcloud firestore export gs://common-daostack.appspot.com/backup/$Date
		echo "$(tput setaf 2)Updating local backup Firestore ... $(tput sgr0)"
		gsutil -m cp -r gs://common-daostack.appspot.com/backup/* $CURRENTDIR/$DIRNAME/backup/production
	else
		echo "Backup $(tput setaf 2) Staging $(tput sgr0) Firestore ..."
		gcloud firestore export gs://common-staging-50741.appspot.com/backup/$Date
		echo "$(tput setaf 2)Updating local backup Firestore ... $(tput sgr0)"
		gsutil -m cp -r gs://common-staging-50741.appspot.com/backup/* $CURRENTDIR/$DIRNAME/backup/staging
	fi
	exit
fi

if [[ $1 = "-update" ]]; then
	if echo "$ENV_String" | grep -q "$SOURCE"; then
		echo "Fetching $(tput setaf 2) Production $(tput sgr0) Firestore ..."
		gsutil -m cp -r gs://common-daostack.appspot.com/backup/* $CURRENTDIR/$DIRNAME/backup/production
		newestDATA=`ls $CURRENTDIR/$DIRNAME/backup/production | sort | tail -1`
		echo "Using $(tput setaf 2)$newestDATA $(tput sgr0) backup  ... "
		cp -r -f $CURRENTDIR/$DIRNAME/backup/production/$newestDATA/all_namespaces $CURRENTDIR/$DIRNAME/data/firestore_export
	else
		echo "Fetching $(tput setaf 2)Staging $(tput sgr0) Firestore ..."
		gsutil -m cp -r gs://common-staging-50741.appspot.com/backup/* $CURRENTDIR/$DIRNAME/backup/staging
		newestDATA=`ls $CURRENTDIR/$DIRNAME/backup/staging | sort | tail -1`
		echo "Using $(tput setaf 2)$newestDATA $(tput sgr0) backup  ... "
		cp -r -f $CURRENTDIR/$DIRNAME/backup/staging/$newestDATA/all_namespaces $CURRENTDIR/$DIRNAME/data/firestore_export
	fi
	exit
fi