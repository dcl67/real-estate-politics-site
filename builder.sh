#!/bin/sh
# This needs deploy keys present on the server!!
git pull origin main --rebase
if [ -d "./venv" ]
then
    source venv/bin/activate
    python cron/get_data.py
    wait
    npm run build
    wait
    # If copying to remote server, use this.
    # Otherwise, this will need to be modified for local on the host server.
    # A condition checking host matching would be ideal.
    scp -r $(pwd)/build -P 22134 acre@web.electricembers.net:/home/acre/boughtandsold_html
fi
