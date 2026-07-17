
export interface Product {
  id: number;
  name: string;
  category: 'Vastu' | 'Interior' | 'Decor';
  price: number;
  image: string;
  description: string; // HTML supported
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string; // HTML supported
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // HTML supported
  date: string;
  image: string;
  author: string;
  authorImage?: string; // New field for author picture
  readingTime: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number; // New field for sorting
}

export interface MediaItem {
  id: number;
  title: string;
  type: 'video' | 'podcast';
  thumbnail: string;
  link: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientCity: string;
  clientImage: string;
  message: string; // HTML supported
}

export interface SiteConfig {
  aboutTitle: string;
  aboutDescription: string;
  shortIntro: string;
  visionTitle: string;
  visionDescription1: string;
  visionDescription2: string;
  contactEmail: string;
  contactPhone: string;
  // Separate WhatsApp Channels
  whatsappShopping: string;   // For Orders
  whatsappEnquiry: string;    // For Services/Enquiry
  whatsappComplaint: string;  // For Support/Complaints
  whatsappNumber: string;     // Fallback / General (Mapped to Enquiry)
  vastuRedirectUrl: string; 
  address: string;
  statYearsExp: string;
  statProjectsDone: string;
  statVastuExp: string;
  statVastuAudits: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  headingFontSize: string;
  aboutImage1: string;
  aboutImage2: string;
  legacyImage: string;
  // Hero Media Support
  heroMediaType?: 'image' | 'video';
  heroMediaUrl?: string;
}
