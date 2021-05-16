import { MixModelType } from '../../enums/mix-enums';
import { ViewModelBase } from '../../infrastructure/base/view-model-base';
export class MixPostPortalViewModel extends ViewModelBase {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LXBvc3QtcG9ydGFsLXZpZXctbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9taXgubGliLnRzL3NyYy9saWIvdmlldy1tb2RlbHMvcG9ydGFsL21peC1wb3N0LXBvcnRhbC12aWV3LW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHMUUsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGFBQWlDO0lBSTNFLFlBQVksS0FBMEI7UUFDcEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLElBQUksR0FBdUI7WUFDL0IsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFZO1lBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7U0FDdEMsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFNBQVMsQ0FBQyxLQUF5QjtRQUNqQyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztJQUMvQyxDQUFDO0NBQ0YifQ==