import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    // Replace with the actual phone number
    const phoneNumber = "919876543210"; 
    const text = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    window.open(whatsappUrl, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000]">
      {/* Chat Window */}
      <div 
        className={`absolute bottom-20 right-0 w-[350px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-[#E60023] p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm">MegaMart Support</h3>
              <p className="text-xs text-white/80 font-medium">We typically reply in minutes</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors border-none bg-transparent text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 bg-gray-50 h-[250px] overflow-y-auto flex flex-col gap-4">
          <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 w-[80%]">
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              Hi there! 👋 Welcome to MegaMart. Need help finding a product or checking your order? 
            </p>
            <span className="text-[10px] text-gray-400 font-bold mt-2 block">Just now</span>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#E60023] transition-colors"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-[#E60023] text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors border-none cursor-pointer shadow-lg shadow-red-200"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 border-none cursor-pointer ${isOpen ? 'bg-gray-900 rotate-90' : 'bg-[#E60023] animate-bounce-slow'}`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default FloatingChat;
