import { MixModelType } from '../../enums/mix-enums';
import { ViewModelBase } from '../../infrastructure/base/view-model-base';
import { MixPostPortalModel } from '../../models/portal/mix-post-portal-model';

export class MixPostPortalViewModel extends ViewModelBase<MixPostPortalModel> {
  public title?: string;
  public createdDateTime?: Date;

  constructor(model?: MixPostPortalModel) {
    super(MixModelType.Post, model);
  }

  parseModel(): MixPostPortalModel {
    const post: MixPostPortalModel = {
      id: this.id as number,
      title: this.title,
      createdDateTime: this.createdDateTime,
    };
    return post;
  }
  parseView(model: MixPostPortalModel): void {
    this.id = model.id;
    this.title = model.title;
    this.createdDateTime = model.createdDateTime;
  }
}
