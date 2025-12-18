from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime

from .models import User, CustomerProfile, TailorProfile, SewingOrder, TailorOffer, ChatMessage, ChatSession

# ---------- توابع اصلی ----------
def home(request):
    """صفحه اصلی"""
    # دریافت لیست ID سفارشاتی که خیاط لاگین کرده برای آنها پیشنهاد داده
    sent_offers = []
    if request.user.is_authenticated and request.user.user_type == 'tailor':
        sent_offers = list(TailorOffer.objects.filter(tailor=request.user).values_list('order_id', flat=True))
    
    # دریافت آخرین سفارشات منتظر خیاط (حداکثر ۳ مورد)
    recent_orders = SewingOrder.objects.filter(status='pending').order_by('-created_at')[:3]
    
    context = {
        'recent_orders': recent_orders,
        'sent_offers': sent_offers,
        'user': request.user
    }
    
    return render(request, 'main/index.html', context)

def customer_auth(request):
    """صفحه احراز هویت مشتریان"""
    if request.method == 'POST':
        if 'username' in request.POST and 'password' in request.POST:
            username = request.POST.get('username')
            password = request.POST.get('password')
            remember_me = request.POST.get('remember_me')
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                if not remember_me:
                    request.session.set_expiry(0)
                messages.success(request, f'خوش آمدید {user.username}!')
                return redirect('main:home')
            else:
                messages.error(request, 'نام کاربری یا رمز عبور اشتباه است.')
        
        elif 'register-name' in request.POST:
            fullname = request.POST.get('register-name')
            email = request.POST.get('register-email')
            phone = request.POST.get('register-phone')
            password = request.POST.get('register-password')
            confirm_password = request.POST.get('register-confirm-password')
            
            username = fullname.replace(' ', '_')[:30]
            
            errors = []
            if not fullname or not email or not phone or not password:
                errors.append('لطفاً تمام فیلدهای ضروری را پر کنید.')
            if password != confirm_password:
                errors.append('رمز عبور و تکرار آن یکسان نیستند.')
            if len(password) < 8:
                errors.append('رمز عبور باید حداقل ۸ کاراکتر باشد.')
            if User.objects.filter(username=username).exists():
                errors.append('این نام کاربری قبلاً ثبت شده است.')
            if User.objects.filter(email=email).exists():
                errors.append('این ایمیل قبلاً ثبت شده است.')
            
            if errors:
                for error in errors:
                    messages.error(request, error)
            else:
                try:
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                        user_type='customer',
                        phone=phone
                    )
                    CustomerProfile.objects.create(user=user)
                    login(request, user)
                    messages.success(request, 'ثبت‌نام شما با موفقیت انجام شد!')
                    return redirect('main:home')
                except Exception as e:
                    messages.error(request, 'خطا در ایجاد حساب کاربری')
    
    return render(request, 'main/customer_auth.html')

def tailor_auth(request):
    """صفحه احراز هویت خیاطان"""
    if request.method == 'POST':
        if 'login-username' in request.POST:
            username = request.POST.get('login-username')
            password = request.POST.get('login-password')
            remember_me = request.POST.get('remember-me')
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                try:
                    profile = user.tailor_profile
                    login(request, user)
                    if not remember_me:
                        request.session.set_expiry(0)
                    messages.success(request, f'خوش آمدید خیاط عزیز {user.username}!')
                    return redirect('main:home')
                except TailorProfile.DoesNotExist:
                    messages.error(request, 'این حساب برای خیاطان نیست.')
            else:
                messages.error(request, 'نام کاربری یا رمز عبور اشتباه است.')
        
        elif 'fullname' in request.POST:
            fullname = request.POST.get('fullname')
            username_input = request.POST.get('username')
            email = request.POST.get('email')
            phone = request.POST.get('phone')
            password = request.POST.get('password')
            confirm_password = request.POST.get('confirmPassword')
            
            errors = []
            if not all([fullname, username_input, email, phone, password, confirm_password]):
                errors.append('لطفاً تمام فیلدهای ضروری را پر کنید.')
            if password != confirm_password:
                errors.append('رمز عبور و تکرار آن یکسان نیستند.')
            if len(password) < 8:
                errors.append('رمز عبور باید حداقل ۸ کاراکتر باشد.')
            if User.objects.filter(username=username_input).exists():
                errors.append('این نام کاربری قبلاً ثبت شده است.')
            if User.objects.filter(email=email).exists():
                errors.append('این ایمیل قبلاً ثبت شده است.')
            
            if errors:
                for error in errors:
                    messages.error(request, error)
            else:
                try:
                    user = User.objects.create_user(
                        username=username_input,
                        email=email,
                        password=password,
                        user_type='tailor',
                        phone=phone
                    )
                    
                    TailorProfile.objects.create(
                        user=user,
                        national_code=request.POST.get('nationalCode', ''),
                        birth_date=request.POST.get('birthDate') or None,
                        education=request.POST.get('education', ''),
                        experience_years=0,
                        workshop_name=request.POST.get('workshopName', ''),
                        specialties=','.join(request.POST.getlist('specialties', [])),
                        services=','.join(request.POST.getlist('services', [])),
                        skills=request.POST.get('skills', ''),
                        province=request.POST.get('province', ''),
                        city=request.POST.get('city', ''),
                        address=request.POST.get('address', ''),
                        postal_code=request.POST.get('postalCode', '')
                    )
                    
                    login(request, user)
                    messages.success(request, 'حساب خیاط شما با موفقیت ایجاد شد!')
                    return redirect('main:home')
                except Exception as e:
                    messages.error(request, 'خطا در ایجاد حساب خیاط')
    
    return render(request, 'main/tailor_auth.html')

def user_logout(request):
    """خروج از حساب"""
    logout(request)
    messages.success(request, 'شما با موفقیت خارج شدید.')
    return redirect('main:home')

@login_required
def profile(request):
    """پروفایل کاربر"""
    user = request.user
    
    try:
        if user.user_type == 'customer':
            profile_obj = user.customer_profile
            template = 'main/customer_profile.html'
        else:
            profile_obj = user.tailor_profile
            template = 'main/tailor_profile.html'
    except:
        if user.user_type == 'customer':
            profile_obj = CustomerProfile.objects.create(user=user)
            template = 'main/customer_profile.html'
        else:
            profile_obj = TailorProfile.objects.create(user=user)
            template = 'main/tailor_profile.html'
    
    context = {
        'user': user,
        'profile': profile_obj,
        'user_type': user.user_type
    }
    
    return render(request, template, context)

# ---------- سفارشات ----------
from .forms import SewingOrderForm

@login_required
def create_order(request):
    """صفحه ایجاد سفارش جدید"""
    if request.user.user_type != 'customer':
        messages.error(request, 'فقط مشتریان می‌توانند سفارش ثبت کنند.')
        return redirect('main:home')
    
    if request.method == 'POST':
        form = SewingOrderForm(request.POST, request.FILES)
        if form.is_valid():
            order = form.save(commit=False)
            order.customer = request.user
            order.save()
            messages.success(request, 'سفارش شما با موفقیت ثبت شد! خیاطان به زودی پیشنهادات خود را ارسال می‌کنند.')
            return redirect('main:home')
        else:
            messages.error(request, 'لطفاً فرم را با دقت پر کنید.')
    else:
        form = SewingOrderForm()
    
    context = {
        'form': form,
        'user': request.user
    }
    return render(request, 'main/create_order.html', context)

def orders_list(request):
    """لیست سفارشات منتظر خیاط"""
    pending_orders = SewingOrder.objects.filter(status='pending').order_by('-created_at')[:10]
    context = {
        'pending_orders': pending_orders,
        'user': request.user
    }
    return render(request, 'main/orders_list.html', context)

# ---------- پیشنهادات و داشبورد ----------
@login_required
@csrf_exempt
def send_offer(request, order_id):
    """ارسال پیشنهاد از طرف خیاط"""
    if request.user.user_type != 'tailor':
        return JsonResponse({'success': False, 'error': 'فقط خیاطان می‌توانند پیشنهاد ارسال کنند.'})
    
    order = get_object_or_404(SewingOrder, id=order_id, status='pending')
    
    if request.method == 'POST':
        try:
            # لاگ داده‌های ورودی برای دیباگ
            print("POST data:", dict(request.POST))
            
            proposed_price = request.POST.get('proposed_price')
            delivery_days = request.POST.get('delivery_days')
            message = request.POST.get('message', '')
            
            if not proposed_price or not delivery_days:
                return JsonResponse({'success': False, 'error': 'قیمت و زمان تحویل الزامی است.'})
            
            # بررسی اینکه آیا قبلاً پیشنهاد داده شده یا نه
            existing_offer = TailorOffer.objects.filter(tailor=request.user, order=order).first()
            
            if existing_offer:
                # به‌روزرسانی پیشنهاد موجود
                existing_offer.proposed_price = proposed_price
                existing_offer.delivery_days = delivery_days
                existing_offer.message = message
                existing_offer.save()
                
                return JsonResponse({
                    'success': True, 
                    'message': 'پیشنهاد شما به‌روزرسانی شد!',
                    'offer_id': existing_offer.id
                })
            
            # ایجاد پیشنهاد جدید
            offer = TailorOffer.objects.create(
                tailor=request.user,
                order=order,
                proposed_price=proposed_price,
                delivery_days=delivery_days,
                message=message,
                status='pending'
            )
            
            return JsonResponse({
                'success': True, 
                'message': 'پیشنهاد شما با موفقیت ارسال شد!',
                'offer_id': offer.id
            })
            
        except Exception as e:
            print("Error in send_offer:", str(e))
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'درخواست نامعتبر'})

@login_required
def dashboard(request):
    """صفحه داشبورد اصلی"""
    user = request.user
    
    # لیست ID سفارشاتی که خیاط برای آنها پیشنهاد داده
    sent_offers = []
    if user.is_authenticated and user.user_type == 'tailor':
        sent_offers = list(TailorOffer.objects.filter(tailor=user).values_list('order_id', flat=True))
    
    # لیست پیشنهادات دریافتی برای مشتری
    received_offers = []
    if user.is_authenticated and user.user_type == 'customer':
        received_offers = TailorOffer.objects.filter(order__customer=user).select_related('tailor', 'order')
    
    # جلسات چت فعال
    active_chats = []
    if user.is_authenticated:
        if user.user_type == 'customer':
            active_chats = ChatSession.objects.filter(customer=user, status='active')
        else:
            active_chats = ChatSession.objects.filter(tailor=user, status='active')
    
    # سفارشات بر اساس نوع کاربر
    if user.is_authenticated and user.user_type == 'customer':
        user_orders = SewingOrder.objects.filter(customer=user).order_by('-created_at')[:6]
        recent_orders = SewingOrder.objects.filter(status='pending').exclude(customer=user).order_by('-created_at')[:3]
        
        context = {
            'user_orders': user_orders,
            'recent_orders': recent_orders,
            'sent_offers': sent_offers,
            'received_offers': received_offers,
            'active_chats': active_chats,
            'user_type': 'customer',
            'active_tab': 'my_orders'
        }
        
    else:
        recent_orders = SewingOrder.objects.filter(status='pending').order_by('-created_at')[:6]
        
        context = {
            'recent_orders': recent_orders,
            'sent_offers': sent_offers,
            'active_chats': active_chats,
            'user_type': user.user_type if user.is_authenticated else 'guest',
            'active_tab': 'all_orders'
        }
    
    context['user'] = user
    return render(request, 'main/dashboard_complete.html', context)

# ---------- مدیریت چت ----------
@login_required
def start_chat(request, offer_id):
    """شروع چت پس از پذیرش پیشنهاد توسط مشتری"""
    offer = get_object_or_404(TailorOffer, id=offer_id)
    
    # بررسی اینکه کاربر مشتری باشد و پیشنهاد برای سفارش او باشد
    if request.user != offer.order.customer:
        return JsonResponse({'success': False, 'error': 'شما مجاز به شروع چت برای این سفارش نیستید.'})
    
    # تغییر وضعیت پیشنهاد به پذیرفته شده
    offer.status = 'accepted'
    offer.save()
    
    # تغییر وضعیت سفارش
    order = offer.order
    order.status = 'in_progress'
    order.save()
    
    # ایجاد جلسه چت
    chat_session, created = ChatSession.objects.get_or_create(
        order=order,
        defaults={
            'customer': order.customer,
            'tailor': offer.tailor,
            'status': 'active'
        }
    )
    
    # ایجاد اولین پیام سیستم
    ChatMessage.objects.create(
        order=order,
        sender=request.user,
        receiver=offer.tailor,
        message=f'✅ پیشنهاد شما با قیمت {offer.proposed_price:,} تومان پذیرفته شد. لطفاً جزئیات را در اینجا مطرح کنید.',
        is_read=False
    )
    
    return JsonResponse({
        'success': True,
        'message': 'چت با خیاط شروع شد!',
        'chat_session_id': chat_session.id,
        'order_id': order.id
    })

@login_required
def get_chat_messages(request, chat_session_id):
    """دریافت پیام‌های چت"""
    chat_session = get_object_or_404(ChatSession, id=chat_session_id)
    
    # بررسی دسترسی کاربر به چت
    if request.user not in [chat_session.customer, chat_session.tailor]:
        return JsonResponse({'success': False, 'error': 'دسترسی غیرمجاز'})
    
    messages = ChatMessage.objects.filter(order=chat_session.order).order_by('created_at')
    
    # علامت‌گذاری پیام‌های دریافتی به عنوان خوانده شده
    unread_messages = messages.filter(receiver=request.user, is_read=False)
    unread_messages.update(is_read=True)
    
    messages_data = []
    for msg in messages:
        messages_data.append({
            'id': msg.id,
            'sender': {
                'id': msg.sender.id,
                'username': msg.sender.username,
                'user_type': msg.sender.user_type
            },
            'receiver': {
                'id': msg.receiver.id,
                'username': msg.receiver.username
            },
            'message': msg.message,
            'is_read': msg.is_read,
            'created_at': msg.created_at.strftime('%Y/%m/%d %H:%M'),
            'is_me': msg.sender == request.user
        })
    
    return JsonResponse({
        'success': True,
        'messages': messages_data,
        'chat_status': chat_session.status,
        'customer_id': chat_session.customer.id,
        'tailor_id': chat_session.tailor.id
    })

@login_required
@csrf_exempt
def send_chat_message(request, chat_session_id):
    """ارسال پیام در چت"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'متد غیرمجاز'})
    
    chat_session = get_object_or_404(ChatSession, id=chat_session_id)
    
    # بررسی دسترسی کاربر به چت
    if request.user not in [chat_session.customer, chat_session.tailor]:
        return JsonResponse({'success': False, 'error': 'دسترسی غیرمجاز'})
    
    # بررسی اینکه چت بسته نشده باشد
    if chat_session.status == 'closed':
        return JsonResponse({'success': False, 'error': 'این چت بسته شده است.'})
    
    data = json.loads(request.body)
    message_text = data.get('message', '').strip()
    
    if not message_text:
        return JsonResponse({'success': False, 'error': 'پیام نمی‌تواند خالی باشد.'})
    
    # تعیین دریافت کننده
    if request.user == chat_session.customer:
        receiver = chat_session.tailor
    else:
        receiver = chat_session.customer
    
    # ایجاد پیام جدید
    chat_message = ChatMessage.objects.create(
        order=chat_session.order,
        sender=request.user,
        receiver=receiver,
        message=message_text,
        is_read=False
    )
    
    # به‌روزرسانی آخرین فعالیت
    chat_session.last_activity = datetime.now()
    chat_session.save()
    
    return JsonResponse({
        'success': True,
        'message_id': chat_message.id,
        'created_at': chat_message.created_at.strftime('%Y/%m/%d %H:%M')
    })

@login_required
@csrf_exempt
def request_close_chat(request, chat_session_id):
    """درخواست بستن چت"""
    chat_session = get_object_or_404(ChatSession, id=chat_session_id)
    
    # بررسی دسترسی کاربر به چت
    if request.user not in [chat_session.customer, chat_session.tailor]:
        return JsonResponse({'success': False, 'error': 'دسترسی غیرمجاز'})
    
    if chat_session.status == 'closed':
        return JsonResponse({'success': False, 'error': 'این چت قبلاً بسته شده است.'})
    
    # بررسی اینکه آیا کاربر دیگر قبلاً درخواست بستن داده یا نه
    if request.user == chat_session.customer:
        if chat_session.status == 'pending_close_tailor':
            # هر دو موافقند، چت بسته شود
            chat_session.status = 'closed'
            chat_session.closed_at = datetime.now()
            chat_session.save()
            
            # ایجاد پیام سیستم
            ChatMessage.objects.create(
                order=chat_session.order,
                sender=request.user,
                receiver=chat_session.tailor,
                message='🔒 چت با توافق طرفین بسته شد.',
                is_read=False
            )
            
            return JsonResponse({
                'success': True,
                'message': 'چت با موفقیت بسته شد.',
                'chat_status': 'closed'
            })
        else:
            # درخواست بستن از طرف مشتری
            chat_session.status = 'pending_close_customer'
            chat_session.save()
            
            ChatMessage.objects.create(
                order=chat_session.order,
                sender=request.user,
                receiver=chat_session.tailor,
                message='📌 مشتری درخواست بستن چت را داده است. لطفاً تأیید کنید.',
                is_read=False
            )
            
            return JsonResponse({
                'success': True,
                'message': 'درخواست بستن چت ارسال شد. منتظر تأیید خیاط باشید.',
                'chat_status': 'pending_close_customer'
            })
    
    else:  # کاربر خیاط است
        if chat_session.status == 'pending_close_customer':
            # هر دو موافقند، چت بسته شود
            chat_session.status = 'closed'
            chat_session.closed_at = datetime.now()
            chat_session.save()
            
            ChatMessage.objects.create(
                order=chat_session.order,
                sender=request.user,
                receiver=chat_session.customer,
                message='🔒 چت با توافق طرفین بسته شد.',
                is_read=False
            )
            
            return JsonResponse({
                'success': True,
                'message': 'چت با موفقیت بسته شد.',
                'chat_status': 'closed'
            })
        else:
            # درخواست بستن از طرف خیاط
            chat_session.status = 'pending_close_tailor'
            chat_session.save()
            
            ChatMessage.objects.create(
                order=chat_session.order,
                sender=request.user,
                receiver=chat_session.customer,
                message='📌 خیاط درخواست بستن چت را داده است. لطفاً تأیید کنید.',
                is_read=False
            )
            
            return JsonResponse({
                'success': True,
                'message': 'درخواست بستن چت ارسال شد. منتظر تأیید مشتری باشید.',
                'chat_status': 'pending_close_tailor'
            })

@login_required
@csrf_exempt
def cancel_close_request(request, chat_session_id):
    """لغو درخواست بستن چت"""
    chat_session = get_object_or_404(ChatSession, id=chat_session_id)
    
    if request.user not in [chat_session.customer, chat_session.tailor]:
        return JsonResponse({'success': False, 'error': 'دسترسی غیرمجاز'})
    
    if chat_session.status not in ['pending_close_customer', 'pending_close_tailor']:
        return JsonResponse({'success': False, 'error': 'درخواست بستن فعال نیست.'})
    
    # بازگشت به حالت فعال
    chat_session.status = 'active'
    chat_session.save()
    
    ChatMessage.objects.create(
        order=chat_session.order,
        sender=request.user,
        receiver=chat_session.tailor if request.user == chat_session.customer else chat_session.customer,
        message='🔄 درخواست بستن چت لغو شد.',
        is_read=False
    )
    
    return JsonResponse({
        'success': True,
        'message': 'درخواست بستن چت لغو شد.',
        'chat_status': 'active'
    })

@login_required
def chat_page(request, chat_session_id):
    """صفحه چت"""
    chat_session = get_object_or_404(ChatSession, id=chat_session_id)
    
    # بررسی دسترسی کاربر
    if request.user not in [chat_session.customer, chat_session.tailor]:
        messages.error(request, 'دسترسی غیرمجاز')
        return redirect('main:dashboard')
    
    # اطلاعات سفارش
    order = chat_session.order
    offer = TailorOffer.objects.filter(order=order, tailor=chat_session.tailor).first()
    
    context = {
        'chat_session': chat_session,
        'order': order,
        'offer': offer,
        'user': request.user,
        'other_user': chat_session.tailor if request.user == chat_session.customer else chat_session.customer
    }
    
    return render(request, 'main/chat_page.html', context)

# ---------- توابع کمکی ----------
@login_required
def get_user_offers(request):
    """دریافت پیشنهادات کاربر"""
    if request.user.user_type == 'customer':
        offers = TailorOffer.objects.filter(order__customer=request.user).select_related('tailor', 'order')
    else:
        offers = TailorOffer.objects.filter(tailor=request.user).select_related('order', 'order__customer')
    
    offers_data = []
    for offer in offers:
        offers_data.append({
            'id': offer.id,
            'order_id': offer.order.id,
            'order_title': offer.order.title,
            'proposed_price': offer.proposed_price,
            'delivery_days': offer.delivery_days,
            'status': offer.status,
            'created_at': offer.created_at.strftime('%Y/%m/%d'),
            'tailor_name': offer.tailor.username if offer.tailor else '',
            'customer_name': offer.order.customer.username if offer.order.customer else ''
        })
    
    return JsonResponse({'success': True, 'offers': offers_data})

@login_required
def accept_offer(request, offer_id):
    """پذیرش پیشنهاد توسط مشتری"""
    offer = get_object_or_404(TailorOffer, id=offer_id)
    
    if request.user != offer.order.customer:
        return JsonResponse({'success': False, 'error': 'فقط مشتری می‌تواند پیشنهاد را بپذیرد.'})
    
    offer.status = 'accepted'
    offer.save()
    
    # تغییر وضعیت سفارش
    order = offer.order
    order.status = 'in_progress'
    order.save()
    
    # ایجاد جلسه چت
    chat_session, created = ChatSession.objects.get_or_create(
        order=order,
        defaults={
            'customer': order.customer,
            'tailor': offer.tailor,
            'status': 'active'
        }
    )
    
    # ارسال نوتیفیکیشن به خیاط
    ChatMessage.objects.create(
        order=order,
        sender=request.user,
        receiver=offer.tailor,
        message=f'✅ پیشنهاد شما با قیمت {offer.proposed_price:,} تومان پذیرفته شد. چت فعال شد.',
        is_read=False
    )
    
    return JsonResponse({
        'success': True,
        'message': 'پیشنهاد با موفقیت پذیرفته شد. چت با خیاط شروع شد.',
        'chat_session_id': chat_session.id
    })