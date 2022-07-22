import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {UserModel} from "../model/userModel";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public usersList: UserModel[] = [];
    public subscriptions: Subscription[] = [];
    public notificationMsg: string = '';
    public showBanner: boolean = true;
    public isFetchingData: boolean = false;
    private titleSubject = new BehaviorSubject<string>('');
    public titleAction$ = this.titleSubject.asObservable();

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.getAllUsers(true);
    }

    public changeTitle(title: string): void {
        this.titleSubject.next(title);
    }

    public getAllUsers(showNotification: boolean): void {
        this.isFetchingData = true;
        this.subscriptions.push(
            this.userService.getUsers().subscribe((response: UserModel[]) => {
                this.userService.addUsersToLocalStorage(response);
                this.usersList = response;
                this.isFetchingData = false;
                if (showNotification) {
                    this.notificationMsg = `${response.length} utilisateurs chargés`;
                    this.showBanner = true;
                    setTimeout(() => {
                        this.showBanner = false
                    }, 3000);
                }
            }, (error: HttpErrorResponse) => {
                this.notificationMsg = error.error.responseDescription;
                this.showBanner = false
            })
        );
    }
}
