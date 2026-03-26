from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils.translation import gettext as _
from .models import Course, Review
from .forms import ApplicationForm


def index(request):
    """
    Главная страница.
    Передаём курсы и отзывы в шаблон.
    courses_json — список курсов в виде JSON для JS-слайдера.
    """
    courses = Course.objects.filter(is_active=True)
    reviews = Review.objects.filter(is_active=True)
    form = ApplicationForm()

    if request.method == 'POST':
        form = ApplicationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, _('✓ Заявка принята! Мы свяжемся с вами в ближайшее время.'))
            return redirect('index')

    return render(request, 'main/index.html', {
        'courses': courses,
        'reviews': reviews,
        'form': form,
        # Количество курсов нужно шаблону чтобы решить: grid или слайдер
        'courses_count': courses.count(),
    })
