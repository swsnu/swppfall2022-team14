#!/bin/bash

UWSGI_INI=/home/ubuntu/uwsgi.ini
WORKING_DIR=/home/ubuntu/build/qualla

echo "[Deploy] : Kill old uwsgi process"
sudo pkill -f uwsgi -9

cd $WORKING_DIR

echo "[Deploy] : Install Requirements"
python3 -m pip install --upgrade pip
pip install -r requirements.txt

echo "[Deploy] : Migrate"
python3 manage.py makemigrations --settings=qualla.settings.production
python3 manage.py migrate --settings=qualla.settings.production

cd /home/ubuntu/

echo "[Deploy] : Running Uwsgi"
/home/ubuntu/.local/bin/uwsgi -i $UWSGI_INI &

echo "[Deploy] : Running Nginx"
sudo systemctl start nginx
