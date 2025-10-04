// قاموس أسماء البنوك بناءً على اسم الملف
const BANK_NAMES = {
    'ec1d5e_1c3e0ca031e047199f62ac91ef2bf774_mv2.jpg': 'بنك راس الخيمة الوطني',
    'ec1d5e_2bfe2be0588b48efb67a9822d0886934_mv2.png': 'مصرف عجمان',
    'ec1d5e_8a42ed870a994c4cab7b52d698bb6f22_mv2.jpg': 'بنك الفجيرة الوطني',
    'ec1d5e_57f13e8bcbdb419ca51adb805cc4cf1f_mv2.jpg': 'بنك دبي الاسلامي',
    'ec1d5e_9178b1bab14641be86ec3e5e6d423deb_mv2.jpg': 'بنك الامارات دبي الوطني',
    'ec1d5e_21496a76eddc4b5d88f5490c46b99749_mv2.jpg': 'بنك ابو ظبي التجاري',
    'ec1d5e_c9da68b1c907412b8a592aae7d894832_mv2.jpg': 'البنك التجاري الدولي',
    'ec1d5e_cf5ab8e9c26b45ab9c8403dc385f3f1a_mv2.jpg': 'مصرف الشارقة الاسلامي',
    'ec1d5e_dce5445978584fb999ae619dbc9c0923_mv2.jpg': 'الامارات الاسلامي',
    'ec1d5e_f7d640b391f545538945b33eafb04d03_mv2.jpg': 'بنك دبي التجاري',
    'HSBC-Logo-Membership.png': 'بنك HSBC',
    'IMG_20241118_091803_092.jpg': 'مصرف ابو ظبي الاسلامي ADIB',
    'IMG_20241118_091818_229.jpg': 'بنك ابو ظبي الاول',
    'تنزيل-١.jpg': 'المشرق'
};

// دالة للحصول على اسم البنك من مسار الصورة
function getBankNameFromImage(imageSrc) {
    // استخراج اسم الملف من المسار
    const fileName = imageSrc.split('/').pop();
    
    // البحث في القاموس
    if (BANK_NAMES[fileName]) {
        return BANK_NAMES[fileName];
    }
    
    // إذا لم يتم العثور على الاسم، نحاول فك تشفير اسم الملف
    try {
        const decodedFileName = decodeURIComponent(fileName);
        if (BANK_NAMES[decodedFileName]) {
            return BANK_NAMES[decodedFileName];
        }
    } catch (e) {
        console.error('خطأ في فك تشفير اسم الملف:', e);
    }
    
    // إذا لم نجد الاسم، نرجع اسم الملف
    return fileName;
}
