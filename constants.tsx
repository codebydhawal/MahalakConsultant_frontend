
import { Product, Project, BlogPost, MediaItem } from './types';

export const PROJECTS: Project[] = [
  { 
    id: 1, 
    title: 'Modern Sustainable Villa', 
    category: 'Architecture', 
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    description: 'A cutting-edge sustainable villa design that prioritizes energy efficiency and natural lighting while maintaining a luxurious aesthetic.'
  },
  { 
    id: 2, 
    title: 'Minimalist Living Room', 
    category: 'Interior Design', 
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    description: 'An interior design project focusing on clean lines, a neutral color palette, and high-quality natural materials.'
  },
  { 
    id: 3, 
    title: 'Vastu-Compliant Office Space', 
    category: 'Vastu Consultancy', 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    description: 'A corporate workspace designed following strict Vastu Shastra principles to enhance productivity.'
  }
];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Traditional Copper Pyramid', category: 'Vastu', price: 450, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', description: 'Enhances positive energy in the north-east corner.', inStock: true },
  { id: 2, name: 'Scented Aura Candle Set', category: 'Decor', price: 1200, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=400', description: 'Aromatherapy candles for stress relief.', inStock: true },
  { id: 3, name: 'Vastu Consultation (Basic)', category: 'Vastu', price: 5000, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', description: '1-hour online session for house map review.', inStock: true }
];

export const BLOGS: BlogPost[] = [
  { 
    id: 1, 
    title: 'Vastu Tips for New Homeowners', 
    excerpt: 'Learn the basic directions and their significance...', 
    content: 'Vastu Shastra is an ancient Indian science of architecture and planning...',
    date: 'Oct 20, 2023', 
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600',
    author: 'Dr. Sameer Vastu',
    readingTime: '5 Min Read'
  },
  { 
    id: 2, 
    title: 'Modern Minimalism in 2024', 
    excerpt: 'Achieve a clean look without sacrificing comfort...', 
    content: 'Minimalism in 2024 is about curated intentionality...',
    date: 'Nov 12, 2023', 
    image: 'https://images.unsplash.com/photo-1616489953149-8d082260773d?auto=format&fit=crop&q=80&w=600',
    author: 'Ar. Rahul Sharma',
    readingTime: '4 Min Read'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 1,
    title: 'Vastu for Modern Apartments - Masterclass',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'Architectural Heritage of India',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: 'Future of Sustainable Living - Podcast',
    type: 'podcast',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2fccd27ee10f?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];
