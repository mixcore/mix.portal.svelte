import { MixContentStatus } from '../../enums/mix-enums';
import { AuditModel } from '../../infrastructure/models/audit-model';
import { SupportedCulture } from '../shared/supported-culture';
export declare class MixPostPortalModel extends AuditModel<number> {
    cultures?: SupportedCulture;
    template?: string;
    image?: string;
    thumbnail?: string;
    icon?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    seoName?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    seoSource?: string;
    views?: number;
    type?: string;
    publishedDateTime?: Date;
    tags?: string;
    createdBy?: string;
    modifiedBy?: string;
    priority?: number;
    status?: MixContentStatus;
}
