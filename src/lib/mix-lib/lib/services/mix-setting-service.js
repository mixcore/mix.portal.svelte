import { LocalStorageKeys } from '../constants/local-storage-keys';
import { apiService } from '../infrastructure/axios/api';
import { GlobalSetting } from '../models/setting.models';
export class MixSettingService {
    /**
     *
     */
    constructor() {
        this.cachedInMinutes = 20;
        this.getAllSettings();
    }
    getAllSettings(culture) {
        if (typeof window !== 'undefined') {
            // Check if local browser
            this.localizeSettings = localStorage.getItem(LocalStorageKeys.CONF_LOCAL_SETTINGS);
            this.globalSettings = JSON.parse(localStorage.getItem(LocalStorageKeys.CONF_GLOBAL_SETTINGS) || '{}');
            this.translator = localStorage.getItem(LocalStorageKeys.CONF_TRANSLATOR);
        }
        if (this.isRenewSettings()) {
            const url = `/rest/shared${culture ? `/${culture}` : ''}/get-shared-settings`;
            apiService.get(url).then((response) => {
                const resp = response;
                this.globalSettings = resp.globalSettings || new GlobalSetting();
                this.localizeSettings = resp.localizeSettings;
                this.translator = resp.translator;
                if (typeof window !== undefined) {
                    // Check if local browser
                    localStorage.setItem(LocalStorageKeys.CONF_GLOBAL_SETTINGS, JSON.stringify(this.globalSettings));
                    localStorage.setItem(LocalStorageKeys.CONF_LOCAL_SETTINGS, JSON.stringify(this.localizeSettings));
                    localStorage.setItem(LocalStorageKeys.CONF_TRANSLATOR, JSON.stringify(this.translator));
                    localStorage.setItem(LocalStorageKeys.CONF_LAST_SYNC_CONFIGURATION, this.globalSettings.lastUpdateConfiguration.toString() || '');
                }
            });
        }
    }
    setAppUrl(appUrl) {
        apiService.setAppUrl(appUrl);
    }
    isRenewSettings() {
        const now = new Date();
        let lastSync;
        if (typeof window !== undefined) {
            // Check if local browser
            lastSync = localStorage.getItem(LocalStorageKeys.CONF_LAST_SYNC_CONFIGURATION);
        }
        const d = new Date(lastSync || '');
        d.setMinutes(d.getMinutes() + 20);
        return (!this.localizeSettings ||
            !this.globalSettings ||
            !this.translator ||
            !lastSync ||
            now > d);
    }
}
export const mixSettingService = new MixSettingService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXNldHRpbmctc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZXMvbWl4LXNldHRpbmctc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDekQsT0FBTyxFQUF1QixhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU5RSxNQUFNLE9BQU8saUJBQWlCO0lBSzVCOztPQUVHO0lBQ0g7UUFQTyxvQkFBZSxHQUFHLEVBQUUsQ0FBQztRQVExQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNNLGNBQWMsQ0FBQyxPQUFnQjtRQUNwQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtZQUNqQyx5QkFBeUI7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxPQUFPLENBQzFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUMxQixDQUFDO1lBQ2IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM5QixZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUNuRCxDQUFDO1lBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDcEMsZ0JBQWdCLENBQUMsZUFBZSxDQUN0QixDQUFDO1NBQ2Q7UUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUMxQixNQUFNLEdBQUcsR0FBRyxlQUNWLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDNUIsc0JBQXNCLENBQUM7WUFDdkIsVUFBVSxDQUFDLEdBQUcsQ0FBc0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ3pELE1BQU0sSUFBSSxHQUFHLFFBQStCLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLGFBQWEsRUFBRSxDQUFDO2dCQUNqRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ2xDLElBQUksT0FBTyxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUMvQix5QkFBeUI7b0JBQ3pCLFlBQVksQ0FBQyxPQUFPLENBQ2xCLGdCQUFnQixDQUFDLG9CQUFvQixFQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDcEMsQ0FBQztvQkFDRixZQUFZLENBQUMsT0FBTyxDQUNsQixnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FDdEMsQ0FBQztvQkFDRixZQUFZLENBQUMsT0FBTyxDQUNsQixnQkFBZ0IsQ0FBQyxlQUFlLEVBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUNoQyxDQUFDO29CQUNGLFlBQVksQ0FBQyxPQUFPLENBQ2xCLGdCQUFnQixDQUFDLDRCQUE0QixFQUM3QyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FDN0QsQ0FBQztpQkFDSDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRU0sU0FBUyxDQUFDLE1BQWM7UUFDN0IsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU8sZUFBZTtRQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksUUFBUSxDQUFDO1FBQ2IsSUFBSSxPQUFPLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDL0IseUJBQXlCO1lBQ3pCLFFBQVEsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUM3QixnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FDOUMsQ0FBQztTQUNIO1FBQ0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7WUFDdEIsQ0FBQyxJQUFJLENBQUMsY0FBYztZQUNwQixDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ2hCLENBQUMsUUFBUTtZQUNULEdBQUcsR0FBRyxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQyJ9