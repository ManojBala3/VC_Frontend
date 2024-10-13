import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor{

  private totalRequests = 0;
  constructor(
    private loadingService: LoaderService,private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('caught')
    this.totalRequests++;
    this.loadingService.setLoading(true);
    const token = sessionStorage.getItem('usertoken'); 
    let authReq = request;
    if (token) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('error',error)
        if (error.status === 401) {
          // Handle 401 error - Unauthorized
          console.error('Unauthorized (401) - Redirecting to login');

          // Example: Call your logout method or redirect to login page

          this.router.navigate(['/']);
        }

        // Re-throw the error so that it can be handled elsewhere
        return throwError(() => new Error(error.message));
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        token: token
      }
    });
  }
}