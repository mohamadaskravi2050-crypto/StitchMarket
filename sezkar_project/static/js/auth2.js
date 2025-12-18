// اسکریپت‌های مربوط به صفحه ثبت نام/ورود خیاطان

document.addEventListener('DOMContentLoaded', function() {
    // تغییر بین فرم ثبت نام و ورود
    const registerTab = document.getElementById('register-tab');
    const loginTab = document.getElementById('login-tab');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const switchToLogin = document.getElementById('switch-to-login');
    const switchToRegister = document.getElementById('switch-to-register');
    
    // رویداد تغییر تب
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
    
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });
    
    // رویداد تغییر فرم از طریق لینک
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            loginTab.click();
        });
    }
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            registerTab.click();
        });
    }
    
    // مدیریت مهارت‌ها
    const skillsContainer = document.getElementById('skills-container');
    const newSkillInput = document.getElementById('new-skill');
    const addSkillBtn = document.getElementById('add-skill-btn');
    
    if (addSkillBtn && newSkillInput && skillsContainer) {
        addSkillBtn.addEventListener('click', function() {
            const skillText = newSkillInput.value.trim();
            if (skillText) {
                const skillTag = document.createElement('div');
                skillTag.className = 'skill-tag';
                skillTag.innerHTML = `
                    ${skillText}
                    <span class="remove-skill">&times;</span>
                `;
                
                // رویداد حذف مهارت
                skillTag.querySelector('.remove-skill').addEventListener('click', function() {
                    skillTag.remove();
                });
                
                skillsContainer.appendChild(skillTag);
                newSkillInput.value = '';
            }
        });
        
        // افزودن مهارت با Enter
        newSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillBtn.click();
            }
        });
    }
    
    // مدیریت انتخاب استان و شهر
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    
    const citiesByProvince = {
        'tehran': ['تهران', 'کرج', 'اسلامشهر', 'شهریار', 'قدس', 'رباط‌کریم', 'پاکدشت', 'ورامین'],
        'alborz': ['کرج', 'هشتگرد', 'طالقان', 'نظرآباد', 'اشتهارد', 'فردیس'],
        'isfahan': ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'شهرضا', 'مبارکه'],
        'fars': ['شیراز', 'مرودشت', 'کازرون', 'فسا', 'جهرم', 'لار'],
        'khorasan-razavi': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'قوچان', 'کاشمر'],
        'azarbaijan-sharghi': ['تبریز', 'مراغه', 'مرند', 'اهر', 'سراب', 'میانه'],
        'mazandaran': ['ساری', 'بابل', 'آمل', 'قائمشهر', 'نور', 'نوشهر'],
        'khozestan': ['اهواز', 'دزفول', 'آبادان', 'خرمشهر', 'شوشتر', 'مسجدسلیمان'],
        'qom': ['قم'],
        'kerman': ['کرمان', 'سیرجان', 'رفسنجان', 'بم', 'جیرفت', 'زرند']
    };
    
    if (provinceSelect && citySelect) {
        provinceSelect.addEventListener('change', function() {
            const selectedProvince = this.value;
            citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
            
            if (selectedProvince && citiesByProvince[selectedProvince]) {
                citiesByProvince[selectedProvince].forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            }
        });
    }
    
    // مدیریت آپلود تصویر
    const profileUpload = document.getElementById('profile-upload');
    const portfolioUpload = document.getElementById('portfolio-upload');
    
    function setupImageUpload(uploadArea, type) {
        if (!uploadArea) return;
        
        uploadArea.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            if (type === 'portfolio') {
                input.multiple = true;
            }
            input.click();
            
            input.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    let fileNames = '';
                    if (this.files.length === 1) {
                        fileNames = this.files[0].name;
                    } else {
                        fileNames = `${this.files.length} فایل انتخاب شد`;
                    }
                    
                    uploadArea.innerHTML = `
                        <i class="fas fa-check-circle upload-icon" style="color: #4CAF50;"></i>
                        <div class="upload-text">${fileNames}</div>
                        <div class="upload-hint">برای تغییر فایل کلیک کنید</div>
                    `;
                }
            });
        });
    }
    
    setupImageUpload(profileUpload, 'profile');
    setupImageUpload(portfolioUpload, 'portfolio');
    
    // پاک کردن فرم
    const resetFormBtn = document.getElementById('reset-form');
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            if (confirm('آیا از پاک کردن تمام اطلاعات فرم اطمینان دارید؟')) {
                document.getElementById('register-form').reset();
                if (skillsContainer) skillsContainer.innerHTML = '';
                if (profileUpload) {
                    profileUpload.innerHTML = `
                        <i class="fas fa-camera upload-icon"></i>
                        <div class="upload-text">برای آپلود تصویر پروفایل کلیک کنید</div>
                        <div class="upload-hint">فرم‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)</div>
                    `;
                }
                if (portfolioUpload) {
                    portfolioUpload.innerHTML = `
                        <i class="fas fa-images upload-icon"></i>
                        <div class="upload-text">برای آپلود نمونه کارها کلیک کنید</div>
                        <div class="upload-hint">فرم‌های مجاز: JPG, PNG (حداکثر ۵ مگابایت)</div>
                    `;
                }
            }
        });
    }
    
    // اعتبارسنجی فرم ثبت نام
    const registerFormElement = document.getElementById('register-form');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // اعتبارسنجی ساده
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('رمز عبور و تکرار آن یکسان نیستند.');
                return;
            }
            
            // اعتبارسنجی شماره تلفن
            const phone = document.getElementById('phone').value;
            const phoneRegex = /^09[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('شماره تلفن همراه معتبر نیست. لطفا شماره ۱۱ رقمی وارد کنید.');
                return;
            }
            
            // اعتبارسنجی کد ملی
            const nationalCode = document.getElementById('nationalCode').value;
            if (nationalCode.length !== 10) {
                alert('کد ملی باید ۱۰ رقمی باشد.');
                return;
            }
            
            // شبیه‌سازی ثبت نام موفق
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ثبت نام...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('ثبت‌نام شما با موفقیت انجام شد! اطلاعات شما در حال بررسی است و پس از تایید، ایمیلی برایتان ارسال خواهد شد.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                // در اینجا می‌توانید اطلاعات را به سرور ارسال کنید
            }, 1500);
        });
    }
    
    // اعتبارسنجی فرم ورود
    const loginFormElement = document.getElementById('login-form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            if (!username || !password) {
                alert('لطفا نام کاربری و رمز عبور را وارد کنید.');
                return;
            }
            
            // شبیه‌سازی ورود موفق
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ورود...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('ورود شما با موفقیت انجام شد! در حال انتقال به پنل کاربری...');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                // در اینجا می‌توانید اطلاعات را به سرور ارسال کنید
                // window.location.href = 'tailor-dashboard.html';
            }, 1500);
        });
    }
    
    // رفتن به فرم ورود از دکمه هدر
    const goToLoginBtn = document.getElementById('go-to-login');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginTab) loginTab.click();
            window.scrollTo({
                top: document.querySelector('.auth-container').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    // رفتن به فرم ثبت نام از دکمه هدر
    const goToRegisterBtn = document.getElementById('go-to-register');
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerTab) registerTab.click();
            window.scrollTo({
                top: document.querySelector('.auth-container').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
});