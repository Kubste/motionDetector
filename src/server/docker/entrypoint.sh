#!/usr/bin/env bash

set -e
mkdir -p /app/static /app/media
# changing owner of the static and media directories to user running script
chown -R "$(id -u)":"$(id -g)" /app/static /app/media
python manage.py collectstatic --noinput
python manage.py migrate --noinput
python -m gunicorn --bind 0.0.0.0:8000 --workers 3 motionDetectorDjangoServer.wsgi:application