// مدیریت مودال انتخاب نوع کاربر

document.addEventListener('DOMContentLoaded', function() {
    // عناصر مودال
    const modalOverlay = document.getElementById('user-type-modal');
    const openLoginModalBtn = document.getElementById('open-login-modal');
    const openRegisterModalBtn = document.getElementById('open-register-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelSelectionBtn = document.getElementById('cancel-selection');
    const confirmSelectionBtn = document.getElementById('confirm-selection');
    const userOptions = document.querySelectorAll('.user-option');
    
    let selectedUserType = null;
    
    // باز کردن مودال از دکمه ورود
    if (openLoginModalBtn) {
        openLoginModalBtn.addEventListener('click', function() {
            openModal('ورود به حساب کاربری');
        });
    }
    
    // باز کردن مودال از دکمه ثبت نام
    if (openRegisterModalBtn) {
        openRegisterModalBtn.addEventListener('click', function() {
            openModal('ثبت نام در سبزکار');
        });
    }
    
    // بستن مودال
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // ریست کردن انتخاب‌ها
            selectedUserType = null;
            userOptions.forEach(option => option.classList.remove('selected'));
        }
    }
    
    function openModal(title) {
        if (modalOverlay) {
            // تنظیم عنوان مودال
            const modalTitle = document.getElementById('modal-title');
            if (modalTitle) {
                modalTitle.textContent = title;
            }
            
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // رویدادهای بستن مودال
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelSelectionBtn) {
        cancelSelectionBtn.addEventListener('click', closeModal);
    }
    
    // کلیک روی overlay برای بستن مودال
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // انتخاب نوع کاربر
    userOptions.forEach(option => {
        option.addEventListener('click', function() {
            // حذف انتخاب قبلی
            userOptions.forEach(opt => opt.classList.remove('selected'));
            
            // انتخاب جدید
            this.classList.add('selected');
            selectedUserType = this.getAttribute('data-user-type');
        });
    });
    
    // تأیید انتخاب
    if (confirmSelectionBtn) {
        confirmSelectionBtn.addEventListener('click', function() {
            if (!selectedUserType) {
                alert('لطفاً نوع حساب کاربری خود را انتخاب کنید.');
                return;
            }
            
            closeModal();
            
            // هدایت بر اساس نوع کاربر
            if (selectedUserType === 'customer') {
                // برای کاربر عادی - می‌توانید صفحه جداگانه‌ای بسازید
                alert('به زودی صفحه ثبت نام کاربران عادی راه‌اندازی خواهد شد.');
                // window.location.href = 'signup-customer.html';
            } else if (selectedUserType === 'tailor') {
                // برای خیاط - به صفحه ثبت نام خیاطان هدایت می‌شود
                window.location.href = 'signup-tailor.html';
            }
        });
    }
    
    // بستن مودال با کلید Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});