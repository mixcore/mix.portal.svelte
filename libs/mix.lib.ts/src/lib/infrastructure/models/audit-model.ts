export abstract class AuditModel<TPrimaryKey> {
  public id?: TPrimaryKey;
  public lastModified?: Date;
  public createdDateTime!: Date;
}
