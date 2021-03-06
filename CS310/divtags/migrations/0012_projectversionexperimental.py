# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-17 13:17
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('divtags', '0011_auto_20171117_1124'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectVersionExperimental',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('experimentalno', models.IntegerField()),
                ('file', django.contrib.postgres.fields.jsonb.JSONField()),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='divtags.ProjectVersion')),
            ],
        ),
    ]
