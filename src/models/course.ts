export interface Course {
  id: number;
  title: string;
  instructor: string;
  tags: string[];

  price: number;
  rating: number;
  duration: number;

  isPremium: boolean;
  isEnrolled: boolean;
}
