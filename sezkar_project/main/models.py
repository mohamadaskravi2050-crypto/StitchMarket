# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('customer', 'مشتری'),
        ('tailor', 'خیاط'),
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')
    phone = models.CharField(max_length=15, blank=True, null=True)
    fullname = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    address = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"پروفایل مشتری: {self.user.username}"
    
    class Meta:
        verbose_name = 'پروفایل مشتری'
        verbose_name_plural = 'پروفایل‌های مشتریان'


class TailorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tailor_profile')
    national_code = models.CharField(max_length=10, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    education = models.CharField(max_length=50, blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    workshop_name = models.CharField(max_length=100, blank=True, null=True)
    specialties = models.TextField(blank=True, null=True)  # ذخیره به صورت JSON یا متن
    services = models.TextField(blank=True, null=True)     # ذخیره به صورت JSON یا متن
    skills = models.TextField(blank=True, null=True)       # مهارت‌ها با کاما جدا شده
    province = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"پروفایل خیاط: {self.user.username}"
    
    class Meta:
        verbose_name = 'پروفایل خیاط'
        verbose_name_plural = 'پروفایل‌های خیاطان'



# models.py - اضافه به انتهای فایل
class SewingOrder(models.Model):
    SIZE_CHOICES = (
        ('xs', 'اکس‌اسمال'),
        ('s', 'اسمال'),
        ('m', 'مدیوم'),
        ('l', 'لارج'),
        ('xl', 'اکس‌لارج'),
        ('2xl', '۲ اکس‌لارج'),
        ('3xl', '۳ اکس‌لارج'),
        ('custom', 'سایز سفارشی'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'منتظر خیاط'),
        ('offers_received', 'دریافت پیشنهادات'),
        ('in_progress', 'در دست ساخت'),
        ('completed', 'تکمیل شده'),
        ('cancelled', 'لغو شده'),
    )
    
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    title = models.CharField(max_length=200, verbose_name='عنوان سفارش')
    description = models.TextField(verbose_name='توضیحات سفارش')
    design_image = models.ImageField(upload_to='order_designs/', blank=True, null=True, verbose_name='عکس طرح')
    
    # جزئیات فنی
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, verbose_name='سایز')
    custom_size = models.TextField(blank=True, null=True, verbose_name='اندازه‌های دقیق (سانتی‌متر)')
    fabric_type = models.CharField(max_length=100, blank=True, null=True, verbose_name='جنس پارچه')
    color_preference = models.CharField(max_length=100, blank=True, null=True, verbose_name='رنگ‌بندی')
    
    # محدودیت‌ها
    max_budget = models.IntegerField(verbose_name='حداکثر بودجه (تومان)')
    deadline_days = models.IntegerField(verbose_name='حداکثر زمان تحویل (روز)')
    
    # وضعیت
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'سفارش خیاطی'
        verbose_name_plural = 'سفارشات خیاطی'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.customer.username}"
    



class TailorOffer(models.Model):
    """پیشنهاد خیاط برای سفارش"""
    tailor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offers')
    order = models.ForeignKey(SewingOrder, on_delete=models.CASCADE, related_name='offers')
    
    # جزئیات پیشنهاد
    proposed_price = models.IntegerField(verbose_name='قیمت پیشنهادی (تومان)')
    delivery_days = models.IntegerField(verbose_name='زمان تحویل (روز)')
    message = models.TextField(verbose_name='پیام به مشتری')
    
    # وضعیت
    STATUS_CHOICES = (
        ('pending', 'در انتظار بررسی'),
        ('accepted', 'پذیرفته شده'),
        ('rejected', 'رد شده'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # زمان‌بندی
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'پیشنهاد خیاط'
        verbose_name_plural = 'پیشنهادات خیاطان'
        ordering = ['proposed_price']
        unique_together = ['tailor', 'order']  # هر خیاط فقط یک پیشنهاد برای هر سفارش
    
    def __str__(self):
        return f"پیشنهاد {self.tailor.username} برای سفارش {self.order.id}"
    


class ChatMessage(models.Model):
    """پیام‌های چت بین مشتری و خیاط"""
    order = models.ForeignKey(SewingOrder, on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    
    # محتوای پیام
    message = models.TextField(verbose_name='متن پیام')
    is_read = models.BooleanField(default=False, verbose_name='خوانده شده')
    
    # زمان‌بندی
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'پیام چت'
        verbose_name_plural = 'پیام‌های چت'
        ordering = ['created_at']
    
    def __str__(self):
        return f"پیام از {self.sender.username} برای {self.receiver.username}"

class ChatSession(models.Model):
    """جلسه چت بین مشتری و خیاط"""
    order = models.OneToOneField(SewingOrder, on_delete=models.CASCADE, related_name='chat_session')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_chats')
    tailor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tailor_chats')
    
    # وضعیت چت
    STATUS_CHOICES = (
        ('active', 'فعال'),
        ('pending_close_customer', 'منتظر تأیید مشتری برای بستن'),
        ('pending_close_tailor', 'منتظر تأیید خیاط برای بستن'),
        ('closed', 'بسته شده'),
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='active')
    
    # زمان‌های شروع و پایان
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'جلسه چت'
        verbose_name_plural = 'جلسات چت'
    
    def __str__(self):
        return f"چت سفارش {self.order.id} - {self.customer.username} و {self.tailor.username}"