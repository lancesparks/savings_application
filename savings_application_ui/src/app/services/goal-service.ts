import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { Goal } from '../types/index';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private http: HttpClient = inject(HttpClient);
  private href = environment.settings.baseHref;

  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  goals$ = this.goalsSubject.asObservable();

  public createGoal(goal: Goal) {
    return this.http
      .post<Goal>(`${this.href}/goals`, goal)
      .pipe(tap((newGoal) => this.goalsSubject.next([...this.goalsSubject.value, newGoal])));
  }

  public getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.href}/goals`).pipe(
      tap((goals) => this.goalsSubject.next(goals)),
      tap((data) => console.log(data)),
    );
  }

  public getDateString(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  public convertToLocalDate(date: string) {}
}
