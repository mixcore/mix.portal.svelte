import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
import { MixRestService } from './mix-rest-service';
export class MixRestPortalRepository extends MixRestService {
    constructor(modelName) {
        const appUrl = localStorage.getItem(LocalStorageKeys.CONF_APP_URL) ||
            window.location.origin;
        const specificulture = localStorage.getItem(LocalStorageKeys.CONF_CURRENT_CULTURE);
        const viewName = 'mvc';
        const conf = getDefaultAxiosConfiguration();
        conf.baseURL = appUrl;
        conf.withCredentials = false;
        super(appUrl, modelName, viewName, specificulture, conf);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXJlc3QtcG9ydGFsLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvaW5mcmFzdHJ1Y3R1cmUvYmFzZS9taXgtcmVzdC1wb3J0YWwtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUV0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV4RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsTUFBTSxPQUFPLHVCQUEyQixTQUFRLGNBQWlCO0lBQy9ELFlBQVksU0FBdUI7UUFDakMsTUFBTSxNQUFNLEdBQ1YsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7WUFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDekIsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDekMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQ3RDLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdkIsTUFBTSxJQUFJLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDRiJ9