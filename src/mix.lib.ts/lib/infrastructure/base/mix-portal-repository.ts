import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { MixModelType, MixViewModelTypes } from '../../enums/mix-enums';
import { getDefaultAxiosConfiguration } from '../../helpers/mix-helper';

import { MixRepository } from './mix-repository';
export class MixPortalRepository<T> extends MixRepository<T> {
  constructor(modelName: MixModelType) {
    const appUrl =
      localStorage.getItem(LocalStorageKeys.CONF_APP_URL) ||
      window.location.origin;
    const specificulture = localStorage.getItem(
      LocalStorageKeys.CONF_CURRENT_CULTURE
    );
    const viewName = MixViewModelTypes.Mvc;
    const conf = getDefaultAxiosConfiguration();
    conf.baseURL = appUrl;
    conf.withCredentials = false;
    super(appUrl, modelName, viewName, specificulture, conf);
  }
}
