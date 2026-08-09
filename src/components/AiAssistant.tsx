"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatIcon, CloseIcon, SparklesIcon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAssistant() {
  const { language, isRtl } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome messages
  useEffect(() => {
    if (language === 'ar') {
      setMessages([
        { sender: 'ai', text: 'مرحباً بك في ريترو قطر! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟' }
      ]);
    } else {
      setMessages([
        { sender: 'ai', text: 'Welcome to RETRO Qatar! I am your AI assistant. How can I help you build, repair, or shop today?' }
      ]);
    }
  }, [language]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickQuestions = language === 'ar' ? [
    "كيف أتتبع حالة إصلاح جهازي؟",
    "اقترح تجميعة جهاز ألعاب مميز",
    "ما هي ساعات عمل فرع مشيرب؟",
    "قارن كرت RTX 4090 مع RTX 4070 Ti"
  ] : [
    "How do I track my repair status?",
    "Recommend a custom gaming PC setup",
    "What are Msheireb branch hours?",
    "Compare RTX 4090 and RTX 4070 Ti"
  ];

  const getAiResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    
    if (language === 'ar') {
      if (text.includes('صيانة') || text.includes('إصلاح') || text.includes('تتبع') || text.includes('جهاز')) {
        return "لتتبع حالة جهازك، يرجى الذهاب إلى صفحة 'مركز الصيانة' وإدخال رقم التذكرة الخاص بك (مثل RT-2601) في خانة التتبع لرؤية تحديثات الفني وتكلفة الصيانة مباشرة.";
      }
      if (text.includes('تجميع') || text.includes('بناء') || text.includes('جهاز') || text.includes('العاب') || text.includes('شراء')) {
        return "أنصحك باستخدام أداة 'باني الحواسيب' التفاعلية في شريط التنقل! تتيح لك الأداة اختيار المعالج وكرت الشاشة والذاكرة مع فحص فوري للتوافق واحتساب استهلاك الطاقة ومعدل الإطارات المتوقع.";
      }
      if (text.includes('ساعات') || text.includes('وقت') || text.includes('فرع') || text.includes('أوقات') || text.includes('الجمعة')) {
        return "نحن نعمل في فرع مشيرب من السبت إلى الخميس: 9:00 صباحاً - 1:00 ظهراً، ومن 4:00 عصراً - 10:00 مساءً. ويوم الجمعة هو يوم الإجازة الأسبوعية.";
      }
      if (text.includes('4090') || text.includes('4070') || text.includes('مقارنة') || text.includes('كرت')) {
        return "كرت RTX 4090 يحتوي على ذاكرة 24GB وهو الخيار الأقوى للألعاب بدقة 4K بمعدل إطارات يتجاوز 140 إطاراً. بينما كرت RTX 4070 Ti يوفر أداءً ممتازاً جداً بدقة 2K ومناسب جداً للميزانيات المتوسطة.";
      }
      return "سؤال رائع! يمكنك التواصل مع موظفي المبيعات لدينا مباشرة عبر الواتساب على الرقم 66223445 أو الصيانة على 31473585 للحصول على دعم فوري ومخصص.";
    } else {
      if (text.includes('repair') || text.includes('track') || text.includes('status') || text.includes('device')) {
        return "To track your device, please navigate to the 'Repair Hub' page and enter your Ticket ID (e.g., RT-2601) in the tracking search bar to view real-time status, technician logs, and cost.";
      }
      if (text.includes('pc') || text.includes('build') || text.includes('setup') || text.includes('parts') || text.includes('gaming')) {
        return "I recommend using our interactive 'PC Builder' tool! It guides you step-by-step to select compatible CPUs, GPUs, RAM, and calculates total wattage and estimated game FPS in real-time.";
      }
      if (text.includes('hour') || text.includes('time') || text.includes('open') || text.includes('friday') || text.includes('branch')) {
        return "Our Msheireb HQ branch is open Saturday to Thursday: 9:00 AM - 1:00 PM and 4:00 PM - 10:00 PM. We are closed on Fridays.";
      }
      if (text.includes('4090') || text.includes('4070') || text.includes('compare') || text.includes('gpu')) {
        return "The RTX 4090 (24GB VRAM) is the absolute flagship for 4K Ultra gaming (average 145 FPS in Cyberpunk). The RTX 4070 Ti (12GB VRAM) is an outstanding choice for ultra-smooth 1440p gaming.";
      }
      return "That's a good question! For direct assistance, you can click the WhatsApp contact link in our footer, or call us at +974 4000 1133.";
    }
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const response = getAiResponse(textToSend);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 z-50 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-4 text-white shadow-xl shadow-cyan-500/20 hover:scale-110 hover:shadow-purple-500/40 transition-all cursor-pointer select-none ring-2 ring-purple-400/30"
        style={{ left: isRtl ? '24px' : 'auto', right: isRtl ? 'auto' : '24px' }}
      >
        {isOpen ? <CloseIcon size={24} /> : <ChatIcon size={24} className="animate-pulse" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 z-50 flex h-[480px] w-[350px] sm:w-[380px] flex-col rounded-2xl border border-purple-500/30 neon-glass shadow-2xl overflow-hidden"
            style={{ left: isRtl ? '24px' : 'auto', right: isRtl ? 'auto' : '24px' }}
          >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-purple-950 p-4 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-cyan-500/10 p-1.5">
                <SparklesIcon size={18} className="text-cyan-400 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {language === 'ar' ? 'مساعد ريترو الذكي' : 'RETRO AI Assistant'}
                </h3>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping"></span>
                  {language === 'ar' ? 'متصل' : 'Online'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Messages Display */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-slate-950"
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="p-3 bg-slate-900/40 border-t border-purple-500/10 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] font-semibold bg-slate-900 hover:bg-purple-900/30 text-cyan-400 border border-cyan-500/20 rounded-full px-3 py-1 cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 bg-slate-950 border-t border-purple-500/20 flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type a message...'}
              className="flex-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm text-slate-100 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 text-white text-xs font-bold shadow-lg shadow-cyan-500/10 hover:shadow-purple-500/25 transition cursor-pointer"
            >
              {language === 'ar' ? 'إرسال' : 'Send'}
            </button>
          </form>

        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
