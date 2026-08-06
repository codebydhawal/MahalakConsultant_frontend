import React from "react";

interface WhatsAppButtonProps {
  number: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ number }) => {
  return (
    <a
      href={`https://wa.me/${number.replace(
        /\D/g,
        ""
      )}?text=Namaste Mahalak Consultants! I have a general enquiry.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-42 md:bottom-48 right-6 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl z-[100] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      title="General Enquiry"
    >
      <i className="fa-brands fa-whatsapp text-2xl md:text-3xl"></i>
    </a>
  );
};

export default WhatsAppButton;