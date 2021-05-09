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
        if (typeof window !== 'undefined') { // Check if local browser
            this.localizeSettings = localStorage.getItem(LocalStorageKeys.CONF_LOCAL_SETTINGS);
            this.globalSettings = JSON.parse(localStorage.getItem(LocalStorageKeys.CONF_GLOBAL_SETTINGS) || '{}');
            this.translator = localStorage.getItem(LocalStorageKeys.CONF_TRANSLATOR);
        }
        if (this.isRenewSettings()) {
            let url = `/rest/shared${culture ? `/${culture}` : ''}/get-shared-settings`;
            apiService.get(url).then((response) => {
                var resp = response;
                this.globalSettings = resp.globalSettings || new GlobalSetting();
                this.localizeSettings = resp.localizeSettings;
                this.translator = resp.translator;
                if (typeof window !== 'undefined') { // Check if local browser
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
        let now = new Date();
        let lastSync;
        if (typeof window !== 'undefined') { // Check if local browser
            lastSync = localStorage.getItem(LocalStorageKeys.CONF_LAST_SYNC_CONFIGURATION);
        }
        var d = new Date(lastSync || '');
        d.setMinutes(d.getMinutes() + 20);
        return (!this.localizeSettings ||
            !this.globalSettings ||
            !this.translator ||
            !lastSync ||
            now > d);
    }
}
export const mixSettingService = new MixSettingService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXNldHRpbmctc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9zZXJ2aWNlcy9taXgtc2V0dGluZy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN6RCxPQUFPLEVBQXVCLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTlFLE1BQU0sT0FBTyxpQkFBaUI7SUFLNUI7O09BRUc7SUFDSDtRQVBPLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBUWxDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBQ00sY0FBYyxDQUFDLE9BQWdCO1FBQ2xDLElBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFDLEVBQUUseUJBQXlCO1lBQzFELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUM1QyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FDekIsQ0FBQztZQUNaLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDaEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLElBQUksQ0FDakQsQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQ3RDLGdCQUFnQixDQUFDLGVBQWUsQ0FDckIsQ0FBQztTQUNiO1FBRUgsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxHQUFHLEdBQUcsZUFDUixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQzVCLHNCQUFzQixDQUFDO1lBQ3ZCLFVBQVUsQ0FBQyxHQUFHLENBQXNCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUN6RCxJQUFJLElBQUksR0FBRyxRQUErQixDQUFDO2dCQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxhQUFhLEVBQUUsQ0FBQztnQkFDakUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNsQyxJQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBQyxFQUFFLHlCQUF5QjtvQkFDeEQsWUFBWSxDQUFDLE9BQU8sQ0FDcEIsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUNsQyxDQUFDO29CQUNGLFlBQVksQ0FBQyxPQUFPLENBQ3BCLGdCQUFnQixDQUFDLG1CQUFtQixFQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUNwQyxDQUFDO29CQUNGLFlBQVksQ0FBQyxPQUFPLENBQ3BCLGdCQUFnQixDQUFDLGVBQWUsRUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQzlCLENBQUM7b0JBQ0YsWUFBWSxDQUFDLE9BQU8sQ0FDcEIsZ0JBQWdCLENBQUMsNEJBQTRCLEVBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUMzRCxDQUFDO2lCQUNMO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFTSxTQUFTLENBQUMsTUFBYztRQUM3QixVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyxlQUFlO1FBQ3JCLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxRQUFRLENBQUM7UUFDYixJQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBQyxFQUFFLHlCQUF5QjtZQUN4RCxRQUFRLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDL0IsZ0JBQWdCLENBQUMsNEJBQTRCLENBQzVDLENBQUM7U0FDTDtRQUNELElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO1lBQ3RCLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDcEIsQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUNoQixDQUFDLFFBQVE7WUFDVCxHQUFHLEdBQUcsQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUMifQ==