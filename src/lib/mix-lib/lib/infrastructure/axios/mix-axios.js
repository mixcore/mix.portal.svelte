import axios from 'axios';
import { LocalStorage } from 'ts-localstorage';
import { AUTHORIZATION } from '../../constants/local-storage-keys';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
export class MixAxios {
    constructor(conf) {
        this._initializeResponseInterceptor = () => {
            this.instance.interceptors.response.use(this._handleResponse, this._handleError);
            this.instance.interceptors.request.use(this._handleRequest, this._handleError);
        };
        this._handleRequest = (config) => {
            if (this.instance.defaults.withCredentials) {
                let token = this.getCredentialToken();
                if (token)
                    config.headers.common[AUTHORIZATION] = token;
            }
            return config;
        };
        this._handleResponse = ({ data }) => data;
        this._handleError = (error) => Promise.reject(error);
        let config = conf || getDefaultAxiosConfiguration();
        this.instance = axios.create(config);
        this._initializeResponseInterceptor();
    }
    getCredentialToken() {
        let token = LocalStorage.getItem(AUTHORIZATION);
        return token ? `Bearer ${LocalStorage.getItem(AUTHORIZATION)}` : '';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWF4aW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbWl4LmxpYi50cy9zcmMvbGliL2luZnJhc3RydWN0dXJlL2F4aW9zL21peC1heGlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQTJELE1BQU0sT0FBTyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFeEUsTUFBTSxPQUFPLFFBQVE7SUFHbkIsWUFBbUIsSUFBeUI7UUFNcEMsbUNBQThCLEdBQUcsR0FBRyxFQUFFO1lBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ3JDLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxZQUFZLENBQ2xCLENBQUM7WUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUNwQyxJQUFJLENBQUMsY0FBYyxFQUNuQixJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRU0sbUJBQWMsR0FBRyxDQUFDLE1BQTBCLEVBQUUsRUFBRTtZQUN0RCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtnQkFDMUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3RDLElBQUksS0FBSztvQkFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDekQ7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7UUFFTSxvQkFBZSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQWlCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUVsRCxpQkFBWSxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBMUI3RCxJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksNEJBQTRCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQXlCUyxrQkFBa0I7UUFDMUIsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0NBQ0YifQ==