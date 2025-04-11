export interface MixDatabase {
  id: number;
  specificulture: string;
  cultures: string[];
  name: string;
  displayName?: string;
  description?: string;
  formDisplay?: string;
  status: string;
  priority?: number;
  createdDateTime: string;
  modifiedDateTime?: string;
  columns?: MixDatabaseColumn[];
  forms?: MixDatabaseForm[];
  // Additional properties for settings page
  totalItems?: number;
  isPublic?: boolean;
  enableApi?: boolean;
  enableRls?: boolean;
  apiKeyPrefix?: string;
  corsOrigins?: string;
  enableCache?: boolean;
  cacheExpiration?: number;
  maxRecords?: number;
}

export interface MixDatabaseColumn {
  id: number;
  mixDatabaseId: number;
  mixDatabaseName?: string;
  referenceId?: number;
  referenceName?: string;
  name: string;
  displayName?: string;
  systemName?: string;
  isRequire?: boolean;
  dataType: string;
  options?: string;
  priority?: number;
  status?: string;
  createdDateTime?: string;
  createdBy?: string;
  modifiedDateTime?: string;
  modifiedBy?: string;
  width?: string;
  regexPattern?: string;
  regexErrorMessage?: string;
  defaultValue?: string;
}

export interface MixDatabaseForm {
  id: number;
  name: string;
  title?: string;
  description?: string;
  mixDatabaseId: number;
  mixDatabaseName: string;
  fields: MixDatabaseColumn[];
  template?: string;
  createdDateTime: string;
  createdBy?: string;
  modifiedDateTime?: string;
  modifiedBy?: string;
  status: string;
  priority?: number;
}

export interface MixDatabaseData {
  id: number;
  specificulture: string;
  cultures: string[];
  mixDatabaseId: number;
  mixDatabaseName: string;
  status: string;
  priority: number;
  createdDateTime: string;
  createdBy: string;
  modifiedDateTime?: string;
  modifiedBy?: string;
  data: MixDatabaseDataValue[];
}

export interface MixDatabaseDataValue {
  id: number;
  specificulture: string;
  mixDatabaseColumnId: number;
  mixDatabaseColumnName: string;
  regex?: string;
  dataType: string;
  value: string;
  booleanValue?: boolean;
  stringValue?: string;
  encryptValue?: string;
  dateTimeValue?: Date;
  doubleValue?: number;
  integerValue?: number;
  status: string;
  priority?: number;
  createdDateTime: string;
  createdBy?: string;
  modifiedDateTime?: string;
  modifiedBy?: string;
}
