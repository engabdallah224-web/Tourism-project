import { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    dir: 'ltr',
    home: 'Home', tours: 'Tours', about: 'About', faq: 'FAQ',
    enquiry: 'Enquiry', privacy: 'Privacy Policy', terms: 'Terms & Conditions',
    signIn: 'Sign In', signUp: 'Sign Up', logout: 'Logout',
    profile: 'Profile', myBookings: 'My Bookings',
    hero_badge: 'Premium Travel Management System',
    hero_title: 'Discover beautiful places with confidence.',
    hero_sub: 'Find curated tour packages, compare destinations, and book your next adventure.',
    explore: 'Explore Packages →',
    createAccount: 'Create Account',
    allPackages: 'All Packages', packageList: 'Package List',
    viewAll: 'View all packages →', viewDetails: 'View Details',
    howItWorks: 'How It Works', simpleProcess: 'Simple Process',
    whyUs: 'Why choose us', travelEasier: 'Travel made easier',
    testimonials: 'Testimonials', lovedBy: 'Loved by travelers',
    getStarted: 'Get Started', browsePackages: 'Browse Packages',
    search: 'Search by name, location or type...',
    sortDefault: 'Sort: Default', nameAZ: 'Name A → Z',
    priceLow: 'Price: Low → High', priceHigh: 'Price: High → Low',
    price: 'Price:', category: 'Category:', clear: 'Clear',
    noPackages: 'No packages found yet.',
    startFrom: 'Starting from',
  },
  so: {
    dir: 'ltr',
    home: 'Hoyga', tours: 'Safarka', about: 'Naga Warran', faq: 'Su\'aalaha',
    enquiry: 'Weydiiso', privacy: 'Sirta Xogta', terms: 'Xeerarka',
    signIn: 'Gal', signUp: 'Diiwaangeli', logout: 'Bax',
    profile: 'Xogta', myBookings: 'Buugaagteeda',
    hero_badge: 'Nidaamka Maamulka Dalxiiska Heerka Sare',
    hero_title: 'Baadi goo goobaha quruxda badan.',
    hero_sub: 'Hel xulashooyinka safarka ee la xushay, isbarbar dhig meelaha, oo dalbaso safarkaga.',
    explore: 'Baadhi Xidmadaha →',
    createAccount: 'Samee Akoon',
    allPackages: 'Dhammaan Xidmadaha', packageList: 'Liiska Xidmadaha',
    viewAll: 'Arag dhammaan →', viewDetails: 'Arag Faahfaahinta',
    howItWorks: 'Sidee u Shaqeysaa', simpleProcess: 'Habka Fudud',
    whyUs: 'Maxaa naga doorbidaa', travelEasier: 'Safarku wuu sahlan yahay',
    testimonials: 'Markhaatiyada', lovedBy: 'Loo jecel yahay musafurada',
    getStarted: 'Bilow', browsePackages: 'Baadhi Xidmadaha',
    search: 'Raadi magaca, goobta ama nooca...',
    sortDefault: 'Kala sooc: Default', nameAZ: 'Magac A → Z',
    priceLow: 'Qiimaha: Hoose → Sare', priceHigh: 'Qiimaha: Sare → Hoose',
    price: 'Qiimaha:', category: 'Nooca:', clear: 'Nadiifi',
    noPackages: 'Xidmo lama helin.',
    startFrom: 'Bilaabmaya',
  },
  ar: {
    dir: 'rtl',
    home: 'الرئيسية', tours: 'الجولات', about: 'من نحن', faq: 'الأسئلة الشائعة',
    enquiry: 'استفسار', privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام',
    signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', logout: 'خروج',
    profile: 'الملف الشخصي', myBookings: 'حجوزاتي',
    hero_badge: 'نظام إدارة السياحة المتميز',
    hero_title: 'اكتشف أجمل الأماكن بثقة.',
    hero_sub: 'ابحث عن باقات السفر المنتقاة، قارن الوجهات، واحجز مغامرتك القادمة.',
    explore: '← استكشف الباقات',
    createAccount: 'إنشاء حساب',
    allPackages: 'جميع الباقات', packageList: 'قائمة الباقات',
    viewAll: '← عرض جميع الباقات', viewDetails: 'عرض التفاصيل',
    howItWorks: 'كيف يعمل', simpleProcess: 'عملية بسيطة',
    whyUs: 'لماذا تختارنا', travelEasier: 'السفر أصبح أسهل',
    testimonials: 'آراء العملاء', lovedBy: 'يحبه المسافرون',
    getStarted: 'ابدأ الآن', browsePackages: 'تصفح الباقات',
    search: 'ابحث بالاسم أو الموقع أو النوع...',
    sortDefault: 'ترتيب: افتراضي', nameAZ: 'الاسم أ → ي',
    priceLow: 'السعر: من الأقل', priceHigh: 'السعر: من الأعلى',
    price: 'السعر:', category: 'الفئة:', clear: 'مسح',
    noPackages: 'لا توجد باقات بعد.',
    startFrom: 'يبدأ من',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('tms-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('tms-lang', lang);
    const t = translations[lang];
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
