export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'admin' | 'staff' | 'parent';
  phoneNumber?: string;
  createdAt?: string;
}

export interface UserProfile extends User {
  bio?: string;
  address?: string;
  notifications?: {
    email: boolean;
    push: boolean;
  };
}
