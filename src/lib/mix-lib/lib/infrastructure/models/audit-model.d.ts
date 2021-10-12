export declare abstract class AuditModel<TPrimaryKey> {
    id?: TPrimaryKey;
    lastModified?: Date;
    createdDateTime: Date;
}
