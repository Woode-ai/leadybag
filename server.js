// server.js
// هذا الملف يستبدل طريقة تشغيل Next.js الافتراضية بسيرفر مخصص
// السبب: Socket.io (الدردشة المباشرة) يحتاج اتصالاً "مستمراً" (WebSocket)
// وهذا لا يعمل مع طريقة تشغيل Next.js العادية (npm run dev العادي لا يكفي للدردشة)
// لذلك من الآن فصاعداً، تشغيل المشروع يكون بالأمر: node server.js

const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");
require("dotenv").config({ path: ".env.local" });

const dev = process.env.NODE_ENV !== "production";

// في التطوير المحلي: نستخدم localhost والمنفذ 3000 دائماً
// في الإنتاج (بعد النشر على Railway/Render/أي منصة): هذه المنصات تحدد المنفذ تلقائياً
// عبر متغير بيئة PORT، ويجب الربط بـ 0.0.0.0 (وليس localhost) ليكون السيرفر قابلاً للوصول من الخارج
const hostname = dev ? "localhost" : "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// دومين الموقع الحقيقي بعد النشر - يُستخدم لتقييد الدردشة المباشرة على دومينك فقط بدلاً من "*"
// في التطوير المحلي، نتركه "*" لأنه أسهل للاختبار (لا يوجد دومين حقيقي بعد)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  // نُنشئ سيرفر Socket.io فوق نفس السيرفر (نفس المنفذ)
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigin },
  });

  io.on("connection", (socket) => {
    console.log("🟢 مستخدم جديد اتصل بالدردشة:", socket.id);

    // العميل أو الأدمن ينضم إلى "غرفة" محادثة معينة (roomId = عادة userId الخاص بالعميل)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 انضم ${socket.id} إلى الغرفة: ${roomId}`);
    });

    // عند إرسال رسالة جديدة، نبثّها لكل من في نفس الغرفة (العميل + الأدمن)
    socket.on("send_message", (data) => {
      // data = { roomId, senderId, senderRole, message }
      io.to(data.roomId).emit("receive_message", {
        ...data,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 انقطع اتصال المستخدم:", socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`✅ السيرفر يعمل على http://${hostname}:${port}`);
    console.log("💬 نظام الدردشة المباشرة (Socket.io) جاهز");
  });
});
