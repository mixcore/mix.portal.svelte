import axios from 'axios';
import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
export class MixAxios {
    instance;
    constructor(conf) {
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
    _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(this._handleResponse, this._handleError);
        this.instance.interceptors.request.use(this._handleRequest, this._handleError);
    };
    _handleRequest = (config) => {
        if (this.instance.defaults.withCredentials) {
            const token = this.getCredentialToken();
            if (token)
                config.headers.common[LocalStorageKeys.CONF_AUTHORIZATION] = token;
        }
        return config;
    };
    _handleResponse = ({ data }) => data;
    _handleError = (error) => Promise.reject(error);
    getCredentialToken() {
        const token = localStorage.getItem(LocalStorageKeys.CONF_AUTHORIZATION);
        return token
            ? `Bearer ${localStorage.getItem(LocalStorageKeys.CONF_AUTHORIZATION)}`
            : '';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWF4aW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9pbmZyYXN0cnVjdHVyZS9heGlvcy9taXgtYXhpb3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUEyRCxNQUFNLE9BQU8sQ0FBQztBQUVoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV4RSxNQUFNLE9BQU8sUUFBUTtJQUNILFFBQVEsQ0FBZ0I7SUFFeEMsWUFBbUIsSUFBeUI7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLDRCQUE0QixFQUFFLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7Z0JBQ2pDLHlCQUF5QjtnQkFDekIsTUFBTSxDQUFDLE9BQU87b0JBQ1osWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7d0JBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQzFCO1NBQ0Y7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVPLDhCQUE4QixHQUFHLEdBQUcsRUFBRTtRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNyQyxJQUFJLENBQUMsZUFBZSxFQUNwQixJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDcEMsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FDbEIsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVNLGNBQWMsR0FBRyxDQUFDLE1BQTBCLEVBQUUsRUFBRTtRQUN0RCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtZQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN4QyxJQUFJLEtBQUs7Z0JBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDdEU7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUM7SUFFTSxlQUFlLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBaUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBRWxELFlBQVksR0FBRyxDQUFDLEtBQWMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6RCxrQkFBa0I7UUFDMUIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sS0FBSztZQUNWLENBQUMsQ0FBQyxVQUFVLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUN2RSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1QsQ0FBQztDQUNGIn0=