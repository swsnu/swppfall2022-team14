# Generated by Django 4.1.2 on 2022-12-03 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ingredient_prepare', '0003_alter_ingredientprepare_cocktail_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='ingredientprepare',
            name='unit',
            field=models.CharField(default='oz|ml', max_length=50),
        ),
        migrations.AlterField(
            model_name='ingredientprepare',
            name='amount',
            field=models.FloatField(),
        ),
    ]
