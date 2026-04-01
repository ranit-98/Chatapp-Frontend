// ─────────────────────────────────────────────────────────────
//  Mock Data – Realistic Demo Data for UI Development
//  All types & demo data used across components.
// ─────────────────────────────────────────────────────────────

// ── Types ───────────────────────────────────────────────────

export type UserStatus = 'online' | 'offline' | 'busy' | 'away';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    bio: string;
    lastSeen: string;
}

export interface Reaction {
    emoji: string;
    userId: string;
    userName: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'audio' | 'voice' | 'file';
    timestamp: string;
    isRead: boolean;
    reactions: Reaction[];
    repliedTo?: string;
    isDeleted: boolean;
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isTyping: boolean;
    typingUser?: string;
    isPinned: boolean;
}

export interface CallLog {
    id: string;
    user: User;
    type: 'audio' | 'video';
    direction: 'incoming' | 'outgoing' | 'missed';
    duration: string;
    timestamp: string;
}

// ── Mock Users ──────────────────────────────────────────────

export const currentUser: User = {
    id: 'user-me',
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    avatar: '',
    status: 'online',
    bio: 'Building something amazing 🚀',
    lastSeen: 'Online',
};

export const users: User[] = [
    {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        avatar: '',
        status: 'online',
        bio: 'Full-stack developer | Coffee addict ☕',
        lastSeen: 'Online',
    },
    {
        id: 'user-2',
        name: 'Marcus Johnson',
        email: 'marcus.j@email.com',
        avatar: '',
        status: 'online',
        bio: 'UX Designer at CreativeLab',
        lastSeen: 'Online',
    },
    {
        id: 'user-3',
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        avatar: '',
        status: 'away',
        bio: 'Product Manager | Dog mom 🐕',
        lastSeen: '15 min ago',
    },
    {
        id: 'user-4',
        name: 'Raj Patel',
        email: 'raj.p@email.com',
        avatar: '',
        status: 'busy',
        bio: 'DevOps Engineer | Cloud Enthusiast',
        lastSeen: 'Busy',
    },
    {
        id: 'user-5',
        name: 'Lisa Kim',
        email: 'lisa.kim@email.com',
        avatar: '',
        status: 'offline',
        bio: 'Data Scientist @ Analytics Co',
        lastSeen: '2 hours ago',
    },
    {
        id: 'user-6',
        name: 'James Wilson',
        email: 'james.w@email.com',
        avatar: '',
        status: 'online',
        bio: 'Backend Developer | Rust enthusiast 🦀',
        lastSeen: 'Online',
    },
    {
        id: 'user-7',
        name: 'Aisha Rahman',
        email: 'aisha.r@email.com',
        avatar: '',
        status: 'offline',
        bio: 'Mobile Developer | Flutter & React Native',
        lastSeen: 'Yesterday',
    },
    {
        id: 'user-8',
        name: 'David Lee',
        email: 'david.lee@email.com',
        avatar: '',
        status: 'online',
        bio: 'CTO | Building the future',
        lastSeen: 'Online',
    },
];

// ── Mock Conversations ──────────────────────────────────────

export const conversations: Conversation[] = [
    {
        id: 'conv-1',
        participants: [currentUser, users[0]],
        lastMessage: 'Just pushed the updated API endpoints! 🚀',
        lastMessageTime: '2 min ago',
        unreadCount: 3,
        isTyping: true,
        typingUser: 'Sarah',
        isPinned: true,
    },
    {
        id: 'conv-2',
        participants: [currentUser, users[1]],
        lastMessage: 'The new design mockups are ready for review',
        lastMessageTime: '15 min ago',
        unreadCount: 1,
        isTyping: false,
        isPinned: true,
    },
    {
        id: 'conv-3',
        participants: [currentUser, users[2]],
        lastMessage: 'Can we reschedule the standup to 3 PM?',
        lastMessageTime: '1 hour ago',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
    },
    {
        id: 'conv-4',
        participants: [currentUser, users[3]],
        lastMessage: 'Docker builds are optimized now 🐳',
        lastMessageTime: '3 hours ago',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
    },
    {
        id: 'conv-5',
        participants: [currentUser, users[4]],
        lastMessage: 'The ML model training results look promising',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
    },
    {
        id: 'conv-6',
        participants: [currentUser, users[5]],
        lastMessage: 'Let me know when the PR is ready for review',
        lastMessageTime: 'Yesterday',
        unreadCount: 5,
        isTyping: false,
        isPinned: false,
    },
    {
        id: 'conv-7',
        participants: [currentUser, users[6]],
        lastMessage: 'The app is live on both stores! 🎉',
        lastMessageTime: '2 days ago',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
    },
    {
        id: 'conv-8',
        participants: [currentUser, users[7]],
        lastMessage: 'Great quarterly review. Let\'s sync next week.',
        lastMessageTime: '3 days ago',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
    },
];

// ── Mock Messages ───────────────────────────────────────────

export const messages: Record<string, Message[]> = {
    'conv-1': [
        {
            id: 'msg-1',
            conversationId: 'conv-1',
            senderId: 'user-1',
            content: 'Hey Alex! How\'s the backend refactoring going?',
            type: 'text',
            timestamp: '10:15 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-2',
            conversationId: 'conv-1',
            senderId: 'user-me',
            content: 'Going great! I\'ve finished the authentication module. JWT with httpOnly cookies is all set up 🔐',
            type: 'text',
            timestamp: '10:17 AM',
            isRead: true,
            reactions: [{ emoji: '🔥', userId: 'user-1', userName: 'Sarah' }],
            isDeleted: false,
        },
        {
            id: 'msg-3',
            conversationId: 'conv-1',
            senderId: 'user-1',
            content: 'That\'s awesome! Did you wire up the Socket.io events too?',
            type: 'text',
            timestamp: '10:18 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-4',
            conversationId: 'conv-1',
            senderId: 'user-me',
            content: 'Yep! Real-time messaging, typing indicators, and even the WebRTC signaling layer is done.',
            type: 'text',
            timestamp: '10:20 AM',
            isRead: true,
            reactions: [
                { emoji: '🚀', userId: 'user-1', userName: 'Sarah' },
                { emoji: '💯', userId: 'user-1', userName: 'Sarah' },
            ],
            isDeleted: false,
        },
        {
            id: 'msg-5',
            conversationId: 'conv-1',
            senderId: 'user-1',
            content: 'I\'m impressed! The API docs on Swagger look clean too. Who reviewed the schema design?',
            type: 'text',
            timestamp: '10:22 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-6',
            conversationId: 'conv-1',
            senderId: 'user-me',
            content: 'Raj and I went through it together. We used Mongoose discriminators for the message types.',
            type: 'text',
            timestamp: '10:24 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-7',
            conversationId: 'conv-1',
            senderId: 'user-1',
            content: 'Smart approach! I\'ll start integrating the frontend once Marcus finalizes the UI components.',
            type: 'text',
            timestamp: '10:26 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-8',
            conversationId: 'conv-1',
            senderId: 'user-me',
            content: 'Perfect. I\'ll send you the updated Postman collection so you can test the endpoints.',
            type: 'text',
            timestamp: '10:28 AM',
            isRead: true,
            reactions: [{ emoji: '👍', userId: 'user-1', userName: 'Sarah' }],
            isDeleted: false,
        },
        {
            id: 'msg-9',
            conversationId: 'conv-1',
            senderId: 'user-1',
            content: 'Sounds good! Also, can you check if the file upload endpoint handles voice notes correctly?',
            type: 'text',
            timestamp: '10:30 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-10',
            conversationId: 'conv-1',
            senderId: 'user-me',
            content: 'Already tested it — supports images, audio files, and voice notes with proper MIME validation ✅',
            type: 'text',
            timestamp: '10:32 AM',
            isRead: true,
            reactions: [],
            isDeleted: false,
        },
        {
            id: 'msg-11',
            conversationId: 'conv-1',
            senderId: 'user-1',
            content: 'Just pushed the updated API endpoints! 🚀',
            type: 'text',
            timestamp: '10:45 AM',
            isRead: false,
            reactions: [],
            isDeleted: false,
        },
    ],
};

// ── Mock Call Logs ───────────────────────────────────────────

export const callLogs: CallLog[] = [
    {
        id: 'call-1',
        user: users[0],
        type: 'video',
        direction: 'incoming',
        duration: '15:32',
        timestamp: 'Today, 9:30 AM',
    },
    {
        id: 'call-2',
        user: users[1],
        type: 'audio',
        direction: 'outgoing',
        duration: '5:12',
        timestamp: 'Today, 8:15 AM',
    },
    {
        id: 'call-3',
        user: users[3],
        type: 'video',
        direction: 'missed',
        duration: '—',
        timestamp: 'Yesterday, 6:45 PM',
    },
    {
        id: 'call-4',
        user: users[5],
        type: 'audio',
        direction: 'incoming',
        duration: '22:05',
        timestamp: 'Yesterday, 3:20 PM',
    },
    {
        id: 'call-5',
        user: users[2],
        type: 'video',
        direction: 'outgoing',
        duration: '8:47',
        timestamp: '2 days ago',
    },
    {
        id: 'call-6',
        user: users[7],
        type: 'audio',
        direction: 'missed',
        duration: '—',
        timestamp: '3 days ago',
    },
];
