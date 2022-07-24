import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {UserModel} from "../model/userModel";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public usersList: UserModel[] | null = [];
    public subscriptions: Subscription[] = [];
    public notificationMsg: string = '';
    public showBanner: boolean = true;
    public isFetchingData: boolean = false;
    public showModal = false;
    public showAddUserModal = false;
    public selectedUser: UserModel | undefined;
    public fileUploadedName: string | null | undefined;
    public fileUploaded: File | null | undefined;
    showLoading: boolean = false;
    private titleSubject = new BehaviorSubject<string>('');
    public titleAction$ = this.titleSubject.asObservable();

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.getAllUsers(true);
    }

    public toggleModal(selectedUser: UserModel): void {
        this.showModal = !this.showModal;
        this.selectedUser = selectedUser;
    }

    public toggleAddUserModal(): void {
        this.showAddUserModal = !this.showModal;
    }

    public changeTitle(title: string): void {
        this.titleSubject.next(title);
    }

    public onProfileImgChange(event: any): void {
        this.fileUploadedName = event.target.files[0].name;
        this.fileUploaded = event.target.files[0];
    }

    public getAllUsers(showNotification: boolean): void {
        this.isFetchingData = true;
        this.subscriptions.push(
            this.userService.getUsers().subscribe((response: UserModel[]) => {
                this.showLoading = true;
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

    public addNewUser(userForm: NgForm): void {
        const formData = this.userService.createUserFormData(null, userForm.value, this.fileUploaded);
        this.subscriptions.push(
            this.userService.addUser(formData).subscribe((response: UserModel) => {
                this.showModal = false;
                this.getAllUsers(false);
                this.fileUploadedName = null;
                this.fileUploaded = null;
                userForm.reset();
                this.notificationMsg = `${response.userFirstName} ${response.userLastName} : Ajouté aux utilisateurs`;
                this.showBanner = true;
                setTimeout(() => {
                    this.showBanner = false
                }, 3000);
            }, (error: HttpErrorResponse) => {
                this.notificationMsg = error.error.responseDescription;
                this.showBanner = false
                this.fileUploaded = null;
            }));
    }

    public searchUsers(searchText: string): void {
        const result: UserModel[] = [];
        for (const user of this.userService.getUsersFromLocalStorage()) {
            if (user.userFirstName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                user.userLastName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                user.userAccountName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                user.userIdentifier.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                result.push(user);
            }
        }
        console.log(result)
        this.usersList = result;
        if (result.length === 0 || !searchText) {
            this.usersList = this.userService.getUsersFromLocalStorage();
            console.log("vide", result)
        }
    }
}
