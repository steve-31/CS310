# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-21 16:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('divtags', '0016_project_pubdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='pubdate',
            field=models.DateTimeField(null=True),
        ),
    ]
