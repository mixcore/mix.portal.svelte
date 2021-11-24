import { MixModelType } from '../../enums/mix-enums';
import { MixPostPortalModel } from '../../models/portal/mix-post-portal-model';

import { MixPortalRepository } from './mix-portal-repository';

export class PostRepository extends MixPortalRepository<MixPostPortalModel> {
  constructor() {
    super(MixModelType.Post);
  }
}
