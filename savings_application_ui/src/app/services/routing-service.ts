import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private router: Router = inject(Router);

  routeToPage(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
