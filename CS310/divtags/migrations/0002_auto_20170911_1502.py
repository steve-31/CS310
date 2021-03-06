# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-11 14:02
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('divtags', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='contributers',
            field=models.ManyToManyField(related_name='contributers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='project',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL),
        ),
    ]
