#!/usr/bin/env bash

cd popup
yarn install
yarn build

cd ..
FILENAME="$(basename "$PWD")-$(jq -r .version manifest.json).zip"
zip -r "web-ext-artifacts/$FILENAME" LICENSE gmcr.js manifest.json popup/build/ icons/
zip -r "web-ext-artifacts/source-$FILENAME" $(git ls-files)
