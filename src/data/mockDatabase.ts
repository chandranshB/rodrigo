import { User, Post, Story, UpdateEvent } from './types';

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  icon: string;
  banner: string;
  isVerified: boolean;
  auraRequired: number;
}

export const mockUsers: Record<string, User> = {
  u1: {
    id: 'u1',
    username: 'rodrigo_creator',
    name: 'Rodrigo Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    aura: 15420,
    isVerified: true,
    profileTheme: ['#6C63FF', '#3F37C9'],
    bio: 'Building the future of college social networking. 🚀',
  },
  u2: {
    id: 'u2',
    username: 'sophia_dev',
    name: 'Sophia Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    aura: 890,
    profileTheme: ['#FF6584', '#F72585'],
    bio: 'CS Major | UI/UX Enthusiast',
  },
  u3: {
    id: 'u3',
    username: 'marcus_fit',
    name: 'Marcus Thorne',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    aura: 2450,
    profileTheme: ['#00D09C', '#4CC9F0'],
    bio: 'Captain of the Football Team 🏈',
  },
  u4: {
    id: 'u4',
    username: 'fest_committee',
    name: 'College Fest Committee',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CF',
    aura: 50000,
    isVerified: true,
    profileTheme: ['#F72585', '#7209B7'],
    bio: 'Official source for all campus events and fests.',
  },
  u5: {
    id: 'u5',
    username: 'art_soul',
    name: 'Elena Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    aura: 3200,
    bio: 'Painting my way through medical school. 🎨💉',
  },
  u6: {
    id: 'u6',
    username: 'tech_guru',
    name: 'Arjun Mehta',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    aura: 12100,
    isVerified: true,
    bio: 'Full Stack Dev | Open Source Contributor',
  },
};

export const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'Hackathon Central',
    slug: 'hackathons',
    description: 'The hub for all campus coding competitions and team finding.',
    memberCount: 2400,
    icon: 'https://api.dicebear.com/7.x/icons/svg?seed=code',
    banner: 'https://picsum.photos/seed/hack/800/200',
    isVerified: true,
    auraRequired: 100,
  },
  {
    id: 'c2',
    name: 'Campus Eats',
    slug: 'foodies',
    description: 'Rating every canteen and local spot around campus.',
    memberCount: 5600,
    icon: 'https://api.dicebear.com/7.x/icons/svg?seed=food',
    banner: 'https://picsum.photos/seed/food/800/200',
    isVerified: false,
    auraRequired: 0,
  },
  {
    id: 'c3',
    name: 'Exam Survivors',
    slug: 'study',
    description: 'Notes, tips, and group crying sessions for finals.',
    memberCount: 8900,
    icon: 'https://api.dicebear.com/7.x/icons/svg?seed=book',
    banner: 'https://picsum.photos/seed/study/800/200',
    isVerified: true,
    auraRequired: 50,
  },
  {
    id: 'c4',
    name: 'Creative Corner',
    slug: 'art',
    description: 'Showcasing the best art, music, and photography on campus.',
    memberCount: 1500,
    icon: 'https://api.dicebear.com/7.x/icons/svg?seed=brush',
    banner: 'https://picsum.photos/seed/art/800/200',
    isVerified: false,
    auraRequired: 200,
  },
];

export const mockStories: Story[] = [
  { id: 's1', userId: 'u1', mediaUrl: 'https://picsum.photos/seed/s1/1080/1920', timestamp: '1h', viewed: false },
  { id: 's2', userId: 'u2', mediaUrl: 'https://picsum.photos/seed/s2/1080/1920', timestamp: '2h', viewed: false },
  { id: 's3', userId: 'u3', mediaUrl: 'https://picsum.photos/seed/s3/1080/1920', timestamp: '3h', viewed: true },
  { id: 's4', userId: 'u5', mediaUrl: 'https://picsum.photos/seed/s5/1080/1920', timestamp: '4h', viewed: false },
  { id: 's5', userId: 'u6', mediaUrl: 'https://picsum.photos/seed/s6/1080/1920', timestamp: '6h', viewed: false },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    mediaUrl: 'https://picsum.photos/seed/p1/1000/1000',
    caption: 'The vibe at the hackathon was absolutely insane! Check out the winning project. #Coding #CollegeLife',
    auraCount: 452,
    timestamp: '2h ago',
    commentsCount: 24,
    userVoted: 'up',
  },
  {
    id: 'p2',
    userId: 'u2',
    mediaUrl: 'https://picsum.photos/seed/p2/1000/1000',
    caption: 'Finally finished my UI redesign for the student portal. What do you think about the gradients? ✨',
    auraCount: 128,
    timestamp: '5h ago',
    commentsCount: 15,
  },
  {
    id: 'p3',
    userId: 'u5',
    mediaUrl: 'https://picsum.photos/seed/p5/1000/1000',
    caption: 'Newest piece finished in the studio today. Oil on canvas. 🎨 #ArtLife',
    auraCount: 890,
    timestamp: '1h ago',
    commentsCount: 42,
    userVoted: 'up',
  },
  {
    id: 'p4',
    userId: 'u6',
    mediaUrl: 'https://picsum.photos/seed/p6/1000/1000',
    caption: 'Just dropped a new open source library for React Native animations. Link in bio! 💻🔥',
    auraCount: 1240,
    timestamp: '45m ago',
    commentsCount: 56,
    userVoted: 'up',
  },
  {
    id: 'p5',
    userId: 'u3',
    mediaUrl: 'https://picsum.photos/seed/p3/1000/1000',
    caption: 'Sunset sessions on the campus track. No excuses. 🌅🏃‍♂️',
    auraCount: 210,
    timestamp: '8h ago',
    commentsCount: 8,
    userVoted: 'down',
  },
];

export const mockEvents: UpdateEvent[] = [
  {
    id: 'e1',
    title: 'Aurora Fest 2026',
    description: 'The biggest inter-college cultural festival of the year is here! Three days of music, dance, and art.',
    organizer: 'College Fest Committee',
    isOfficial: true,
    date: 'April 20-22, 2026',
    type: 'fest',
    auraBonus: 500,
  },
  {
    id: 'e2',
    title: 'Startup Pitch Night',
    description: 'Got a killer idea? Pitch it to real investors and win seed funding. Open to all students.',
    organizer: 'Entrepreneurship Cell',
    isOfficial: true,
    date: 'April 25, 2026',
    type: 'competition',
    auraBonus: 200,
  },
  {
    id: 'e3',
    title: 'Spring Semester Exams Update',
    description: 'The updated timetable for the spring semester finals is now available on the official portal.',
    organizer: 'Administration',
    isOfficial: true,
    date: 'Immediate',
    type: 'announcement',
  },
];
