from django.db import models


class Course(models.Model):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('design', 'UI/UX Design'),
    ]

    title = models.CharField('Название', max_length=200)
    category = models.CharField('Категория', max_length=20, choices=CATEGORY_CHOICES)
    badge = models.CharField('Бейдж', max_length=60)
    icon = models.CharField('Иконка (emoji)', max_length=10, default='⚡')
    description = models.TextField('Описание')
    duration = models.CharField('Длительность', max_length=20)
    projects_count = models.PositiveSmallIntegerField('Кол-во проектов')
    level = models.CharField('Уровень', max_length=50, default='с нуля')
    price = models.PositiveIntegerField('Цена (сом/мес)', default=0)
    is_active = models.BooleanField('Активен', default=True)
    order = models.PositiveSmallIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'
        ordering = ['order']

    def __str__(self):
        return self.title


class Review(models.Model):
    author_name = models.CharField('Имя', max_length=100)
    avatar_letter = models.CharField('Буква аватара', max_length=2)
    avatar_color = models.CharField('Цвет аватара (a/b/c)', max_length=5, default='a')
    course_label = models.CharField('Подпись курса', max_length=100)
    text = models.TextField('Текст отзыва')
    rating = models.PositiveSmallIntegerField('Рейтинг (1–5)', default=5)
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField('Дата', auto_now_add=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.author_name} — {self.course_label}'


class Application(models.Model):
    phone = models.CharField('Телефон', max_length=30)
    name = models.CharField('Имя', max_length=100, blank=True)

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        verbose_name='Курс',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField('Дата заявки', auto_now_add=True)
    is_processed = models.BooleanField('Обработана', default=False)

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.phone} - {self.course}'