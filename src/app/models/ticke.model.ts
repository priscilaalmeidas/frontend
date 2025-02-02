export interface Ticket {
  _id: string;
  contact: { _id: string; name: string };
  status: 'in_progress' | 'completed';
  lastMessage?: string;
  duration?: number;
  agent?: string;
  channel: 'whatsapp' | 'web-chat' | 'telegram';
  createdAt?: string;
  updatedAt?: string;
}
