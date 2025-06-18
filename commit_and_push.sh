#!/bin/bash
set -e

cd /home/kavia/workspace/code-generation/copy-of-cinediscover-35707-darkscreen-cinediscover-35707-99084a66-59703

git add .
git commit -m "Fix: Add missing public/index.html to resolve Html Webpack Plugin build error and restore successful build."
git push
