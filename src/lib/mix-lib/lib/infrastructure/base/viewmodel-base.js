import { MixRestPortalRepository } from './mix-rest-portal-repository';
export class ViewModelBase {
    /**
     *
     */
    constructor(modelType) {
        this.repository = new MixRestPortalRepository(modelType);
    }
    create() {
        return this.repository.createModel(this);
    }
    update() {
        alert(this.id);
        return this.repository.updateModel(this.id, this);
    }
    delete(id) {
        return this.repository.deleteModel(id);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld21vZGVsLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvaW5mcmFzdHJ1Y3R1cmUvYmFzZS92aWV3bW9kZWwtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUV2RSxNQUFNLE9BQWdCLGFBQWE7SUFHakM7O09BRUc7SUFDSCxZQUFZLFNBQXVCO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sTUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNNLE1BQU07UUFDWCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDTSxNQUFNLENBQUMsRUFBbUI7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0YifQ==