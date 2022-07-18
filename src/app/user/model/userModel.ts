export class UserModel {
  public id!: number;
  public userFirstName: string;
  public userLastName: string;
  public userAccountName: string;
  public userEmail: string;
  public UserLastConnectionToDisplay!: Date;
  public userSignUpDate!: Date;
  public userProfilePictureLink!: string;
  public isUserConnected: boolean;
  public isUserNotBanned: boolean;
  public userRole: string;
  public userPermissions: string[];


  constructor(userFirstName: string, userLastName: string, userAccountName: string, userEmail: string, isUserConnected: boolean, isUserNotBanned: boolean, userRole: string, userPermissions: string[]) {
    this.userFirstName = userFirstName;
    this.userLastName = userLastName;
    this.userAccountName = userAccountName;
    this.userEmail = userEmail;
    this.isUserConnected = isUserConnected;
    this.isUserNotBanned = isUserNotBanned;
    this.userRole = userRole;
    this.userPermissions = userPermissions;
  }
}
