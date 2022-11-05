# Generated by Django 4.1.1 on 2022-11-01 13:27

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cocktail', '0002_auto_20221026_1224'),
        ('ingredient', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='IngredientPrepare',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator('(\\d*\\.?\\d+)\\s[a-z|A-Z|ㄱ-ㅎ|가-힣]+')])),
                ('cocktail', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ingredients', to='cocktail.cocktail')),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ingredients', to='ingredient.ingredient')),
            ],
        ),
    ]