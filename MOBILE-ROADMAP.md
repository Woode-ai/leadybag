# خريطة طريق: تحويل leadybag إلى تطبيق موبايل (React Native)

هذا مخطط عملي لتحويل متجر leadybag لتطبيق موبايل حقيقي (iOS + Android)، مبني على ما بنيناه بالفعل - **الأخبار الجيدة: كل الـ Backend (كل واجهات الـ API) جاهز فعلاً ولن تحتاج تغيير أي شيء فيه.** التطبيق فقط "واجهة جديدة" تتحدث مع نفس الـ API.

---

## لماذا هذا سهل نسبياً في حالتك؟
لأننا فصلنا الواجهة الأمامية (Next.js) عن الخلفية (API Routes) من البداية. تطبيق React Native سيستخدم بالضبط نفس الروابط:
```
https://leadybag.com/api/products
https://leadybag.com/api/cart
https://leadybag.com/api/orders
...إلخ (كل الـ 12 مجموعة API التي بنيناها)
```

---

## المرحلة أ: الإعداد (يوم واحد تقريباً)
1. تثبيت Expo (أسهل طريقة لبدء React Native بدون تعقيد إعداد Xcode/Android Studio يدوياً):
   ```
   npx create-expo-app leadybag-mobile
   ```
2. تثبيت المكتبات الأساسية:
   ```
   npx expo install @react-navigation/native @react-navigation/native-stack
   npx expo install react-native-screens react-native-safe-area-context
   npx expo install @react-native-async-storage/async-storage
   npx expo install expo-secure-store
   ```

## المرحلة ب: إعادة استخدام منطق الأعمال (يومان تقريباً)
كل ملف في `src/lib/i18n.ts` (نصوص الترجمة) و منطق `apiClient.ts` قابل للنسخ شبه الحرفي:
- `apiClient.ts`: يبقى كما هو تقريباً، فقط `localStorage` تُستبدل بـ `AsyncStorage` (تخزين محلي في الموبايل)
- `i18n.ts`: يُنسخ حرفياً بدون تغيير
- منطق `AppContext.tsx`: يُنسخ مع تعديل بسيط (React Native لا يستخدم `document.dir`، بل مكتبة `react-native-localize` أو `I18nManager.forceRTL()` لدعم الاتجاه)

## المرحلة ج: بناء الشاشات (أسبوع إلى أسبوعين)
كل صفحة Next.js تقابلها "شاشة" (Screen) في React Native:

| صفحة الويب | شاشة الموبايل | ملاحظات |
|---|---|---|
| `/` | `HomeScreen` | `<img>` تصبح `<Image>`، `<div>` تصبح `<View>` |
| `/products` | `ProductsScreen` | استخدم `FlatList` بدل `.map()` (أداء أفضل لقوائم طويلة) |
| `/products/[id]` | `ProductDetailScreen` | معرض الصور يصبح `react-native-image-viewing` |
| `/cart` | `CartScreen` | نفس منطق الحساب تماماً |
| `/checkout` | `CheckoutScreen` | الدفع عبر Stripe يستخدم `@stripe/stripe-react-native` بدل التوجيه لرابط خارجي |
| `/admin/*` | تطبيق منفصل أو قسم محمي | عادة لوحة التحكم تبقى ويب فقط (الأدمن نادراً ما يديرها من الجوال) |

## المرحلة د: الإشعارات الفورية (يومان)
استبدال "Web Push" الحالي بـ:
```
npx expo install expo-notifications
```
يتطلب تعديلاً بسيطاً في الـ API الخلفي: حفظ "Push Token" الخاص بجهاز كل مستخدم (حقل جديد بسيط في نموذج User) بدل الاعتماد على متصفح الويب فقط.

## المرحلة هـ: الدردشة المباشرة (يوم واحد)
`socket.io-client` يعمل في React Native كما هو تماماً بدون تغيير - فقط:
```
npx expo install socket.io-client
```

## المرحلة و: النشر على المتاجر
1. **Android**: `eas build --platform android` (عبر Expo Application Services) → رفع ملف `.aab` على Google Play Console (رسوم تسجيل مرة واحدة: 25$)
2. **iOS**: يتطلب حساب Apple Developer (99$/سنة) → `eas build --platform ios` → رفع عبر App Store Connect

---

## تقدير الوقت الإجمالي
لمطوّر واحد متمكن من React: **3-4 أسابيع** من الشاشة الأولى حتى رفع نسخة أولى للمتجرين، بافتراض عدم تغيير أي شيء في الـ Backend (وهو ما لن تحتاجه فعلاً).

## نصيحة عملية
لا تبدأ ببناء التطبيق الكامل دفعة واحدة. ابدأ بشاشتين فقط (الرئيسية + المنتجات) متصلتين بالـ API الحقيقي، تأكد أنهما تعملان بسلاسة، ثم أضف الباقي شاشة شاشة - بنفس الأسلوب التدريجي الذي اتبعناه في بناء الموقع.
