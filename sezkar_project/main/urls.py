# urls.py
from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    # صفحه اصلی
    path('', views.home, name='home'),
    path('home/', views.home, name='home_alt'),
    
    # احراز هویت مشتریان
    path('accounts/customer/', views.customer_auth, name='customer_auth'),
    
    # احراز هویت خیاطان
    path('accounts/tailor/', views.tailor_auth, name='tailor_auth'),
    
    # خروج
    path('accounts/logout/', views.user_logout, name='logout'),
    
    # پروفایل
    path('profile/', views.profile, name='profile'),

    # سفارشات
    path('orders/create/', views.create_order, name='create_order'),
    path('orders/list/', views.orders_list, name='orders_list'),
    path('orders/dashboard/', views.dashboard, name='dashboard'),
    path('orders/send-offer/<int:order_id>/', views.send_offer, name='send_offer'),
]