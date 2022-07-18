import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {NotificationService} from "../../notifications/services/notification.service";
import {NotificationTypeEnum} from "../../notifications/types/notificationType.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {


  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return true;
  }

  private isUserLogin(): boolean {
    if (this.authenticationService.checkIsLoggedIn()) {
      return true;
    }
    this.router.navigate(['/components']);
    this.notificationService.showNotification(NotificationTypeEnum.ERROR, `You new to login to access this page`.toUpperCase());
    return false;
  }
}
