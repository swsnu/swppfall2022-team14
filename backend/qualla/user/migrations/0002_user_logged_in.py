# Generated by Django 4.1.2 on 2022-11-12 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='logged_in',
            field=models.BooleanField(default=False),
        ),
    ]