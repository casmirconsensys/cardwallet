import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { contactsLoadState } from '@rainbow-me/redux/contacts';
import { imageMetadataCacheLoadState } from '@rainbow-me/redux/imageMetadata';
import { keyboardHeightsLoadState } from '@rainbow-me/redux/keyboardHeight';
import { settingsLoadState } from '@rainbow-me/redux/settings';
import { promiseUtils } from '@rainbow-me/utils';
import logger from 'logger';

export default function useLoadGlobalData() {
  const dispatch = useDispatch();

  const loadGlobalData = useCallback(async () => {
    logger.sentry('Load wallet global data');
    const promises = [];
    const p1 = dispatch(settingsLoadState());
    const p2 = dispatch(contactsLoadState());
    const p3 = dispatch(imageMetadataCacheLoadState());
    const p4 = dispatch(keyboardHeightsLoadState());
    promises.push(p1, p2, p3, p4);

    return promiseUtils.PromiseAllWithFails(promises);
  }, [dispatch]);

  return loadGlobalData;
}
