// Define the structure for children linked to a parent
export interface LinkedChild {
  id: string;
  name: string;
  age: number;
  gender: string;
  enrolledDate: string;
}

// Define the main User Profile structure
export interface UserProfile {
  id: string;
  name: string;
  email: string; // Restricted: Cannot be changed by any user
  role: 'ADMIN' | 'TEACHER' | 'PARENT';
  password: string; // Displayed for editing/viewing
  address: string;
  phone1: string;
  phone2: string;
  relationship?: string; // Locked to "Parent" for the Parent role
  children?: LinkedChild[]; // Only applicable for Parents
}