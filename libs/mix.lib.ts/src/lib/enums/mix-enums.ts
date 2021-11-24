export enum MixViewModelTypes {
  Portal = 'portal',
  Mvc = 'mvc',
}
export enum DisplayDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}
export enum MixModelType {
  Page = 'mix-page-content',
  Post = 'mix-post-content',
  Module = 'module',
  Database = 'mix-database',
  DatabaseData = 'mix-database-data',
}
export enum MixContentStatus {
  Deleted = 'Deleted',
  Preview = 'Preview',
  Published = 'Published',
  Draft = 'Draft',
  Schedule = 'Schedule',
}
export enum MixDataType {
  DateTime = 'DateTime',
  Date = 'Date',
  Time = 'Time',
  Duration = 'Duration',
  PhoneNumber = 'PhoneNumber',
  Double = 'Double',
  Text = 'Text',
  Html = 'Html',
  MultilineText = 'MultilineText',
  EmailAddress = 'EmailAddress',
  Password = 'Password',
  Url = 'Url',
  ImageUrl = 'ImageUrl',
  CreditCard = 'CreditCard',
  PostalCode = 'PostalCode',
  Upload = 'Upload',
  Color = 'Color',
  Boolean = 'Boolean',
  Icon = 'PhoneNumber',
  VideoYoutube = 'VideoYoutube',
  TuiEditor = 'TuiEditor',
  Integer = 'Integer',
  Reference = 'Reference',
  QRCode = 'QRCode',
}
export enum MixMenuItemType {
  Page = 'Page',
  Module = 'Module',
  Post = 'Post',
  Database = 'Database',
  Uri = 'Uri',
}
export enum MixModuleType {
  Content = 'Content',
  Data = 'Data',
  ListPost = 'ListPost',
}
export enum MixPageType {
  System = 'System',
  Home = 'Home',
  Article = 'Article',
  ListPost = 'ListPost',
}
export enum MixTemplateFolderType {
  Layouts = 'Layouts',
  Pages = 'Pages',
  Modules = 'Modules',
  Forms = 'Forms',
  Edms = 'Edms',
  Posts = 'Posts',
  Widgets = 'Widgets',
  Masters = 'Masters',
}
