# Generated by Django 4.1 on 2022-11-06 15:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("cocktail", "0002_auto_20221026_1224"),
        ("tag", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cocktailtag",
            name="cocktail",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tags",
                to="cocktail.cocktail",
            ),
        ),
        migrations.AlterField(
            model_name="cocktailtag",
            name="tag",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cocktails",
                to="tag.tag",
            ),
        ),
    ]
