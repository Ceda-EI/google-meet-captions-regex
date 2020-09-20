#!/usr/bin/env bash

cd popup
yarn install
yarn build

cd ..
[[ -d web-ext-artifacts ]] || mkdir web-ext-artifacts
FILENAME="$(basename "$PWD")-$(jq -r .version manifest.json).zip"
zip -r "web-ext-artifacts/$FILENAME" LICENSE gmcr.js manifest.json background.js popup/build/ icons/
zip -r "web-ext-artifacts/source-$FILENAME" $(git ls-files)
