from django.urls import path
from . import views

urlpatterns = [
    path('', views.loadingscreen, name='loadingscreen'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('home/', views.home, name='home'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('universities/', views.universities, name='universities'),
    path('galerie/', views.galerie, name='galerie'),
]