import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.authenticationService.apiUrl}/user/login`) || httpRequest.url.includes(`${this.authenticationService.apiUrl}/user/register`) || httpRequest.url.includes(`${this.authenticationService.apiUrl}/user/resetPassword`)) {
      return httpHandler.handle(httpRequest);
    }
    this.authenticationService.loadTokenFromLocalStorage();
    const token = this.authenticationService.getTokenFromLocalStorage();
    //request is immutable need to clone ==> ++ token => headers
    const httpRequestWithToken = httpRequest.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return httpHandler.handle(httpRequestWithToken);
  }
}
