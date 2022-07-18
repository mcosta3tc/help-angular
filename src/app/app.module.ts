import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './routes/app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "./authentication/services/authentication.service";
import {UserService} from "./user/services/user.service";
import {AuthenticationInterceptor} from "./authentication/interceptors/authentication.interceptor";
import {AuthenticationGuard} from "./authentication/guard/authentication.guard";
import {NotificationModule} from "./notifications/modules/notification.module";
import {NotificationService} from "./notifications/services/notification.service";
import {LoginComponent} from './login/components/login.component';
import {RegisterComponent} from './register/components/register.component';
import {UserComponent} from './user/components/user.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    FormsModule
  ],
  providers: [AuthenticationGuard,
    NotificationService,
    AuthenticationService,
    UserService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
