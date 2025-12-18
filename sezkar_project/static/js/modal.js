// متغیرهای حالت
let currentAction = ''; // 'login' یا 'register'
let selectedUserType = ''; // 'customer' یا 'tailor'

// مدیریت پنجره مودال
const loginBtn = document.getElementById('open-login-modal');
const registerBtn = document.getElementById('open-register-modal');
const modalOverlay = document.getElementById('user-type-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-selection');
const confirmBtn = document.getElementById('confirm-selection');
const modalTitle = document.getElementById('modal-title');
const userOptions = document.querySelectorAll('.user-option');

// باز کردن مودال برای ورود
if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        currentAction = 'login';
        modalTitle.textContent = 'ورود به حساب کاربری';
        openModal();
    });
}

// باز کردن مودال برای ثبت‌نام
if (registerBtn) {
    registerBtn.addEventListener('click', function() {
        currentAction = 'register';
        modalTitle.textContent = 'ایجاد حساب کاربری جدید';
        openModal();
    });
}

// باز کردن مودال
function openModal() {
    selectedUserType = '';
    resetUserOptions();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// بستن مودال
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedUserType = '';
    resetUserOptions();
}

// ریست کردن انتخاب‌های کاربر
function resetUserOptions() {
    userOptions.forEach(option => {
        option.classList.remove('selected');
    });
}

// بستن مودال با دکمه بستن
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// بستن مودال با دکمه انصراف
if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
}

// بستن مودال با کلیک روی پس‌زمینه
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// انتخاب نوع کاربر
userOptions.forEach(option => {
    option.addEventListener('click', function() {
        resetUserOptions();
        this.classList.add('selected');
        selectedUserType = this.dataset.userType;
    });
});

// تایید انتخاب و ادامه
if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
        if (!selectedUserType) {
            alert('لطفاً نوع حساب کاربری را انتخاب کنید.');
            return;
        }
        
        const userTypeText = selectedUserType === 'customer' ? 'کاربر عادی' : 'خیاط';
        const actionText = currentAction === 'login' ? 'ورود' : 'ثبت‌نام';
        
        alert(`شما در حال ${actionText} به عنوان ${userTypeText} هستید.\n\nصفحه ${actionText} برای ${userTypeText} باز خواهد شد.`);
        
        // در اینجا می‌توانید کاربر را به صفحه مربوطه هدایت کنید
        // window.location.href = `/${currentAction}-${selectedUserType}.html`;
        
        closeModal();
    });
}

// بستن مودال با کلید Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});