import { MixApiService } from '../infrastructure/axios/api';
export class MixAuthenticationService extends MixApiService {
    constructor(config) {
        super(config);
        this.userLogin = this.userLogin.bind(this);
    }
    userLogin(credentials) {
        return this.post('security/login', credentials).then(this.success);
    }
}
export const userApi = new MixAuthenticationService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWF1dGhlbnRpY2F0aW9uLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvc2VydmljZXMvbWl4LWF1dGhlbnRpY2F0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTVELE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxhQUFhO0lBQ3pELFlBQW1CLE1BQTJCO1FBQzVDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLFNBQVMsQ0FBQyxXQUF1QjtRQUN0QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ2QsZ0JBQWdCLEVBQ2hCLFdBQVcsQ0FDWixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQXdCLEVBQUUsQ0FBQyJ9