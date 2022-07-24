export class UserModel {
    public id: number;
    public userIdentifier: string;
    public userFirstName: string;
    public userLastName: string;
    public userAccountName: string;
    public userEmail: string;
    public userLastConnectionToDisplay!: Date;
    public userSignUpDate: Date;
    public userProfilePictureLink: string;
    public isUserConnected: boolean;
    public isUserNotBanned: boolean;
    public userRole: string;
    public userPermissions: string[];
    private userLastConnection: Date;


    constructor() {
        this.id = 0;
        this.userIdentifier = '';
        this.userFirstName = '';
        this.userLastName = '';
        this.userAccountName = '';
        this.userEmail = '';
        this.userLastConnectionToDisplay = new Date();
        this.userLastConnection = new Date();
        this.userSignUpDate = new Date();
        this.userProfilePictureLink = '';
        this.isUserConnected = false;
        this.isUserNotBanned = false;
        this.userRole = '';
        this.userPermissions = [];
    }
}
