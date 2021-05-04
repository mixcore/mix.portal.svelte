import { getDefaultAxiosConfiguration } from '../helpers/mix-helper';
import { Api } from '../infrastructure/axios/api';
export class MixRestService extends Api {
    constructor(appUrl, modelName, viewName, specificulture, config) {
        // NEVER FORGET THE SUPER
        config = config || getDefaultAxiosConfiguration();
        config.baseURL = `${appUrl}/${modelName}/${viewName}`;
        if (specificulture) {
            config.baseURL = `${appUrl}/${specificulture}/${modelName}/${viewName}`;
        }
        super(config);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXJlc3Qtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9zZXJ2aWNlcy9taXgtcmVzdC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNsRCxNQUFNLE9BQU8sY0FBZSxTQUFRLEdBQUc7SUFDckMsWUFDRSxNQUFjLEVBQ2QsU0FBaUIsRUFDakIsUUFBZ0IsRUFDaEIsY0FBdUIsRUFDdkIsTUFBMkI7UUFFM0IseUJBQXlCO1FBQ3pCLE1BQU0sR0FBRyxNQUFNLElBQUksNEJBQTRCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsTUFBTSxJQUFJLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUN0RCxJQUFJLGNBQWMsRUFBRTtZQUNsQixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsTUFBTSxJQUFJLGNBQWMsSUFBSSxTQUFTLElBQUksUUFBUSxFQUFFLENBQUM7U0FDekU7UUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNGIn0=