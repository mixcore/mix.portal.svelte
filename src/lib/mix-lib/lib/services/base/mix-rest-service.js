import { Api } from '../../infrastructure/axios/api';
export class MixRestService extends Api {
    constructor(appUrl, modelName, viewName, specificulture, config) {
        super(config);
        this.instance.defaults.baseURL = appUrl;
        this.modelName = modelName;
        this.viewName = viewName;
        this.specificulture = specificulture;
    }
    get modelUrl() {
        return this.specificulture
            ? `/rest/${this.specificulture}/${this.modelName}/${this.viewName}`
            : `/rest/${this.modelName}/${this.viewName}`;
    }
    getSingleModel(id, queries) {
        this.instance.defaults.params = queries;
        return this.get(`${id}`);
    }
    getDefaultModel(queries) {
        this.instance.defaults.params = queries;
        return this.get(`default`);
    }
    getListModel(queries) {
        this.instance.defaults.params = queries;
        return this.get(this.modelUrl);
    }
    createModel(model) {
        return this.post(this.modelUrl, model);
    }
    updateModel(id, model) {
        return this.put(`${this.modelUrl}${id}`, model);
    }
    updateFields(id, fields) {
        return this.patch(`${this.modelUrl}/${id}`, fields);
    }
    deleteModel(id) {
        return this.delete(`${id}`);
    }
    duplicateModel(id, queries) {
        this.instance.defaults.params = queries;
        return this.get(`${this.modelUrl}/duplicate/${id}`);
    }
    exportListModel(queries) {
        this.instance.defaults.params = queries;
        return this.get('${this.modelUrl}/export');
    }
    clearCache(id) {
        return this.get(`${this.modelUrl}/remove-cache/${id}`);
    }
    setLanguage(specificulture) {
        this.specificulture = specificulture;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXJlc3Qtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9zZXJ2aWNlcy9iYXNlL21peC1yZXN0LXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRXJELE1BQU0sT0FBTyxjQUFrQixTQUFRLEdBQUc7SUFTeEMsWUFDRSxNQUFjLEVBQ2QsU0FBaUIsRUFDakIsUUFBZ0IsRUFDaEIsY0FBOEIsRUFDOUIsTUFBMkI7UUFFM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUN2QyxDQUFDO0lBakJELElBQVcsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxjQUFjO1lBQ3hCLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25FLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFlTSxjQUFjLENBQUMsRUFBTyxFQUFFLE9BQWE7UUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN4QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFTSxlQUFlLENBQUMsT0FBYTtRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sWUFBWSxDQUFDLE9BQXNCO1FBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sV0FBVyxDQUFDLEtBQVE7UUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLFdBQVcsQ0FBQyxFQUFPLEVBQUUsS0FBUTtRQUNsQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxZQUFZLENBQUMsRUFBTyxFQUFFLE1BQVc7UUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0sV0FBVyxDQUFDLEVBQU87UUFDeEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sY0FBYyxDQUFDLEVBQU8sRUFBRSxPQUFhO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTSxlQUFlLENBQUMsT0FBYTtRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxVQUFVLENBQUMsRUFBUTtRQUN4QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sV0FBVyxDQUFDLGNBQXNCO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRiJ9