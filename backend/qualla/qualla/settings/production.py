from .base import *

DEBUG = False

ALLOWED_HOSTS = ['13.125.144.254', 'ec2-13-125-144-254.ap-northeast-2.compute.amazonaws.com']

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / '.db' / 'db.sqlite3',
    }
}