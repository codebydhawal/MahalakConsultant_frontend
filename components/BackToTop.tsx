import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface BackToTopProps {
  accentColor: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ accentColor }) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.pageYOffset > 400);
    };

    window.addEventListener("scroll", toggleVisible);

    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  if (location.pathname !== "/" || !visible) {
    return null;
  }

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 md:bottom-8 right-6 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white text-stone-900 border border-stone-200 rounded-full shadow-2xl z-[100] flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-4"
      title="Back to Top"
    >
      <i className="fa-solid fa-arrow-up text-xl md:text-2xl"></i>
    </button>
  );
};

export default BackToTop;