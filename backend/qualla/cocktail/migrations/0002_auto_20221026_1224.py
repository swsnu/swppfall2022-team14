# Generated by Django 3.2.6 on 2022-10-26 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cocktail', '0001_initial'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='cocktail',
            name='custom cocktail should have author',
        ),
        migrations.AddConstraint(
            model_name='cocktail',
            constraint=models.CheckConstraint(check=models.Q(models.Q(('author_id__isnull', False), ('type__startswith', 'CS')), ('type__startswith', 'ST'), _connector='OR'), name='custom cocktail should have author'),
        ),
    ]
