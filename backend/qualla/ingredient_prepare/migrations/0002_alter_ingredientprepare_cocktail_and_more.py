# Generated by Django 4.1.1 on 2022-11-02 16:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ingredient', '0001_initial'),
        ('cocktail', '0002_auto_20221026_1224'),
        ('ingredient_prepare', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredientprepare',
            name='cocktail',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ingredient_prepare', to='cocktail.cocktail'),
        ),
        migrations.AlterField(
            model_name='ingredientprepare',
            name='ingredient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ingredient_prepare', to='ingredient.ingredient'),
        ),
    ]
