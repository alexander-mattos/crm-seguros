import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro na operação';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          if (error.status === 422) {
            errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
          }
          // Implementar outros casos de erro
        }

        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        return throwError(() => error);
      })
    );
  }
}