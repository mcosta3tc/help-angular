import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../model/userModel";
import {CustomHttpResponse} from "../../http/model/customHttpResponse";

@Injectable({providedIn: 'root'})
export class UserService {
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    public getUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/user/list`)
    }

    public addUser(formData: FormData): Observable<UserModel> {
        return this.http.post<UserModel>(`${this.apiUrl}/user/add`, formData);
    }

    public updateUser(formData: FormData): Observable<UserModel> {
        return this.http.post<UserModel>(`${this.apiUrl}/user/update`, formData);
    }

    public resetPassword(userEmail: string): Observable<CustomHttpResponse | HttpErrorResponse> {
        return this.http.get<CustomHttpResponse>(`${this.apiUrl}/user/resetPassword/${userEmail}`);
    }

    public updateUserProfileImg(formData: FormData): Observable<HttpEvent<UserModel> | HttpErrorResponse> {
        return this.http.post<UserModel>(`${this.apiUrl}/user/updateProfileImage`, formData, {
            //track upload progress to display it
            reportProgress: true,
            observe: 'events'
        });
    }

    public deleteUser(userId: number): Observable<CustomHttpResponse> {
        return this.http.delete<CustomHttpResponse>(`${this.apiUrl}/user/delete/${userId}`);
    }

    public addUsersToLocalStorage(users: UserModel[]): void {
        localStorage.setItem('users', JSON.stringify(users));
    }

    public getUsersFromLocalStorage(): UserModel[] | null {
        if (localStorage.getItem('users')) {
            return JSON.parse(localStorage.getItem('users')!);
        }
        return null;
    }

    public createUserFormData(connectedUserAccountName: string, user: UserModel, userProfileImage: File): FormData {
        const formData = new FormData();
        formData.append('currentUserFirstName', 'connectedUserAccountName');
        formData.append('userFirstName', user.userFirstName);
        formData.append('userLastName', user.userLastName);
        formData.append('userAccountName', user.userAccountName);
        formData.append('userEmail', user.userEmail);
        formData.append('userRole', user.userRole);
        formData.append('userProfilePictureLink', userProfileImage);
        formData.append('isUserConnected', JSON.stringify(user.isUserConnected));
        formData.append('isUserNotBanned', JSON.stringify(user.isUserNotBanned));
        return formData;
    }

}
