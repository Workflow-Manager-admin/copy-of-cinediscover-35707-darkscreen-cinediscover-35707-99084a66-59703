#!/bin/bash
cd /home/kavia/workspace/code-generation/copy-of-cinediscover-35707-darkscreen-cinediscover-35707-99084a66-59703/cinediscover_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

