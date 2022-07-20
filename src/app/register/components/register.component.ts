import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../authentication/services/authentication.service";
import {UserModel} from "../../user/model/userModel";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    public showLoading: boolean = false;
    public showBanner: boolean = false;
    public registerMessage: string = '';
    public subscriptions: Subscription[] = [];

    constructor(private router: Router, private authenticationService: AuthenticationService) {
    }

    ngOnInit(): void {
        //Redirect to home if a user is logged if not stay => /register
        if (this.authenticationService.checkIsLoggedIn()) {
            this.router.navigateByUrl('/user/management');
        }
    }

    public onRegister(user: UserModel): void {
        this.showLoading = true;
        this.subscriptions.push(
            this.authenticationService.register(user).subscribe((httpResponse: UserModel) => {
                this.showLoading = false;
                this.registerMessage = `Bienvenue ${httpResponse.userFirstName} chez Help. Votre mot de passe à été envoyé à l'adresse : ${httpResponse.userEmail}`;
                this.showBanner = true;
            }, (httpErrorResponse: HttpErrorResponse) => {
                this.showLoading = false;
                this.showBanner = true;
                this.registerMessage = httpErrorResponse.error.responseDescription;
            }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    }
}
