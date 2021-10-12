import { MixModelType } from '../../enums/mix-enums';
import { ViewModelBase } from '../../infrastructure/base/view-model-base';
export class MixPostPortalViewModel extends ViewModelBase {
    title;
    createdDateTime;
    constructor(model) {
        super(MixModelType.Post, model);
    }
    parseModel() {
        const post = {
            id: this.id,
            title: this.title,
            createdDateTime: this.createdDateTime,
        };
        return post;
    }
    parseView(model) {
        this.id = model.id;
        this.title = model.title;
        this.createdDateTime = model.createdDateTime;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXBvc3QtcG9ydGFsLXZpZXctbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3ZpZXctbW9kZWxzL3BvcnRhbC9taXgtcG9zdC1wb3J0YWwtdmlldy1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRzFFLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxhQUFpQztJQUNwRSxLQUFLLENBQVU7SUFDZixlQUFlLENBQVE7SUFFOUIsWUFBWSxLQUEwQjtRQUNwQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsVUFBVTtRQUNSLE1BQU0sSUFBSSxHQUF1QjtZQUMvQixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQVk7WUFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtTQUN0QyxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQXlCO1FBQ2pDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO0lBQy9DLENBQUM7Q0FDRiJ9