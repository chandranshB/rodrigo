export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  aura: number;
  profileTheme?: string[]; // Linear gradient colors
  bio?: string;
  isVerified?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  timestamp: string;
  viewed: boolean;
}

export interface Post {
  id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  auraCount: number;
  timestamp: string;
  commentsCount: number;
  userVoted?: 'up' | 'down' | null;
}

export interface UpdateEvent {
  id: string;
  title: string;
  description: string;
  organizer: string;
  isOfficial: boolean;
  date: string;
  type: 'fest' | 'workshop' | 'competition' | 'announcement';
  auraBonus?: number;
}
