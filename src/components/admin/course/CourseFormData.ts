
export interface CourseFormData {
  title: string;
  description: string;
  creator: string;
  category: string;
  duration: string;
  is_premium: boolean;
  price: number;
  rating: number;
  status: string;
  featured: boolean;
}

export const defaultFormData: CourseFormData = {
  title: '',
  description: '',
  creator: '',
  category: 'storytelling',
  duration: '',
  is_premium: false,
  price: 0,
  rating: 0,
  status: 'published',
  featured: false
};

export const categories = [
  'storytelling',
  'folklore', 
  'vr_lessons',
  'creative_writing'
];

export const statusOptions = [
  'draft',
  'published',
  'archived'
];
