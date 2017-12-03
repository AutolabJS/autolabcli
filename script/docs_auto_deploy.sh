#!/bin/bash

###################
# Author: Domenic Denicola
# Modifications by: Prasad Talasila
# Date: 3-December-2017
###################


set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
ENCRYPTION_LABEL="cd6b11287fde"
COMMIT_AUTHOR_EMAIL="tsrkp@goa.bits-pilani.ac.in"

function createDocs {
  npm run-script jsdocs
  mv out/@autolabjs/autolabcli/0.1.1/* out/
  rm -rf out/@autolabjs
  cp -rf out/* docs/
}

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO docs
cd docs
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean out existing contents
rm -rf docs/* || exit 0

# create the documents using JSDoc
createDocs

# Now let's go have some fun with the cloned repo
cd docs
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add .
git commit -m "[Travis Commit] Automated Deploy to gh-pages | Caused by ${SHA}
refer auto_commit_script: https://github.com/AutolabJS/autolabcli/blob/$SOURCE_BRANCH/script/doc_auto_deploy.sh
" || exit 0	# fail silently if there is nothing to commit

#go to parent directory and perform SSH configuration
cd ..
# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in script/docs_deploy_key.enc -out script/docs_deploy_key -d
chmod 600 script/docs_deploy_key
eval `ssh-agent -s`
ssh-add script/docs_deploy_key

#go to docs/ directory and commit the gh-pages/ update
cd docs/
#check the git repo context
pwd
echo repo=$SSH_REPO
echo branch=$TARGET_BRANCH
echo "===show local gh-pages commit logs==="
git log --oneline -n 5
echo "===show remote gh-pages commit logs==="
git log --oneline -n 5 origin/$TARGET_BRANCH
echo "===show remote commits above the current local commit==="
git log HEAD..origin/$TARGET_BRANCH
echo "===show status of local branch==="
git status

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH


##References
#https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
#https://github.com/travis-ci/travis.rb
