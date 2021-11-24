import { MixContentStatus } from '../../enums/mix-enums';
import { AuditModel } from '../../infrastructure/models/audit-model';
import { SupportedCulture } from '../shared/supported-culture';

export class MixPostPortalModel extends AuditModel<number> {
  public cultures?: SupportedCulture;
  public template?: string;
  public image?: string;
  public thumbnail?: string;
  public icon?: string;
  public title?: string;
  public excerpt?: string;
  public content?: string;
  public seoName?: string;
  public seoTitle?: string;
  public seoDescription?: string;
  public seoKeywords?: string;
  public seoSource?: string;
  public views?: number;
  public type?: string;
  public publishedDateTime?: Date;
  public tags?: string;
  public createdBy?: string;
  public modifiedBy?: string;
  public priority?: number;
  public status?: MixContentStatus;
}
