
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
    thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
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
