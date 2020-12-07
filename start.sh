#!/bin/bash
docker-compose down
docker image rm telegram_bot_seven_bot
docker-compose up -d