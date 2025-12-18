// اسکریپت اصلی سایت

document.addEventListener('DOMContentLoaded', function() {
    // اسکرول هدر
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // منوی موبایل
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // بستن منو با کلیک روی لینک
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // جستجو
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                alert(`جستجو برای: "${searchTerm}"`);
                // در اینجا می‌توانید عملیات جستجو را انجام دهید
            } else {
                searchInput.focus();
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // اسکرول نرم به بخش‌ها
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // دکمه‌های CTA در صفحه اصلی
    const ctaRegister = document.getElementById('cta-register');
    const ctaMore = document.getElementById('cta-more');
    
    if (ctaRegister) {
        ctaRegister.addEventListener('click', function() {
            window.location.href = 'signup-tailor.html';
        });
    }
    
    if (ctaMore) {
        ctaMore.addEventListener('click', function() {
            window.scrollTo({
                top: document.getElementById('about-section').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    // دکمه‌های افزودن به سبد خرید
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            this.innerHTML = '<i class="fas fa-check"></i> افزوده شد';
            this.style.backgroundColor = '#4CAF50';
            
            // بازگشت به حالت اولیه بعد از 2 ثانیه
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> افزودن به سبد';
                this.style.backgroundColor = '';
            }, 2000);
            
            // نمایش پیام
            showNotification(`"${productName}" به سبد خرید اضافه شد`);
        });
    });
    
    // دکمه‌های رزرو مشاوره
    document.querySelectorAll('.order-service').forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.closest('.service-card').querySelector('h3').textContent;
            showNotification(`درخواست مشاوره با "${serviceName}" ثبت شد`);
            
            // تغییر موقت دکمه
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> درخواست ثبت شد';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
    
    // تابع نمایش نوتیفیکیشن
    function showNotification(message) {
        // اگر قبلاً نوتیفیکیشنی وجود دارد، حذفش کن
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // ایجاد نوتیفیکیشن جدید
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // استایل نوتیفیکیشن
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-green);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            box-shadow: 0 5px 20px rgba(46, 125, 50, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease-out;
        `;
        
        // اضافه کردن انیمیشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // حذف خودکار بعد از 3 ثانیه
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});