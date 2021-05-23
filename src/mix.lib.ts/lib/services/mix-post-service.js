import { MixModelType } from '../enums/mix-enums';
import { getDefaultAxiosConfiguration } from '../helpers/mix-helper';
import { MixRestService } from './mix-rest-service';
export class PostService extends MixRestService {
    constructor() {
        let appUrl = 'https://store.mixcore.org/api/v1/rest/';
        let viewName = 'mvc';
        let specificulture = 'en-us';
        var conf = getDefaultAxiosConfiguration();
        conf.withCredentials = false;
        super(appUrl, MixModelType.Post, viewName, specificulture, conf);
    }
    // override base getSingleModel if need.
    getSingleModel(id) {
        let queries = {
            kw: 'test',
        };
        return super.getSingleModel(id, queries);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXBvc3Qtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9zZXJ2aWNlcy9taXgtcG9zdC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVyRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsTUFBTSxPQUFPLFdBQVksU0FBUSxjQUEwQjtJQUN6RDtRQUNFLElBQUksTUFBTSxHQUFHLHdDQUF3QyxDQUFDO1FBQ3RELElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixLQUFLLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsd0NBQXdDO0lBQ2pDLGNBQWMsQ0FBQyxFQUFPO1FBQzNCLElBQUksT0FBTyxHQUFHO1lBQ1osRUFBRSxFQUFFLE1BQU07U0FDWCxDQUFDO1FBQ0YsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0YifQ==