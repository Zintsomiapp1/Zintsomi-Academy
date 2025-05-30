
export interface Course {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  likes: number;
  comments: number;
  isPremium: boolean;
  rating?: number;
  category: string;
  duration?: string;
}

export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to IsiZulu Storytelling',
    creator: 'Dr. Amara Okafor',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    likes: 342,
    comments: 28,
    isPremium: false,
    rating: 4.8,
    category: 'IsiZulu Storytelling',
    duration: '3 hours',
  },
  {
    id: '2',
    title: 'Advanced African Narratives',
    creator: 'Prof. Thabo Mthembu',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
    likes: 189,
    comments: 15,
    isPremium: true,
    rating: 4.6,
    category: 'Nguni',
    duration: '5 hours',
  },
  {
    id: '3',
    title: 'Digital Storytelling Techniques',
    creator: 'Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    likes: 456,
    comments: 42,
    isPremium: false,
    rating: 4.9,
    category: 'English',
    duration: '4 hours',
  },
  {
    id: '8',
    title: 'Traditional Mbira Lessons',
    creator: 'Music Heritage Africa',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    likes: 890,
    comments: 156,
    isPremium: false,
    rating: 4.9,
    category: 'Indigenous Instruments',
    duration: '6 hours',
  },
  {
    id: '9',
    title: 'Sesotho Folk Tales Audio Collection',
    creator: 'Audio Stories Africa',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=225&fit=crop',
    likes: 267,
    comments: 34,
    isPremium: false,
    rating: 4.6,
    category: 'Audio Books',
    duration: '4 hours',
  },
  {
    id: '10',
    title: 'Traditional Sepedi Legends',
    creator: 'Heritage Audio',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    likes: 178,
    comments: 29,
    isPremium: true,
    rating: 4.4,
    category: 'Sepedi',
    duration: '2.5 hours',
  },
  {
    id: '11',
    title: 'Digital Storytelling Masterclass',
    creator: 'Prof. Digital Arts',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
    likes: 678,
    comments: 98,
    isPremium: true,
    rating: 4.8,
    category: 'Lectures',
    duration: '8 hours',
  },
  {
    id: '12',
    title: 'African Literature PDF Collection',
    creator: 'Digital Library',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
    likes: 345,
    comments: 56,
    isPremium: false,
    rating: 4.3,
    category: 'PDFs',
    duration: 'Self-paced',
  }
];

export const categories = [
  'All',
  'IsiZulu Storytelling',
  'Nguni',
  'Sesotho',
  'English',
  'Sepedi',
  'Indigenous Instruments',
  'Audio Books',
  'PDFs',
  'Lectures'
];
