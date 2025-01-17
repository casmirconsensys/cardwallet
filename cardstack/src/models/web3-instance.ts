import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';

import logger from 'logger';

import Web3WsProvider from './web3-provider';

const web3Instance: Web3 = new Web3();

const Web3Instance = {
  get: async () => {
    const isProviderDisconnected = !(web3Instance.currentProvider as WebsocketProvider)
      ?.connected;

    try {
      if (web3Instance.currentProvider === null || isProviderDisconnected) {
        web3Instance.setProvider(await Web3WsProvider.get());
      }
    } catch (e) {
      logger.log('Failed while getting web3Instance', e);
    }

    return web3Instance;
  },
};

export default Web3Instance;
