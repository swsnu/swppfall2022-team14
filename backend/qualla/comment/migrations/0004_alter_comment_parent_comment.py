# Generated by Django 4.1 on 2022-11-06 15:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("comment", "0003_alter_comment_author_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="parent_comment",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="replies",
                to="comment.comment",
            ),
        ),
    ]