import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
import { MixRestService } from './mix-rest-service';
export class MixRestPortalService extends MixRestService {
    constructor(modelName) {
        let appUrl = localStorage.getItem(LocalStorageKeys.CONF_APP_URL) ||
            window.location.origin;
        let specificulture = localStorage.getItem(LocalStorageKeys.CONF_CURRENT_CULTURE);
        let viewName = 'mvc';
        var conf = getDefaultAxiosConfiguration();
        conf.baseURL = appUrl;
        conf.withCredentials = false;
        super(appUrl, modelName, viewName, specificulture, conf);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXJlc3QtcG9ydGFsLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvc2VydmljZXMvYmFzZS9taXgtcmVzdC1wb3J0YWwtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsTUFBTSxPQUFPLG9CQUF3QixTQUFRLGNBQWlCO0lBQzVELFlBQVksU0FBaUI7UUFDM0IsSUFBSSxNQUFNLEdBQ1IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7WUFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDekIsSUFBSSxjQUFjLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDdkMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQ3RDLENBQUM7UUFDRixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDRiJ9