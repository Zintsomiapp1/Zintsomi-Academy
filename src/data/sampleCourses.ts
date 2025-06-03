
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
  // Empty array - ready for real content
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
