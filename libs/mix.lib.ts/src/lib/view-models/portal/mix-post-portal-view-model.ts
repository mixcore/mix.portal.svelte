import { MixModelType } from '../../enums/mix-enums';
import { ViewModelBase } from '../../infrastructure/base/view-model-base';
import { MixPostPortalModel } from '../../models/portal/mix-post-portal-model';
import { plainToClass } from 'class-transformer';
export class MixPostPortalViewModel extends ViewModelBase<MixPostPortalModel> {
  public title?: string;
  public createdDateTime!: Date;

  constructor(model?: MixPostPortalModel) {
    super(MixModelType.Post, model);
  }

  parseModel(): MixPostPortalModel {
    const post = plainToClass(MixPostPortalModel, this);
    return post;
  }
  parseView(model: MixPostPortalModel): MixPostPortalViewModel {
    return plainToClass(MixPostPortalViewModel, model);
  }
}
