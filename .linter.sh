#!/bin/bash
cd /home/kavia/workspace/code-generation/darkscreen-cinediscover-35707-99084a66/cinediscover
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

