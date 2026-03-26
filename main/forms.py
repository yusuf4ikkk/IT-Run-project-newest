from django import forms
from django.utils.translation import gettext_lazy as _
from .models import Application, Course


class ApplicationForm(forms.ModelForm):
    """
    Форма заявки на курс.
    Поле course — выбор курса из активных (передаётся через queryset).
    Если курсов > 3, во фронтенде отображается слайдер (логика в JS).
    """
    class Meta:
        model = Application
        fields = ['name', 'phone', 'course']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'cta-input',
                'placeholder': _('Ваше имя (необязательно)'),
            }),
            'phone': forms.TextInput(attrs={
                'class': 'cta-input',
                'placeholder': _('Ваш номер телефона'),
                'type': 'tel',
            }),
            # Скрытое поле — курс выбирается через кастомный слайдер
            'course': forms.HiddenInput(attrs={
                'id': 'selected-course-input',
            }),
        }
        labels = {
            'name': '',
            'phone': '',
            'course': '',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Только активные курсы
        self.fields['course'].queryset = Course.objects.filter(is_active=True)
        self.fields['course'].required = False
