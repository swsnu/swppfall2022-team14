# Generated by Django 4.1.1 on 2022-11-07 11:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cocktail', '0003_cocktail_filter_type_one_cocktail_filter_type_two'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cocktail',
            name='filter_type_one',
            field=models.CharField(max_length=50, null=True, validators=[django.core.validators.RegexValidator('(#[a-z|A-Z|ㄱ-ㅎ|가-힣|0-9]+)*')]),
        ),
        migrations.AlterField(
            model_name='cocktail',
            name='filter_type_two',
            field=models.CharField(max_length=50, null=True, validators=[django.core.validators.RegexValidator('(#[a-z|A-Z|ㄱ-ㅎ|가-힣|0-9]+)*')]),
        ),
    ]
