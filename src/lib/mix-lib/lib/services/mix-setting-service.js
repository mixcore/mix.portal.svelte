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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXNldHRpbmctc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9zZXJ2aWNlcy9taXgtc2V0dGluZy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN6RCxPQUFPLEVBQXVCLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTlFLE1BQU0sT0FBTyxpQkFBaUI7SUFLNUI7O09BRUc7SUFDSDtRQVBPLG9CQUFlLEdBQUcsRUFBRSxDQUFDO1FBUTFCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBQ00sY0FBYyxDQUFDLE9BQWdCO1FBQ3BDLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ2pDLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDMUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQzFCLENBQUM7WUFDYixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQzlCLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxJQUFJLENBQ25ELENBQUM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUNwQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQ3RCLENBQUM7U0FDZDtRQUVELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQzFCLE1BQU0sR0FBRyxHQUFHLGVBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUM1QixzQkFBc0IsQ0FBQztZQUN2QixVQUFVLENBQUMsR0FBRyxDQUFzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDekQsTUFBTSxJQUFJLEdBQUcsUUFBK0IsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDbEMsSUFBSSxPQUFPLE1BQU0sS0FBSyxTQUFTLEVBQUU7b0JBQy9CLHlCQUF5QjtvQkFDekIsWUFBWSxDQUFDLE9BQU8sQ0FDbEIsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUNwQyxDQUFDO29CQUNGLFlBQVksQ0FBQyxPQUFPLENBQ2xCLGdCQUFnQixDQUFDLG1CQUFtQixFQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUN0QyxDQUFDO29CQUNGLFlBQVksQ0FBQyxPQUFPLENBQ2xCLGdCQUFnQixDQUFDLGVBQWUsRUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQ2hDLENBQUM7b0JBQ0YsWUFBWSxDQUFDLE9BQU8sQ0FDbEIsZ0JBQWdCLENBQUMsNEJBQTRCLEVBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUM3RCxDQUFDO2lCQUNIO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFTSxTQUFTLENBQUMsTUFBYztRQUM3QixVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyxlQUFlO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxRQUFRLENBQUM7UUFDYixJQUFJLE9BQU8sTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMvQix5QkFBeUI7WUFDekIsUUFBUSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQzdCLGdCQUFnQixDQUFDLDRCQUE0QixDQUM5QyxDQUFDO1NBQ0g7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUFDLGdCQUFnQjtZQUN0QixDQUFDLElBQUksQ0FBQyxjQUFjO1lBQ3BCLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFDaEIsQ0FBQyxRQUFRO1lBQ1QsR0FBRyxHQUFHLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDIn0=