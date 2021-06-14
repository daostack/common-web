#!/bin/sh
if [ $1 == "worker" ];
then
  cd ./packages/worker && yarn run start
elif [ $1 == "graphql" ];
then
  cd ./packages/graphql && yarn run start
else
  echo "Argument not supported"
  exit 1
fi
