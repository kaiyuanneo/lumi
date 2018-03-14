#!/bin/bash

# Make the user specify which environment they are deploying to
if [ "$1" != "STAGING" ] && [ "$1" != "PROD" ]
then
  echo "Incorrect usage. First parameter should reflect the deploy env, either STAGING or PROD."
  echo "Correct usage: deploy.sh {STAGING|PROD}"
  exit
fi

# Set the deploy environment in an env var so that Lumi knows to read the access tokens
# relevant to the given environment. E.g. in the staging environment, Lumi will want to read
# the access tokens for the Lumi Staging Facebook app and page.
firebase functions:config:set lumi.env="$1"
npm run build
# If deploying staging webhook, run deploy_staging instead
if [ "$1" = "STAGING" ]
then
  npm run deploy_staging
  exit
fi
npm run deploy
