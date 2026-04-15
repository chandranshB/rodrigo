import { User, Post, Story, UpdateEvent, Reel, Comment } from './types';

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
    avatar: 'https://ui-avatars.com/api/?name=Rodrigo+Admin&background=6C63FF&color=fff',
    aura: 15420,
    isVerified: true,
    profileTheme: ['#6C63FF', '#3F37C9'],
    bio: 'Building the future of college social networking. 🚀',
  },
  u2: {
    id: 'u2',
    username: 'sophia_dev',
    name: 'Sophia Chen',
    avatar: 'https://ui-avatars.com/api/?name=Sophia+Chen&background=FF6584&color=fff',
    aura: 890,
    profileTheme: ['#FF6584', '#F72585'],
    bio: 'CS Major | UI/UX Enthusiast',
  },
  u3: {
    id: 'u3',
    username: 'marcus_fit',
    name: 'Marcus Thorne',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Thorne&background=00D09C&color=fff',
    aura: 2450,
    profileTheme: ['#00D09C', '#4CC9F0'],
    bio: 'Captain of the Football Team 🏈',
  },
  u4: {
    id: 'u4',
    username: 'fest_committee',
    name: 'College Fest Committee',
    avatar: 'https://ui-avatars.com/api/?name=Fest+Committee&background=F72585&color=fff',
    aura: 50000,
    isVerified: true,
    profileTheme: ['#F72585', '#7209B7'],
    bio: 'Official source for all campus events and fests.',
  },
  u5: {
    id: 'u5',
    username: 'art_soul',
    name: 'Elena Rodriguez',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=4361EE&color=fff',
    aura: 3200,
    bio: 'Painting my way through medical school. 🎨💉',
  },
  u6: {
    id: 'u6',
    username: 'tech_guru',
    name: 'Arjun Mehta',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=333&color=fff',
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
    icon: 'https://picsum.photos/seed/c1/150/150',
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
    icon: 'https://picsum.photos/seed/c2/150/150',
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
    icon: 'https://picsum.photos/seed/c3/150/150',
    banner: 'https://picsum.photos/seed/study/800/200',
    isVerified: true,
    auraRequired: 50,
  },
];

export const mockStories: Story[] = [
  { id: 's1', userId: 'u1', mediaUrl: 'https://picsum.photos/seed/s1/1080/1920', timestamp: '1h', viewed: false },
  { id: 's2', userId: 'u2', mediaUrl: 'https://picsum.photos/seed/s2/1080/1920', timestamp: '2h', viewed: false },
  { id: 's3', userId: 'u3', mediaUrl: 'https://picsum.photos/seed/s3/1080/1920', timestamp: '3h', viewed: true },
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
];

export const mockReels: Reel[] = [
  {
    id: 'r1',
    userId: 'u3',
    mediaUrl: 'https://picsum.photos/seed/r1/1080/1920',
    caption: 'Morning workout routine at the campus gym! 🏋️‍♂️💪',
    auraCount: 2540,
    commentsCount: 120,
    musicName: 'Phonk Night - Viral Beats',
  },
  {
    id: 'r2',
    userId: 'u5',
    mediaUrl: 'https://picsum.photos/seed/r2/1080/1920',
    caption: 'Painting the campus sunset in 30 seconds 🎨🌅',
    auraCount: 5600,
    commentsCount: 340,
    musicName: 'Lo-Fi Chill - Study Session',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'm1',
    userId: 'u2',
    targetId: 'p1',
    text: 'That project was insane! Well deserved win.',
    timestamp: '1h ago',
    auraCount: 45,
  },
  {
    id: 'm2',
    userId: 'u3',
    targetId: 'p1',
    text: 'Wish I could have been there, looks like a blast!',
    timestamp: '45m ago',
    auraCount: 12,
  },
  {
    id: 'm3',
    userId: 'u6',
    targetId: 'p1',
    text: 'Code quality was top tier. Loved the architecture.',
    timestamp: '30m ago',
    auraCount: 89,
  },
  {
    id: 'm4',
    userId: 'u1',
    targetId: 'r1',
    text: 'Gym motivation 📈📈📈',
    timestamp: '1h ago',
    auraCount: 150,
  },
  {
    id: 'm5',
    userId: 'u5',
    targetId: 'r1',
    text: 'Drop the leg day routine!',
    timestamp: '40m ago',
    auraCount: 24,
  },
];

export const mockEvents: UpdateEvent[] = [
  {
    id: 'e1',
    title: 'Aurora Fest 2026',
    description: 'The biggest inter-college cultural festival of the year is here!',
    organizer: 'College Fest Committee',
    isOfficial: true,
    date: 'April 20-22, 2026',
    type: 'fest',
    auraBonus: 500,
  },
];
