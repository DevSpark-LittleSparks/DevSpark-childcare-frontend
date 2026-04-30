/**
 * Official Mock Data
 * Centralized location for all progress and dashboard mock data.
 */

export interface ChildProfile {
  id: string;
  fullName: string;
  dateOfBirth: string;
  stage: 'INFANT' | 'TODDLER' | 'PRESCHOOLER';
  hasSpecialNeeds: boolean;
  carePlan: string;
}

export interface DailyActivity {
  id: string;
  title: string;
  time: string;
  teacher: string;
  role: string;
  studentsParticipated: number;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BotMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  showFaqButtons?: boolean;
}

export type ColorType = 'blue' | 'orange' | 'purple';

export interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  desc: string;
  icon: string;
  colorType: ColorType;
}

export type LogTag = 'ACTIVITY' | 'MEALS';

export interface LogItem {
  id: number;
  studentName: string;
  time: string;
  timestamp: number;
  tag: LogTag;
  actionText: string;
  icon: string;
  iconColor: string;
}

export interface ClassStatus {
  checkedIn: number;
  expected: number;
  attendance: number;
}

export interface SafetyAlert {
  id: number;
  title: string;
  colorType: 'orange' | 'blue' | 'purple';
}

export interface ParentComm {
  id: number;
  parentName: string;
  message: string;
  avatarBg: string;
  avatarFill: string;
}

export interface ChildDataEntry {
  name: string;
  attendance: number;
  activities: number;
  mood: string | number;
  meals: 'full' | 'partial' | 'none';
  engagement: number[];
  totalDays: number;
}

export interface AdminChildDataEntry extends ChildDataEntry {
  totalDays: number;
}

export const mockChildren: ChildProfile[] = [
  {
    id: '1',
    fullName: 'Amaya Perera',
    dateOfBirth: '2021-05-15',
    stage: 'TODDLER',
    hasSpecialNeeds: false,
    carePlan: '',
  },
  {
    id: '2',
    fullName: 'Kavindu Silva',
    dateOfBirth: '2020-02-10',
    stage: 'PRESCHOOLER',
    hasSpecialNeeds: true,
    carePlan: 'Needs help with meals',
  },
  {
    id: '3',
    fullName: 'Nethmi Fernando',
    dateOfBirth: '2023-01-20',
    stage: 'INFANT',
    hasSpecialNeeds: false,
    carePlan: '',
  },
];

export const SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: 1,
    time: '08:30 AM - 09:00 AM',
    title: 'Morning Arrival',
    desc: 'Greeting parents and students',
    icon: 'SCHOOL',
    colorType: 'blue',
  },
  {
    id: 2,
    time: '09:00 AM - 09:30 AM',
    title: 'Breakfast',
    desc: 'Oatmeal and fresh fruits',
    icon: 'BREAKFAST',
    colorType: 'orange',
  },
  {
    id: 3,
    time: '09:30 AM - 10:00 AM',
    title: 'Morning Circle',
    desc: 'Singing songs and weather check',
    icon: 'CIRCLE',
    colorType: 'blue',
  },
  {
    id: 4,
    time: '10:00 AM - 10:45 AM',
    title: 'Story Time',
    desc: 'Reading: "The Very Hungry Caterpillar"',
    icon: 'STORY',
    colorType: 'blue',
  },
  {
    id: 5,
    time: '11:30 AM - 12:15 PM',
    title: 'Lunch Time',
    desc: 'Menu: Turkey sandwiches & apple slices',
    icon: 'LUNCH',
    colorType: 'orange',
  },
  {
    id: 7,
    time: '02:30 PM - 03:00 PM',
    title: 'Afternoon Snack',
    desc: 'Crackers and cheese',
    icon: 'SNACK',
    colorType: 'orange',
  },
  {
    id: 8,
    time: '03:00 PM - 03:45 PM',
    title: 'Free Play',
    desc: 'Indoor and outdoor activities',
    icon: 'PLAY',
    colorType: 'blue',
  },
  {
    id: 9,
    time: '03:45 PM - 04:00 PM',
    title: 'Parent Pick-up',
    desc: 'Packing bags and goodbyes',
    icon: 'PICKUP',
    colorType: 'blue',
  },
];

export const LOGS_DATA: LogItem[] = [
  { id: 18, studentName: 'Mia T.', time: '11:00 AM', timestamp: new Date().setHours(11, 0, 0, 0), tag: 'ACTIVITY', actionText: 'Outdoor Play: Playing with bubbles', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 17, studentName: 'Lucas H.', time: '10:55 AM', timestamp: new Date().setHours(10, 55, 0, 0), tag: 'ACTIVITY', actionText: 'Story Time: Reading The Very Hungry Caterpillar', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 16, studentName: 'Sophia C.', time: '10:50 AM', timestamp: new Date().setHours(10, 50, 0, 0), tag: 'ACTIVITY', actionText: 'Art: Finger painting session', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 15, studentName: 'Jackson W.', time: '10:45 AM', timestamp: new Date().setHours(10, 45, 0, 0), tag: 'ACTIVITY', actionText: 'Music Time: Singing songs', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 14, studentName: 'Aiden K.', time: '10:42 AM', timestamp: new Date().setHours(10, 42, 0, 0), tag: 'ACTIVITY', actionText: 'Free Play: Building with blocks', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 13, studentName: 'Isabella G.', time: '10:40 AM', timestamp: new Date().setHours(10, 40, 0, 0), tag: 'MEALS', actionText: 'Lunch: Chicken pasta with steamed broccoli', icon: 'MEALS', iconColor: '#F97316' },
  { id: 12, studentName: 'Ethan P.', time: '10:35 AM', timestamp: new Date().setHours(10, 35, 0, 0), tag: 'MEALS', actionText: 'PM Snack: Sliced apples and crackers', icon: 'MEALS', iconColor: '#F97316' },
  { id: 11, studentName: 'Chloe M.', time: '10:32 AM', timestamp: new Date().setHours(10, 32, 0, 0), tag: 'MEALS', actionText: 'Lunch: Veggie wrap with fruits', icon: 'MEALS', iconColor: '#F97316' },
  { id: 10, studentName: 'Noah R.', time: '10:31 AM', timestamp: new Date().setHours(10, 31, 0, 0), tag: 'MEALS', actionText: 'PM Snack: Yogurt and berries', icon: 'MEALS', iconColor: '#F97316' },
  { id: 1, studentName: 'Leo M.', time: '10:30 AM', timestamp: new Date().setHours(10, 30, 0, 0), tag: 'MEALS', actionText: 'Finished 1 bottle (6oz)', icon: 'MEALS', iconColor: '#F97316' },
  { id: 2, studentName: 'Maya S.', time: '10:15 AM', timestamp: new Date().setHours(10, 15, 0, 0), tag: 'ACTIVITY', actionText: 'Painted with triangles', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 6, studentName: 'Olivia H.', time: '09:15 AM', timestamp: new Date().setHours(9, 15, 0, 0), tag: 'MEALS', actionText: 'Ate all her apple slices', icon: 'MEALS', iconColor: '#F97316' },
  { id: 7, studentName: 'Elijah K.', time: '09:00 AM', timestamp: new Date().setHours(9, 0, 0, 0), tag: 'ACTIVITY', actionText: 'Built a tall block tower', icon: 'ACTIVITY', iconColor: '#10B981' },
  { id: 9, studentName: 'Jameson D.', time: '08:30 AM', timestamp: new Date().setHours(8, 30, 0, 0), tag: 'MEALS', actionText: 'Refused morning snack', icon: 'MEALS', iconColor: '#F97316' }
];

export const CLASS_STATUS: ClassStatus = {
  checkedIn: 12,
  expected: 3,
  attendance: 80,
};

export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 1,
    title: 'Leo M. - Peanut Allergy (Severe)',
    colorType: 'orange',
  },
  {
    id: 2,
    title: 'Medication due for Sophie at 12:00',
    colorType: 'blue',
  },
];

export const PARENT_COMMS: ParentComm[] = [
  {
    id: 1,
    parentName: 'MRS. GELLAR',
    message: 'Will be 15 mins late for pick-up...',
    avatarBg: '#FDE68A',
    avatarFill: '#F59E0B',
  },
  {
    id: 2,
    parentName: 'MR. THOMPSON',
    message: 'Did Oliver sleep okay last night?',
    avatarBg: '#E2E8F0',
    avatarFill: '#64748B',
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'What are the school hours?',
    answer: 'Our school hours are from 8:00 AM to 5:00 PM, Monday to Friday. Early drop-off starts at 7:30 AM.',
  },
  {
    question: 'How do I contact the teacher?',
    answer: 'You can contact the teacher through the parent portal messaging system or by calling the school office at (555) 123-4567.',
  },
  {
    question: 'Is there a sibling discount?',
    answer: 'Yes, we offer a 10% discount for each additional sibling enrolled in our program.',
  },
  {
    question: 'How to pay?',
    answer: 'Tuition can be paid monthly via bank transfer, credit card through our portal, or in person at the office.',
  },
  {
    question: 'Report absence',
    answer: 'Please report absences through the parent portal or by calling the office before 8:00 AM on the day of absence.',
  },
];

export const INITIAL_MESSAGE: BotMessage = {
  id: 0,
  sender: 'bot',
  text: 'Hi there! I\'m Sprouty, your childcare assistant. How can I help you today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  showFaqButtons: true,
};

export const BOT_FALLBACK_TEXT = "I'm not quite sure I understood that. Could you try asking one of our common questions below?";

export const adminChildrenData: Record<string, AdminChildDataEntry> = {
  C1: {
    name: 'Amaya Perera',
    attendance: 18,
    totalDays: 20,
    activities: 45,
    mood: 'Happy',
    meals: 'full',
    engagement: [12, 19, 15, 17, 14, 0, 0, 8, 16, 13, 11, 18, 9, 20, 10, 7, 15, 12, 14, 16],
  },
  C2: {
    name: 'Kavindu Silva',
    attendance: 15,
    totalDays: 20,
    activities: 38,
    mood: 'Curious',
    meals: 'partial',
    engagement: [10, 14, 16, 12, 18, 0, 0, 9, 13, 11, 17, 15, 8, 19, 12, 10, 14, 16, 11, 13],
  },
  C3: {
    name: 'Nethmi Fernando',
    attendance: 20,
    totalDays: 20,
    activities: 50,
    mood: 'Joyful',
    meals: 'full',
    engagement: [15, 18, 12, 20, 16, 0, 0, 14, 17, 13, 19, 11, 15, 18, 10, 12, 16, 14, 17, 13],
  },
};

export const childrenData: Record<string, ChildDataEntry> = {
  C1: {
    name: 'Amaya Perera',
    attendance: 18,
    activities: 45,
    mood: 'Happy',
    meals: 'full',
    engagement: [12, 19, 15, 17, 14, 0, 0, 8, 16, 13, 11, 18, 9, 20, 10, 7, 15, 12, 14, 16],
    totalDays: 20,
  },
  C2: {
    name: 'Kavindu Silva',
    attendance: 15,
    activities: 38,
    mood: 'Curious',
    meals: 'partial',
    engagement: [10, 14, 16, 12, 18, 0, 0, 9, 13, 11, 17, 15, 8, 19, 12, 10, 14, 16, 11, 13],
    totalDays: 20,
  },
  C3: {
    name: 'Nethmi Fernando',
    attendance: 20,
    activities: 50,
    mood: 'Joyful',
    meals: 'full',
    engagement: [15, 18, 12, 20, 16, 0, 0, 14, 17, 13, 19, 11, 15, 18, 10, 12, 16, 14, 17, 13],
    totalDays: 20,
  },
};

export const adminDailyActivities: DailyActivity[] = [
  {
    id: 'a1',
    title: 'Mathematics Quiz',
    time: '09:00 AM',
    teacher: 'Sarah',
    role: 'Teacher',
    studentsParticipated: 5,
    date: '2026-04-28',
  },
  {
    id: 'a2',
    title: 'Reading Comprehension',
    time: '10:30 AM',
    teacher: 'Mike',
    role: 'Instructor',
    studentsParticipated: 5,
    date: '2026-04-28',
  },
  {
    id: 'a3',
    title: 'Science Activity',
    time: '02:00 PM',
    teacher: 'Sarah',
    role: 'Teacher',
    studentsParticipated: 5,
    date: '2026-04-28',
  },
  {
    id: 'a4',
    title: 'Art Class',
    time: '09:00 AM',
    teacher: 'Elena',
    role: 'Teacher',
    studentsParticipated: 8,
    date: '2026-04-27',
  },
];

export const MOCK_DAILY_PROGRESS_BY_DATE: Record<string, any> = {
  '2026-04-28': {
    Excellent: 40,
    VeryGood: 30,
    Good: 15,
    Weak: 5,
  },
  '2026-04-27': {
    Excellent: 25,
    VeryGood: 45,
    Good: 20,
    Weak: 10,
  },
};

export const MOCK_DAILY_PROGRESS = {
  Excellent: 40,
  VeryGood: 30,
  Good: 15,
  Weak: 5,
};

export const MOCK_ACTIVITY_ENGAGEMENT = [
  { name: '03/04', value: 12 },
  { name: '05/04', value: 19 },
  { name: '07/04', value: 15 },
  { name: '09/04', value: 17 },
  { name: '11/04', value: 14 },
  { name: '13/04', value: 13 },
  { name: '15/04', value: 14 },
];

export const MOCK_ATTENDANCE_RATE = {
  present: 18,
  total: 20,
};

export interface TeacherProfile {
  name: string;
  classroom: string;
}

export const mockTeacherProfile: TeacherProfile = {
  name: 'Ms. Hernandez',
  classroom: 'The Little Sprouts'
};

export interface ParentProfile {
  name: string;
}

export const mockParentProfile: ParentProfile = {
  name: 'Mrs. Perera'
};
