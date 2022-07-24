import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {UserModel} from "../model/userModel";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../http/model/customHttpResponse";

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
    public showEditUserModal = false;
    public selectedUser: UserModel | undefined;
    public fileUploadedName: string | null | undefined;
    public fileUploaded: File | null | undefined;
    showLoading: boolean = false;
    public editedUser = new UserModel();
    private titleSubject = new BehaviorSubject<string>('');
    public titleAction$ = this.titleSubject.asObservable();
    private currentUsername: string = '';

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
        const formData = this.userService.createUserFormData('', userForm.value, this.fileUploaded);
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
            }, (httpError: CustomHttpResponse) => {
                this.notificationMsg = httpError.error.responseDescription;
                console.log(this.notificationMsg)
                this.showBanner = true
                this.fileUploaded = null;
            }));
    }

    public searchUsers(searchText: string): void {
        const result: UserModel[] = [];
        for (const user of this.userService.getUsersFromLocalStorage()) {
            if (user.userFirstName?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                user.userLastName?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                user.userAccountName?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                user.userIdentifier.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                result.push(user);
            }
        }
        this.usersList = result;
        if (result.length === 0 || !searchText) {
            this.usersList = this.userService.getUsersFromLocalStorage();
        }
    }

    editUser(editUser: UserModel): void {
        this.showEditUserModal = true;
        this.editedUser = editUser;
        this.currentUsername = editUser.userAccountName;
    }

    updateUser(): void {
        const formData = this.userService.createUserFormData(this.currentUsername, this.editedUser, this.fileUploaded);
        this.subscriptions.push(
            this.userService.updateUser(formData).subscribe((response: UserModel) => {
                this.showEditUserModal = false;
                this.getAllUsers(false);
                this.fileUploadedName = null;
                this.fileUploaded = null;
                this.notificationMsg = `${response.userFirstName} ${response.userLastName} : Actualisé`;
                this.showBanner = true;
                setTimeout(() => {
                    this.showBanner = false
                }, 3000);
            }, (httpError: CustomHttpResponse) => {
                console.log(httpError)
                this.notificationMsg = httpError.error.responseDescription;
                this.showBanner = false
                this.fileUploaded = null;
            }));
    }
}
