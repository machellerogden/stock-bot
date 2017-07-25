#!/usr/bin/env bash
aws s3 cp stock-bot.zip "s3://$(cat secrets.json | jq -M -r '.bucketName')/"
