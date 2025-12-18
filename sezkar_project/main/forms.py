# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, CustomerProfile, TailorProfile

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=15, required=True)
    user_type = forms.ChoiceField(
        choices=User.USER_TYPE_CHOICES,
        widget=forms.RadioSelect,
        initial='customer'
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'user_type', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # ترجمه فیلدها
        self.fields['username'].label = 'نام کاربری'
        self.fields['email'].label = 'ایمیل'
        self.fields['phone'].label = 'شماره تلفن'
        self.fields['user_type'].label = 'نوع حساب'
        self.fields['password1'].label = 'رمز عبور'
        self.fields['password2'].label = 'تکرار رمز عبور'
        
        # placeholder ها
        self.fields['username'].widget.attrs.update({'placeholder': 'نام کاربری'})
        self.fields['email'].widget.attrs.update({'placeholder': 'ایمیل'})
        self.fields['phone'].widget.attrs.update({'placeholder': '09123456789'})

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.phone = self.cleaned_data['phone']
        user.user_type = self.cleaned_data['user_type']
        
        if commit:
            user.save()
        return user


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(label='نام کاربری یا ایمیل')
    password = forms.CharField(widget=forms.PasswordInput, label='رمز عبور')
    remember_me = forms.BooleanField(required=False, label='مرا به خاطر بسپار')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'نام کاربری یا ایمیل'})
        self.fields['password'].widget.attrs.update({'placeholder': 'رمز عبور'})


class CustomerProfileForm(forms.ModelForm):
    class Meta:
        model = CustomerProfile
        fields = ['address', 'birth_date']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['address'].label = 'آدرس'
        self.fields['birth_date'].label = 'تاریخ تولد'
        self.fields['birth_date'].widget = forms.TextInput(attrs={'type': 'date'})


class TailorProfileForm(forms.ModelForm):
    class Meta:
        model = TailorProfile
        fields = [
            'workshop_name', 'experience_years',
            'address', 'city', 'province', 'postal_code',
            'skills'
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # ترجمه فیلدها
        self.fields['workshop_name'].label = 'نام کارگاه'
        self.fields['experience_years'].label = 'سابقه کار (سال)'
        self.fields['address'].label = 'آدرس'
        self.fields['city'].label = 'شهر'
        self.fields['province'].label = 'استان'
        self.fields['postal_code'].label = 'کد پستی'
        self.fields['skills'].label = 'مهارت‌ها'
        
        # placeholder ها
        self.fields['skills'].widget.attrs.update({'placeholder': 'مهارت‌های خود را با کاما جدا کنید'})



# forms.py - اضافه به انتهای فایل
from .models import SewingOrder

class SewingOrderForm(forms.ModelForm):
    custom_size = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'قد: ... سانتی‌متر\nباسن: ... سانتی‌متر\nکمر: ... سانتی‌متر\nسینه: ... سانتی‌متر'}),
        required=False,
        label='اندازه‌های دقیق بدن'
    )
    
    class Meta:
        model = SewingOrder
        fields = [
            'title', 'description', 'design_image',
            'size', 'custom_size', 'fabric_type', 'color_preference',
            'max_budget', 'deadline_days'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4, 'placeholder': 'توضیحات کامل درباره مدل دلخواه، نوع دوخت، جزئیات خاص و ...'}),
            'title': forms.TextInput(attrs={'placeholder': 'مثال: لباس مجلسی شیک زنانه'}),
            'fabric_type': forms.TextInput(attrs={'placeholder': 'مثال: حریر، ساتن، کشمیر و ...'}),
            'color_preference': forms.TextInput(attrs={'placeholder': 'مثال: مشکی، طلایی و نقره‌ای'}),
            'max_budget': forms.NumberInput(attrs={'placeholder': 'مثال: 1500000'}),
            'deadline_days': forms.NumberInput(attrs={'placeholder': 'مثال: 14'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # ترجمه فیلدها
        field_labels = {
            'title': 'عنوان سفارش',
            'description': 'توضیحات کامل سفارش',
            'design_image': 'عکس مدل یا طرح',
            'size': 'سایز استاندارد',
            'fabric_type': 'جنس پارچه مورد نظر',
            'color_preference': 'رنگ‌بندی دلخواه',
            'max_budget': 'حداکثر بودجه (تومان)',
            'deadline_days': 'حداکثر زمان تحویل (روز)',
        }
        
        for field_name, label in field_labels.items():
            if field_name in self.fields:
                self.fields[field_name].label = label