import { MixModelType } from '../../enums/mix-enums';
import { MixPortalRepository } from '../../infrastructure/base/mix-portal-repository';
import { MixPostPortalModel } from '../../models/portal/mix-post-portal-model';

export class PostRepository extends MixPortalRepository<MixPostPortalModel> {
  constructor() {
    super(MixModelType.Post);
  }
}
