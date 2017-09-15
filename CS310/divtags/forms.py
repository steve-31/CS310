from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms.forms import Form
from .models import Project


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Required. Please enter a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )

class NewProjectForm(forms.ModelForm):
    name = forms.CharField(max_length=30, help_text='Max length 30 characters')
    desc = forms.CharField(max_length=300, help_text='Max length 300 characters')
    
    class Meta:
        model = Project
        fields = ('name', 'desc', 'owner', 'lastedited', )