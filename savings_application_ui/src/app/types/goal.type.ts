import { Deposit } from './deposit.type';

export interface Goal {
  id: string;
  name: string;
  target: number;
  initial_amount?: number | null;
  deadline?: string | Date | null;
  deposits?: Deposit[] | [];
  is_featured: boolean;
  created_at?: string;
}

export interface GoalForm {
  id?: string;
  name: string;
  target: string;
  initial_amount: string;
  deadline: string | Date;
  is_featured: boolean;
}
