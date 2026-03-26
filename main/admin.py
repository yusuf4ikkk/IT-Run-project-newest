from django.contrib import admin
from .models import Course, Review, Application


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'duration', 'projects_count', 'price', 'is_active', 'order')
    list_editable = ('is_active', 'order', 'price')
    list_filter = ('category', 'is_active')
    search_fields = ('title',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'course_label', 'rating', 'is_active', 'created_at')
    list_editable = ('is_active',)
    list_filter = ('rating', 'is_active')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'course', 'created_at', 'is_processed')
    list_filter = ('course', 'is_processed')
    search_fields = ('name', 'phone')