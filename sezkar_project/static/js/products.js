// اسکریپت اسلایدر محصولات و خدمات
document.addEventListener('DOMContentLoaded', function() {
    // راه‌اندازی اسلایدر محصولات
    setupSlider('products');
    
    // راه‌اندازی اسلایدر خدمات
    setupSlider('services');
    
    // تابع راه‌اندازی اسلایدر
    function setupSlider(type) {
        const container = document.querySelector(`.${type}-container`);
        const cards = document.querySelectorAll(`.${type}-card`);
        const prevBtn = document.getElementById(`${type}-prev`);
        const nextBtn = document.getElementById(`${type}-next`);
        const indicatorsContainer = document.getElementById(`${type}-indicators`);
        
        if (!container || cards.length === 0) return;
        
        let currentIndex = 0;
        const cardsPerView = getCardsPerView();
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        
        // ایجاد نشانگرها به صورت داینامیک
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.className = `slider-indicator ${i === 0 ? 'active' : ''}`;
                indicator.dataset.slide = i;
                indicator.innerHTML = '';
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }
        
        // تابع به‌روزرسانی موقعیت اسلایدر
        function updateSlider() {
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].offsetWidth + 30; // عرض کارت + gap
            const translateX = -currentIndex * cardsPerView * cardWidth;
            container.style.transform = `translateX(${translateX}px)`;
            
            // به‌روزرسانی نشانگرها
            const indicators = document.querySelectorAll(`#${type}-indicators .slider-indicator`);
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
            
            // کنترل نمایش دکمه‌ها
            if (prevBtn) {
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
                prevBtn.disabled = currentIndex === 0;
            }
            
            if (nextBtn) {
                nextBtn.style.opacity = currentIndex >= totalSlides - 1 ? '0.5' : '1';
                nextBtn.style.cursor = currentIndex >= totalSlides - 1 ? 'not-allowed' : 'pointer';
                nextBtn.disabled = currentIndex >= totalSlides - 1;
            }
        }
        
        // تابع رفتن به اسلاید خاص
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIndex = index;
            updateSlider();
        }
        
        // تابع تعیین تعداد کارت در هر ویو
        function getCardsPerView() {
            const width = window.innerWidth;
            if (width >= 1200) return 3;
            if (width >= 768) return 2;
            return 1;
        }
        
        // رویدادهای دکمه‌های کنترل
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateSlider();
                }
            });
        }
        
        // رویدادهای دکمه‌های عملیاتی
        const actionBtns = document.querySelectorAll(`.${type}-card .add-to-cart, .${type}-card .order-service`);
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest(`.${type}-card`);
                const productName = productCard.querySelector('h3').textContent;
                const priceElement = productCard.querySelector('.price');
                const productPrice = priceElement ? priceElement.textContent : 'قیمت نامشخص';
                
                // افکت کلیک
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                // نمایش پیام
                if (type === 'products') {
                    alert(`✅ محصول "${productName}" به سبد خرید اضافه شد!\n💰 قیمت: ${productPrice}`);
                } else {
                    alert(`✅ سفارش "${productName}" ثبت شد!\n💰 قیمت: ${productPrice}\n\n📞 خیاط با شما تماس خواهد گرفت.`);
                }
            });
        });
        
        // رویداد resize برای تغییر تعداد کارت‌ها
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newCardsPerView = getCardsPerView();
                const newTotalSlides = Math.ceil(cards.length / newCardsPerView);
                
                // اگر ایندکس فعلی بیشتر از اسلایدهای جدید باشد
                if (currentIndex >= newTotalSlides) {
                    currentIndex = newTotalSlides - 1;
                }
                
                // بازسازی نشانگرها
                if (indicatorsContainer) {
                    indicatorsContainer.innerHTML = '';
                    for (let i = 0; i < newTotalSlides; i++) {
                        const indicator = document.createElement('button');
                        indicator.className = `slider-indicator ${i === currentIndex ? 'active' : ''}`;
                        indicator.dataset.slide = i;
                        indicator.innerHTML = '';
                        indicator.addEventListener('click', () => goToSlide(i));
                        indicatorsContainer.appendChild(indicator);
                    }
                }
                
                updateSlider();
            }, 250);
        });
        
        // مقداردهی اولیه
        updateSlider();
        
        // اسلایدشو خودکار (اختیاری)
        let autoSlideInterval;
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            }, 5000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // شروع اسلایدشو خودکار
        startAutoSlide();
        
        // توقف هنگام هاور
        const slider = document.querySelector(`.${type}-slider`);
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);
            
            // برای دستگاه‌های لمسی
            slider.addEventListener('touchstart', stopAutoSlide);
            slider.addEventListener('touchend', function() {
                setTimeout(startAutoSlide, 3000);
            });
        }
    }
});