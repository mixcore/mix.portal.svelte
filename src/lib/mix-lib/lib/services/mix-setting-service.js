import { LocalStorageKeys } from '../constants/local-storage-keys';
import { apiService } from '../infrastructure/axios/api';
import { GlobalSetting, } from '../models/shared/setting.models';
export class MixSettingService {
    cachedInMinutes = 20;
    globalSettings;
    localizeSettings;
    translator;
    /**
     *
     */
    constructor() {
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
                    localStorage.setItem(LocalStorageKeys.CONF_LAST_SYNC_CONFIGURATION, this.globalSettings.lastUpdateConfiguration?.toString() || '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXNldHRpbmctc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZXMvbWl4LXNldHRpbmctc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDekQsT0FBTyxFQUVMLGFBQWEsR0FDZCxNQUFNLGlDQUFpQyxDQUFDO0FBRXpDLE1BQU0sT0FBTyxpQkFBaUI7SUFDckIsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUNyQixjQUFjLENBQWlCO0lBQy9CLGdCQUFnQixDQUFXO0lBQzNCLFVBQVUsQ0FBVztJQUM1Qjs7T0FFRztJQUNIO1FBQ0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDTSxjQUFjLENBQUMsT0FBZ0I7UUFDcEMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDakMseUJBQXlCO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUMxQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FDMUIsQ0FBQztZQUNiLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDOUIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLElBQUksQ0FDbkQsQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQ3BDLGdCQUFnQixDQUFDLGVBQWUsQ0FDdEIsQ0FBQztTQUNkO1FBRUQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDMUIsTUFBTSxHQUFHLEdBQUcsZUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQzVCLHNCQUFzQixDQUFDO1lBQ3ZCLFVBQVUsQ0FBQyxHQUFHLENBQXNCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUN6RCxNQUFNLElBQUksR0FBRyxRQUErQixDQUFDO2dCQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxhQUFhLEVBQUUsQ0FBQztnQkFDakUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNsQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDL0IseUJBQXlCO29CQUN6QixZQUFZLENBQUMsT0FBTyxDQUNsQixnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQ3BDLENBQUM7b0JBQ0YsWUFBWSxDQUFDLE9BQU8sQ0FDbEIsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQ3RDLENBQUM7b0JBQ0YsWUFBWSxDQUFDLE9BQU8sQ0FDbEIsZ0JBQWdCLENBQUMsZUFBZSxFQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FDaEMsQ0FBQztvQkFDRixZQUFZLENBQUMsT0FBTyxDQUNsQixnQkFBZ0IsQ0FBQyw0QkFBNEIsRUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQzlELENBQUM7aUJBQ0g7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVNLFNBQVMsQ0FBQyxNQUFjO1FBQzdCLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVPLGVBQWU7UUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLFFBQVEsQ0FBQztRQUNiLElBQUksT0FBTyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQy9CLHlCQUF5QjtZQUN6QixRQUFRLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDN0IsZ0JBQWdCLENBQUMsNEJBQTRCLENBQzlDLENBQUM7U0FDSDtRQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO1lBQ3RCLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDcEIsQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUNoQixDQUFDLFFBQVE7WUFDVCxHQUFHLEdBQUcsQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUMifQ==