#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

echo "Version : $VERSION"
echo "Is the version bumped?"
echo "---"
echo "Add a comment?"
read comment

gulp build

if [[ $comment ]]; then
	git commit -am "v$VERSION - $comment"
	git tag -a v$VERSION -m "$comment" -f
else
	git commit -am "v$VERSION"
	git tag v$VERSION -f
fi
	
git push --tags -f
git push

echo "Uploading to NPM..."

npm publish