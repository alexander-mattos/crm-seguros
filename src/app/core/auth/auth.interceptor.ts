import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona token JWT em todas as requisições
    const authToken = localStorage.getItem('auth_token');
    
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}