export interface Goal {
  name: string;
  target: number;
  initial_amount?: number | null;
  deadline?: string | Date | null;
  deposits?: Deposit[] | [];
}

export interface GoalForm {
  name: string;
  target: string;
  initial_amount: string;
  deadline: string | Date;
}

export interface Deposit {
  id: string;
  amount: number;
  created_at: string;
  goal_id: string;
  user_id: string;
  note: string;
}
