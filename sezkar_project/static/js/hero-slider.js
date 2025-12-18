// اسلایدشو هیرو سکشن - نسخه بدون دکمه
document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای اسلایدشو
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 7000; // 7 ثانیه
    
    // تابع نمایش اسلاید خاص
    function showSlide(index) {
        // پنهان کردن تمام اسلایدها
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // غیرفعال کردن تمام نشانگرها
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // نمایش اسلاید جاری
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
        
        // به روز رسانی انیمیشن‌های محتوا
        updateContentAnimation();
    }
    
    // تابع نمایش اسلاید بعدی
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // تابع نمایش اسلاید قبلی
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // به روز رسانی انیمیشن‌های محتوا
    function updateContentAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const heroExtra = document.querySelector('.hero-extra');
        
        // ریست انیمیشن‌ها برای اجرای مجدد
        [heroTitle, heroDescription, heroExtra].forEach(element => {
            if (element) {
                element.style.animation = 'none';
                element.offsetHeight; // trigger reflow
            }
        });
        
        // اعمال مجدد انیمیشن‌ها با تاخیر
        setTimeout(() => {
            if (heroTitle) {
                heroTitle.style.animation = 'fadeInUpHero 1.2s ease-out 0.3s both, textGlow 3s ease-in-out 2s infinite';
            }
            if (heroDescription) {
                heroDescription.style.animation = 'fadeInUpHero 1.2s ease-out 0.5s both';
            }
            if (heroExtra) {
                heroExtra.style.animation = 'fadeInUpHero 1.2s ease-out 0.7s both';
            }
        }, 100);
    }
    
    // شروع اسلایدشو خودکار
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // توقف اسلایدشو خودکار
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // رویدادها برای دکمه‌های کنترل
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });
    }
    
    // رویدادها برای نشانگرها
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });
    
    // تنظیم ارتفاع هیرو بر اساس ارتفاع ویوپورت
    function adjustHeroHeight() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && window.innerWidth > 768) {
            const vh = window.innerHeight * 0.85;
            heroSection.style.height = Math.min(vh, 800) + 'px';
        }
    }
    
    // شروع اسلایدشو
    showSlide(0);
    startSlideShow();
    
    // تنظیم ارتفاع اولیه
    adjustHeroHeight();
    
    // تنظیم مجدد ارتفاع هنگام تغییر سایز پنجره
    window.addEventListener('resize', adjustHeroHeight);
    
    // توقف اسلایدشو هنگام هاور روی هیرو
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlideShow);
        heroSlider.addEventListener('mouseleave', startSlideShow);
    }
    
    // برای دستگاه‌های لمسی - سوایپ
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (heroSlider) {
        heroSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopSlideShow();
        });
        
        heroSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            setTimeout(startSlideShow, 5000);
        });
    }
    
    // تشخیص سوایپ
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // سوایپ به چپ - اسلاید بعدی
            nextSlide();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // سوایپ به راست - اسلاید قبلی
            prevSlide();
        }
    }
    
    // کلیدهای کیبورد برای کنترل اسلایدشو
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        }
    });
    
    // انیمیشن متن‌های طولانی
    function checkTextOverflow() {
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        
        if (heroTitle && heroTitle.scrollHeight > heroTitle.clientHeight) {
            heroTitle.style.lineHeight = '1.2';
        }
        
        if (heroDescription && heroDescription.scrollHeight > heroDescription.clientHeight) {
            heroDescription.style.lineHeight = '1.5';
        }
    }
    
    // بررسی overflow متن‌ها
    setTimeout(checkTextOverflow, 1000);
    window.addEventListener('resize', checkTextOverflow);
});