# Generated by Django 4.1.1 on 2022-11-03 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comment', '0002_comment_is_deleted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='author_id',
            field=models.IntegerField(default=None, null=True),
        ),
    ]