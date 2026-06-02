import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { Goal, Deposit } from '../types/index';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private http: HttpClient = inject(HttpClient);
  private href = environment.settings.baseHref;

  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  goals$ = this.goalsSubject.asObservable();

  private depositSubject = new BehaviorSubject<Deposit[]>([]);
  deposits$ = this.depositSubject.asObservable();

  public createGoal(goal: Goal) {
    return this.http.post<Goal>(`${this.href}/goals`, goal).pipe(
      take(1),
      tap((newGoal) => this.goalsSubject.next([...this.goalsSubject.value, newGoal])),
    );
  }

  public editGoal(goalID: string, goal: Goal) {
    return this.http.put<Goal>(`${this.href}/goals/${goalID}`, goal).pipe(
      take(1),
      tap((newGoal) => this.goalsSubject.next([...this.goalsSubject.value, newGoal])),
    );
  }

  public deleteGoal(goalID: string) {
    return this.http.delete<Goal>(`${this.href}/goals/${goalID}`).pipe(take(1));
  }

  public getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.href}/goals`).pipe(
      take(1),
      tap((goal) => this.goalsSubject.next(goal)),
    );
  }

  public getGoalDetails(id: string): Observable<Goal> {
    return this.http.get<Goal>(`${this.href}/goals/${id}`).pipe(take(1));
  }

  public getDeposits(): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${this.href}/deposits/summary`).pipe(
      take(1),
      tap((deposits: Deposit[]) => {
        this.depositSubject.next(deposits);
      }),
    );
  }

  public getDateString(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  public addDeposit(id: string, deposit: Partial<Deposit>): Observable<Deposit> {
    return this.http.post<Deposit>(`${this.href}/deposits/${id}`, deposit);
  }

  public convertToLocalDate(date: string) {
    return new Date(date + 'T00:00:00');
  }
}
