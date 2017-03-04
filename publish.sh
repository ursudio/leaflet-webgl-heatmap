#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

# test
npm run test

# publish master branch
gulp build
git commit -am "v$VERSION"
git tag v$VERSION -f
git push --tags -f
git push