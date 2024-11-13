#!/bin/bash
# Example Script for native cron init
# File: /path/to/your/project/run_scrape_cron.sh

cd /home/raj/Desktop/csectorv/extras/vance/server

/usr/bin/node --import=tsx src/lib/scrape-cron.ts >> scrape_cron.log 2>&1
