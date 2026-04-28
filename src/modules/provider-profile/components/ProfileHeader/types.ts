export interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  location: {
    city: string;
    state: string;
  };
  rating: number;
  reviewCount: number;
}
