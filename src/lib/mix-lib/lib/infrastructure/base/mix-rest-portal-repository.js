import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { MixViewModelTypes } from '../../enums/mix-enums';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
import { MixRestRepository } from './mix-rest-repository';
export class MixRestPortalRepository extends MixRestRepository {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXJlc3QtcG9ydGFsLXJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvaW5mcmFzdHJ1Y3R1cmUvYmFzZS9taXgtcmVzdC1wb3J0YWwtcmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBQWdCLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFeEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsTUFBTSxPQUFPLHVCQUEyQixTQUFRLGlCQUFvQjtJQUNsRSxZQUFZLFNBQXVCO1FBQ2pDLE1BQU0sTUFBTSxHQUNWLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQ3pDLGdCQUFnQixDQUFDLG9CQUFvQixDQUN0QyxDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLDRCQUE0QixFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0YifQ==