export interface Devotional {
  day: number;
  title: string;
  passage: string;
  context: string;
  explanation: string;
  application: string;
  prayer: string;
}

export interface Profile {
  id: string;
  name: string;
  notification_time: string;
  notifications_enabled: boolean;
  push_subscription: object | null;
  current_day: number;
  start_date: string;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  day_number: number;
  completed_at: string;
  is_recovery: boolean;
}

export interface DevotionalNote {
  id: string;
  user_id: string;
  day_number: number;
  learned: string;
  apply: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  current_streak: number;
  best_streak: number;
  total_completed: number;
  last_completed_day: number;
}
