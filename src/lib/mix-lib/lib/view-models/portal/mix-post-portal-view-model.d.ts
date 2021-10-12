import { ViewModelBase } from '../../infrastructure/base/view-model-base';
import { MixPostPortalModel } from '../../models/portal/mix-post-portal-model';
export declare class MixPostPortalViewModel extends ViewModelBase<MixPostPortalModel> {
    title?: string;
    createdDateTime: Date;
    constructor(model?: MixPostPortalModel);
    parseModel(): MixPostPortalModel;
    parseView(model: MixPostPortalModel): void;
}
