#!/bin/sh
if [ $1 == "worker" ];
then
  cd ./packages/worker && dumb-init node -r dotenv/config dist/index.js
elif [ $1 == "graphql" ];
then
  cd ./packages/graphql && dumb-init node -r dotenv/config dist/index.js
else
  echo "Argument not supported"
  exit 1
fi
