// مدیریت اسکرول هدر
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// مدیریت منوی موبایل
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchSection = document.querySelector('.search-section');
const authButtons = document.querySelector('.auth-buttons');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        searchSection.classList.toggle('active');
        authButtons.classList.toggle('active');
    });
}

// بستن منو هنگام کلیک روی لینک
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            searchSection.classList.remove('active');
            authButtons.classList.remove('active');
        }
    });
});

// عملکرد جستجو
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box input');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
        if (searchInput.value.trim() !== '') {
            alert(`در حال جستجوی: "${searchInput.value}"`);
            searchInput.value = '';
        } else {
            alert('لطفاً عبارت جستجو را وارد کنید.');
            searchInput.focus();
        }
    });

    // اجازه جستجو با دکمه اینتر
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// عملکرد دکمه‌های CTA در محتوا
const ctaRegisterBtn = document.getElementById('cta-register');
const ctaMoreBtn = document.getElementById('cta-more');

if (ctaRegisterBtn) {
    ctaRegisterBtn.addEventListener('click', function() {
        document.getElementById('open-register-modal').click();
    });
}

if (ctaMoreBtn) {
    ctaMoreBtn.addEventListener('click', function() {
        alert('صفحه اطلاعات بیشتر باز خواهد شد.');
    });
}

// اسکرول نرم برای لینک‌های داخلی
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});