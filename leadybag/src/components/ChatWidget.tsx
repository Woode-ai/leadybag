// src/components/ChatWidget.tsx
// فقاعة دردشة عائمة في أسفل الزاوية - هذا هو "مكان" الدردشة المباشرة الذي كان مفقوداً
// يظهر فقط للعملاء المسجلين دخولهم (الأدمن يستخدم صفحة مخصصة /admin/chats بدلاً منه)
//
// كيف تعمل: roomId = رقم حساب العميل نفسه (userId) - بهذا لكل عميل "غرفة" واحدة ثابتة يتحدث فيها مع الدعم
// عند فتح الفقاعة: نجلب سجل المحادثة القديم من قاعدة البيانات (GET /api/chat/:roomId)
// ثم نتصل بـ Socket.io لنستقبل أي رسالة جديدة لحظياً بدون تحديث الصفحة

"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { MessageCircle, X, Send } from "lucide-react";

interface ChatMessageItem {
  senderRole: "customer" | "admin";
  message: string;
  createdAt: string;
}

export default function ChatWidget() {
  const { user, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // فقط العملاء (وليس الأدمن) يرون هذه الفقاعة - الأدمن يدير كل المحادثات من /admin/chats
  const shouldShow = user && user.role === "customer";

  useEffect(() => {
    if (!shouldShow) return;

    // نتصل بـ Socket.io مرة واحدة فقط طالما المستخدم مسجّل دخوله (بغض النظر هل الفقاعة مفتوحة أم لا)
    // بهذا يستقبل إشعاراً حتى لو كانت النافذة مغلقة (يمكن تفعيل نقطة حمراء لاحقاً إن أردت)
    const socket = io({ path: "/socket.io" });
    socketRef.current = socket;
    socket.emit("join_room", user!.id);

    socket.on("receive_message", (data: any) => {
      if (data.roomId !== user!.id) return;
      setMessages((prev) => [
        ...prev,
        { senderRole: data.senderRole, message: data.message, createdAt: data.createdAt },
      ]);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function loadHistory() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiClient(`/chat/${user.id}`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (messages.length === 0) loadHistory();
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const messageText = input.trim();
    setInput("");

    try {
      // 1. نحفظ الرسالة في قاعدة البيانات (لتبقى في السجل حتى لو أغلق أحدهما المتصفح)
      await apiClient(`/chat/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ message: messageText }),
      });

      // 2. نبثّها لحظياً عبر Socket.io ليراها الأدمن فوراً إن كان متصلاً الآن
      socketRef.current?.emit("send_message", {
        roomId: user.id,
        senderId: user.id,
        senderRole: "customer",
        message: messageText,
      });

      // نضيفها محلياً فوراً لظهورها في نافذتنا نحن أيضاً بدون انتظار
      setMessages((prev) => [
        ...prev,
        { senderRole: "customer", message: messageText, createdAt: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
      setInput(messageText); // نُرجع النص للحقل إن فشل الإرسال حتى لا يضيع على المستخدم
    }
  }

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 end-4 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <span className="font-medium text-sm">
              {lang === "ar" ? "الدعم المباشر" : "Live Support"}
            </span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <p className="text-center text-xs text-gray-400 mt-4">
                {lang === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-xs text-gray-400 mt-4">
                {lang === "ar" ? "ابدأ محادثة مع فريق الدعم" : "Start a conversation with support"}
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                    m.senderRole === "customer"
                      ? "bg-primary text-white ms-auto rounded-ee-none"
                      : "bg-gray-100 text-secondary me-auto rounded-es-none"
                  }`}
                >
                  {m.message}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
              className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:opacity-90"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
