// scripts/create-admin.js
// سكربت يُشغَّل مرة واحدة يدوياً لإنشاء حساب الأدمن الأول
// يُستخدم بالأمر: npm run create-admin
// يقرأ ADMIN_EMAIL و ADMIN_PASSWORD من ملف .env.local

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@leadybag.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

  if (!MONGODB_URI) {
    console.error("❌ لم يتم العثور على MONGODB_URI في .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ تم الاتصال بقاعدة البيانات");

  // نعرّف نموذج User بشكل مبسط هنا مباشرة (بدون استيراد TypeScript) لتجنب تعقيد الإعداد
  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: String,
      wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
  );
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️ يوجد حساب بالفعل بهذا البريد: ${ADMIN_EMAIL}`);
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("✅ تم ترقية هذا الحساب إلى أدمن");
    } else {
      console.log("ℹ️ هذا الحساب أدمن بالفعل");
    }
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    name: "مدير المتجر",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
    wishlist: [],
  });

  console.log("🎉 تم إنشاء حساب الأدمن بنجاح!");
  console.log(`   البريد الإلكتروني: ${ADMIN_EMAIL}`);
  console.log(`   كلمة المرور: ${ADMIN_PASSWORD}`);
  console.log("   يمكنك الآن تسجيل الدخول عبر /api/auth/login بهذه البيانات");

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ حدث خطأ:", err.message);
  process.exit(1);
});
