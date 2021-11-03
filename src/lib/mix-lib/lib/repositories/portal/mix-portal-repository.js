import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { MixViewModelTypes } from '../../enums/mix-enums';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';
import { MixRepository } from '../../infrastructure/base/mix-repository';
export class MixPortalRepository extends MixRepository {
    constructor(modelName) {
        const appUrl = localStorage.getItem(LocalStorageKeys.CONF_APP_URL) ||
            window.location.origin;
        const specificulture = localStorage.getItem(LocalStorageKeys.CONF_CURRENT_CULTURE);
        const viewName = MixViewModelTypes.Mvc;
        const conf = getDefaultAxiosConfiguration();
        conf.baseURL = appUrl;
        conf.withCredentials = false;
        super(`${appUrl}/rest/mix-portal`, modelName, viewName, specificulture, conf);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXBvcnRhbC1yZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9yZXBvc2l0b3JpZXMvcG9ydGFsL21peC1wb3J0YWwtcmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBQWdCLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRXpFLE1BQU0sT0FBTyxtQkFBdUIsU0FBUSxhQUFnQjtJQUMxRCxZQUFZLFNBQXVCO1FBQ2pDLE1BQU0sTUFBTSxHQUNWLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQ3pDLGdCQUFnQixDQUFDLG9CQUFvQixDQUN0QyxDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLDRCQUE0QixFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsS0FBSyxDQUNILEdBQUcsTUFBTSxrQkFBa0IsRUFDM0IsU0FBUyxFQUNULFFBQVEsRUFDUixjQUFjLEVBQ2QsSUFBSSxDQUNMLENBQUM7SUFDSixDQUFDO0NBQ0YifQ==