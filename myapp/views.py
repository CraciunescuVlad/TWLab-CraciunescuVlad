from django.shortcuts import render

def loadingscreen(request):
    return render(request, "HTML/loading.html")

def login(request):
    return render(request, "HTML/login.html")

def register(request):
    return render(request, "HTML/register.html")

def home(request):
    return render(request, "HTML/home.html")

def chatbot(request):
    return render(request, "HTML/chatbot.html")

def universities(request):
    return render(request, "HTML/universities.html")

def galerie(request):
    return render(request, "HTML/galerie.html")

def meals(request):
    return render(request, "HTML/meals.html")