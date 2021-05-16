import { MixRestService } from './mix-rest-service';
export class MixRestPortalService extends MixRestService {
    constructor(appUrl, modelName, viewName, specificulture, config) {
        super(appUrl, modelName, 'portal', specificulture, config);
        this.instance.defaults.baseURL = appUrl;
        this.modelUrl = `${modelName}/${viewName}`;
        if (specificulture) {
            this.modelUrl = `${specificulture}/${modelName}/${viewName}`;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXJlc3QtcG9ydGFsLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvc2VydmljZXMvbWl4LXJlc3QtcG9ydGFsLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE1BQU0sT0FBTyxvQkFBd0IsU0FBUSxjQUFpQjtJQUU1RCxZQUNFLE1BQWMsRUFDZCxTQUFpQixFQUNqQixRQUFnQixFQUNoQixjQUF1QixFQUN2QixNQUEyQjtRQUUzQixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUMzQyxJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsY0FBYyxJQUFJLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQztTQUM5RDtJQUNILENBQUM7Q0FDRiJ9