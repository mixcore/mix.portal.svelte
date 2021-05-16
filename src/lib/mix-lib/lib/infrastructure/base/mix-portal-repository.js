import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { MixViewModelTypes } from '../../enums/mix-enums';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
import { MixRepository } from './mix-repository';
export class MixPortalRepository extends MixRepository {
    constructor(modelName) {
        const appUrl = localStorage.getItem(LocalStorageKeys.CONF_APP_URL) ||
            window.location.origin;
        const specificulture = localStorage.getItem(LocalStorageKeys.CONF_CURRENT_CULTURE);
        const viewName = MixViewModelTypes.Mvc;
        const conf = getDefaultAxiosConfiguration();
        conf.baseURL = appUrl;
        conf.withCredentials = false;
        super(appUrl, modelName, viewName, specificulture, conf);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXBvcnRhbC1yZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbWl4LmxpYi50cy9zcmMvbGliL2luZnJhc3RydWN0dXJlL2Jhc2UvbWl4LXBvcnRhbC1yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3RFLE9BQU8sRUFBZ0IsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsTUFBTSxPQUFPLG1CQUF1QixTQUFRLGFBQWdCO0lBQzFELFlBQVksU0FBdUI7UUFDakMsTUFBTSxNQUFNLEdBQ1YsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7WUFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDekIsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDekMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQ3RDLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDRiJ9