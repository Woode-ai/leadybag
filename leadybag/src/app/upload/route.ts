import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // التجميع لضمان استقبال الملفات سواء كـ images أو file
    const files = [
      ...formData.getAll("images"),
      ...formData.getAll("file")
    ] as File[];

    if (!files || files.length === 0 || typeof files[0] === "string") {
      return NextResponse.json({ error: "لم يتم اختيار أي ملف" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // إنشاء مجلد الرفع تلقائياً إن لم يكن موجوداً
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || ".jpg";
      const filename = `product-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء حفظ الملف" }, { status: 500 });
  }
}