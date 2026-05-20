export interface Goal {
  name: string;
  target: number;
  initial_amount?: number | null;
  deadline?: string | Date | null;
  deposits?: Deposit[] | [];
  is_featured: boolean;
}

export interface GoalForm {
  name: string;
  target: string;
  initial_amount: string;
  deadline: string | Date;
  is_featured: boolean;
}

export interface Deposit {
  id: string;
  amount: number;
  created_at: string;
  goal_id: string;
  user_id: string;
  note: string;
}
