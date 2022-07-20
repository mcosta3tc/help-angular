import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../authentication/services/authentication.service";
import {UserModel} from "../../user/model/userModel";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HeaderType} from "../../http/type/HeaderType";

@Component({
    selector: 'app-components',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    public showLoading: boolean = false;
    public showBanner: boolean = false;
    public loginErrorMessage: string = '';
    public subscriptions: Subscription[] = [];

    constructor(private router: Router, private authenticationService: AuthenticationService) {
    }

    ngOnInit(): void {
        if (this.authenticationService.checkIsLoggedIn()) {
            this.router.navigateByUrl('/user/management');
        } else {
            this.router.navigateByUrl('/login');
        }
    }

    public onLogin(user: UserModel): void {
        this.showLoading = true;
        this.subscriptions.push(
            this.authenticationService.login(user).subscribe((httpResponse: HttpResponse<UserModel>) => {
                const token = <string>httpResponse.headers.get(HeaderType.JWT_TOKEN);
                this.authenticationService.saveToken(token);
                this.authenticationService.addUserToLocalStorage(<UserModel>httpResponse.body);
                this.router.navigateByUrl('/register');
                this.showLoading = false;
            }, (httpErrorResponse: HttpErrorResponse) => {
                this.showLoading = false;
                this.showBanner = true;
                this.loginErrorMessage = httpErrorResponse.error.responseDescription;
            }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    }
}
