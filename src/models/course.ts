export interface Course {
  id: string;
  title: string;
  instructor: string;
  tags: string[];

  price: number;
  rating: number;
  duration: number;

  isPremium: boolean;
  isEnrolled: boolean;

  last_updated: string;
}
