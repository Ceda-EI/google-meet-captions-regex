# Google Meet Captions Regex

Send a notification when a caption in Google Meet matches a certain regex.

## Building

+ `cd popup`
+ `yarn install`
+ `yarn build`

This will build the react app for popup.

+ `cd ..`
+ `FILENAME="$(basename "$PWD")-$(jq -r .version manifest.json).zip"`
+ `zip -r "web-ext-artifacts/$FILENAME" gmcr.js manifest.json popup/build/ icons/`

### Building source zip (for review process)

+ `zip -r "web-ext-artifacts/source-$FILENAME" $(git ls-files)`
