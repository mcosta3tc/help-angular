import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../../user/model/userModel";
import {JwtHelperService} from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public apiUrl: string = environment.apiUrl;
  private token: string = '';
  private loginUserAccountName: string = '';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  public login(user: UserModel): Observable<HttpResponse<UserModel>> {
    return this.http.post<UserModel>(`${this.apiUrl}/user/login`, user, {observe: 'response'})
  }

  public register(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/user/register`, user)
  }

  public logOut(): void {
    this.token = '';
    this.loginUserAccountName = '';
    localStorage.removeItem('localUser');
    localStorage.removeItem('localToken');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('localToken', token);
  }

  public addUserToLocalStorage(user: UserModel): void {
    localStorage.setItem('localUser', JSON.stringify(user));
  }

  public getUserFromLocalStorage(user: UserModel): UserModel {
    return JSON.parse(localStorage.getItem('localUser')!);
  }

  public loadTokenFromLocalStorage(): void {
    this.token = localStorage.getItem('localToken')!;
  }

  public getTokenFromLocalStorage(): string {
    return this.token;
  }

  public checkIsLoggedIn(): boolean {
    this.loadTokenFromLocalStorage();
    if (this.token !== '' && this.token !== null && this.jwtHelper.decodeToken(this.token).sub !== null || '' && !this.jwtHelper.isTokenExpired(this.token)) {
      this.loginUserAccountName = this.jwtHelper.decodeToken(this.token).sub;
      return true;
    } else {
      this.logOut();
      return false;
    }
  }

}
