import axios from 'axios';
import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
export class MixAxios {
    constructor(conf) {
        this._initializeResponseInterceptor = () => {
            this.instance.interceptors.response.use(this._handleResponse, this._handleError);
            this.instance.interceptors.request.use(this._handleRequest, this._handleError);
        };
        this._handleRequest = (config) => {
            if (this.instance.defaults.withCredentials) {
                const token = this.getCredentialToken();
                if (token)
                    config.headers.common[LocalStorageKeys.CONF_AUTHORIZATION] = token;
            }
            return config;
        };
        this._handleResponse = ({ data }) => data;
        this._handleError = (error) => Promise.reject(error);
        const config = conf || getDefaultAxiosConfiguration();
        if (!config.baseURL) {
            if (typeof window !== 'undefined') {
                // Check if local browser
                config.baseURL =
                    localStorage.getItem(LocalStorageKeys.CONF_APP_URL) ||
                        window.location.origin;
            }
        }
        this.instance = axios.create(config);
        this._initializeResponseInterceptor();
    }
    getCredentialToken() {
        const token = localStorage.getItem(LocalStorageKeys.CONF_AUTHORIZATION);
        return token
            ? `Bearer ${localStorage.getItem(LocalStorageKeys.CONF_AUTHORIZATION)}`
            : '';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWF4aW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbWl4LmxpYi50cy9zcmMvbGliL2luZnJhc3RydWN0dXJlL2F4aW9zL21peC1heGlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQTJELE1BQU0sT0FBTyxDQUFDO0FBRWhGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXhFLE1BQU0sT0FBTyxRQUFRO0lBR25CLFlBQW1CLElBQXlCO1FBY3BDLG1DQUE4QixHQUFHLEdBQUcsRUFBRTtZQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNyQyxJQUFJLENBQUMsZUFBZSxFQUNwQixJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDcEMsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FDbEIsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVNLG1CQUFjLEdBQUcsQ0FBQyxNQUEwQixFQUFFLEVBQUU7WUFDdEQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7Z0JBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLEtBQUs7b0JBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDdEU7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7UUFFTSxvQkFBZSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQWlCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUVsRCxpQkFBWSxHQUFHLENBQUMsS0FBYyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBbkNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksNEJBQTRCLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUNuQixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtnQkFDakMseUJBQXlCO2dCQUN6QixNQUFNLENBQUMsT0FBTztvQkFDWixZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQzt3QkFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7YUFDMUI7U0FDRjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBMEJTLGtCQUFrQjtRQUMxQixNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDeEUsT0FBTyxLQUFLO1lBQ1YsQ0FBQyxDQUFDLFVBQVUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO1lBQ3ZFLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDVCxDQUFDO0NBQ0YifQ==