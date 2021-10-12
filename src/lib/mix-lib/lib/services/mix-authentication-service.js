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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWF1dGhlbnRpY2F0aW9uLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL21peC1hdXRoZW50aWNhdGlvbi1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU1RCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsYUFBYTtJQUN6RCxZQUFtQixNQUEyQjtRQUM1QyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxTQUFTLENBQUMsV0FBdUI7UUFDdEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUNkLGdCQUFnQixFQUNoQixXQUFXLENBQ1osQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUMifQ==