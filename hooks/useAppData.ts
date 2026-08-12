import { useState } from "react";
import { SiteConfig } from "../types";

const defaultSiteConfig: SiteConfig = {
  aboutTitle: "Design Beyond Structures",
  shortIntro:
    "Mahalak Consultants is a premier design studio blending structural innovation with spiritual wellness.",
  aboutDescription: "Crafting excellence for over 16 years.",
  visionTitle: "The Energy of Architecture",
  visionDescription1: "Creating spaces that elevate consciousness.",
  visionDescription2: "Sustainable, structural, spiritual.",
  contactEmail: "studio@mahalakconsultant.com",
  contactPhone: "+91 9893389629",
  whatsappShopping: "+91 7879628738",
  whatsappEnquiry: "+91 9893389629",
  whatsappComplaint: "+91 9109249478",
  whatsappNumber: "+91 9893389629",
  vastuRedirectUrl: "#/contact",
  address: "11-B, Shri Nagar Colony, Berasiya Road, Bhopal (MP)| India",
  statYearsExp: "12+",
  statProjectsDone: "100+",
  statVastuExp: "7+",
  statVastuAudits: "50+",
  accentColor: "#b45309",
  headingFont: "'Playfair Display', serif",
  bodyFont: "'Inter', sans-serif",
  headingFontSize: "text-7xl",
  aboutImage1: "https://picsum.photos/seed/ab1/400/400",
  aboutImage2: "https://picsum.photos/seed/ab2/400/400",
  legacyImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  heroMediaType: "image",
  heroMediaUrl:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
};

const useAppData = () => {
  const [siteConfig, setSiteConfig] =
    useState<SiteConfig>(defaultSiteConfig);

  return {
    siteConfig,
  };
};

export default useAppData;
