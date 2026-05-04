import React from "react";
import { useLocation } from "react-router-dom";
import { Shield, FileText, RefreshCcw } from "lucide-react";

const PolicyPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const content = {
    "/privacy-policy": {
      title: "Privacy Policy",
      icon: <Shield size={48} className="text-[#E60023]" />,
      text: "At Variety MegaMart, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our website. We ensure that your data is handled with the highest level of security and in compliance with global data protection regulations."
    },
    "/terms-of-service": {
      title: "Terms of Service",
      icon: <FileText size={48} className="text-[#E60023]" />,
      text: "By accessing and using Variety MegaMart, you agree to comply with our terms and conditions. These terms govern your use of our services, including browsing, purchasing, and interacting with our platform. Please read them carefully before making any transactions."
    },
    "/return-policy": {
      title: "Return Policy",
      icon: <RefreshCcw size={48} className="text-[#E60023]" />,
      text: "We want you to be completely satisfied with your purchase. If you're not happy with an item, our return policy allows you to return products within 7 days of delivery, provided they are in their original condition and packaging. Please contact our support team to initiate a return."
    }
  };

  const active = content[path] || content["/privacy-policy"];

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-20 px-5 font-sans">
      <div className="max-w-[800px] mx-auto bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-red-50 p-6 rounded-3xl mb-6">
            {active.icon}
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{active.title}</h1>
          <div className="h-1.5 w-20 bg-[#E60023] mt-4 rounded-full" />
        </div>

        <div className="prose prose-lg text-gray-600 leading-relaxed font-medium">
          <p>{active.text}</p>
          <p className="mt-6">
            If you have any questions regarding our {active.title.toLowerCase()}, please reach out to our legal department at <span className="text-[#E60023] font-bold">legal@varietymegastore.com</span>.
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last Updated: May 2026</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
