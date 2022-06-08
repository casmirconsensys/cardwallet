import { useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import { isNil } from 'lodash';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  CreateImportParams,
  createOrImportWallet,
  loadAddress,
} from '../model/wallet';
import {
  resetAccountState,
  settingsLoadNetwork,
  settingsUpdateAccountAddress,
} from '../redux/settings';
import {
  addressSetSelected,
  walletsLoadState,
  walletsSetSelected,
} from '../redux/wallets';
import useAccountSettings from './useAccountSettings';
import useInitializeAccountData from './useInitializeAccountData';
import useLoadAccountData from './useLoadAccountData';
import useLoadGlobalData from './useLoadGlobalData';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { getPin } from '@cardstack/models/secure-storage';
import {
  navigationStateNewWallet,
  Routes,
  useLoadingOverlay,
} from '@cardstack/navigation';
import { appStateUpdate } from '@cardstack/redux/appState';

import { useAuthSelectorAndActions } from '@cardstack/redux/authSlice';
import { PinFlow } from '@cardstack/screens/PinScreen/types';

import { saveAccountEmptyState } from '@rainbow-me/handlers/localstorage/accountLocal';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import logger from 'logger';

interface CreateWalletParams
  extends Pick<CreateImportParams, 'color' | 'name'> {
  isFromWelcomeFlow?: boolean;
}

export default function useWalletManager() {
  const dispatch = useDispatch();

  const loadAccountData = useLoadAccountData();
  const loadGlobalData = useLoadGlobalData();
  const initializeAccountData = useInitializeAccountData();

  const { network } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { navigate, reset } = useNavigation();

  const { hasWallet, setHasWallet } = useAuthSelectorAndActions();

  const createWalletPin = useCallback(
    (overwriteParams = {}) => {
      navigate(Routes.PIN_SCREEN, {
        flow: PinFlow.create,
        variant: 'dark',
        canGoBack: true,
        dismissOnSuccess: false,
        ...overwriteParams,
      });
    },
    [navigate]
  );

  const initializeWallet = useCallback(
    async (seedPhrase?: string) => {
      try {
        logger.sentry('Start wallet init');

        const noPin = !(await getPin());

        if (noPin) {
          // TODO: handle secrets migration
          createWalletPin({
            canGoBack: false,
            dismissOnSuccess: true,
          });
        }

        await dispatch(resetAccountState());
        logger.sentry('resetAccountState ran ok');

        await dispatch(settingsLoadNetwork());

        logger.sentry('done loading network');

        await dispatch(walletsLoadState());

        const walletAddress = await loadAddress();

        if (isNil(walletAddress)) {
          logger.sentry('[initializeWallet] - walletAddress null');
          dispatch(appStateUpdate({ walletReady: true }));
          return null;
        }
        await dispatch(settingsUpdateAccountAddress(walletAddress));

        await loadGlobalData();
        logger.sentry('loaded global data...');
        await loadAccountData(network);
        logger.sentry('loaded account data', network);

        await initializeAccountData();

        await checkPushPermissionAndRegisterToken(walletAddress, seedPhrase);

        dispatch(appStateUpdate({ walletReady: true }));

        return walletAddress;
      } catch (error) {
        logger.sentry('Error while initializing wallet', error);
        captureException(error);

        return null;
      } finally {
        dispatch(appStateUpdate({ walletReady: true }));
      }
    },
    [
      dispatch,
      loadGlobalData,
      loadAccountData,
      network,
      initializeAccountData,
      createWalletPin,
    ]
  );

  const initWalletResetNavState = useCallback(
    async (seedPhrase?: string, isInnerNavigation: boolean = false) => {
      await initializeWallet(seedPhrase);

      setHasWallet();

      if (isInnerNavigation) {
        navigate(Routes.WALLET_SCREEN, { initialized: true });
        return;
      }

      // TODO: remove on react-nav 6
      reset(navigationStateNewWallet);
    },
    [initializeWallet, navigate, reset, setHasWallet]
  );

  const createNewWallet = useCallback(
    async ({ color, name, isFromWelcomeFlow }: CreateWalletParams = {}) =>
      createWalletPin({
        onSucess: async (pin: string) => {
          try {
            if (isFromWelcomeFlow) {
              showLoadingOverlay({
                title: walletLoadingStates.CREATING_WALLET,
              });
            }

            const wallet = await createOrImportWallet({
              color,
              name,
              pin,
            });

            const walletAddress = wallet?.address;

            await saveAccountEmptyState(
              true,
              walletAddress?.toLowerCase(),
              network
            );

            initWalletResetNavState();
          } catch (e) {
            logger.sentry('Error creating new wallet', e);
          }
        },
      }),
    [createWalletPin, initWalletResetNavState, network, showLoadingOverlay]
  );

  const importWallet = useCallback(
    async (params: CreateImportParams) => {
      const walletImport = async () => {
        try {
          showLoadingOverlay({ title: walletLoadingStates.IMPORTING_WALLET });

          const wallet = await createOrImportWallet(params);

          if (wallet) {
            initWalletResetNavState(params.seed, hasWallet);
          } else {
            dismissLoadingOverlay();
          }
        } catch (e) {
          navigate(Routes.IMPORT_SEED_SHEET);

          logger.sentry('Error while importing wallet', e);

          Alert.alert(
            'Something went wrong while importing. Please try again!'
          );
        }
      };

      if (hasWallet) {
        return walletImport();
      }

      createWalletPin({ onSucess: walletImport });
    },
    [
      createWalletPin,
      dismissLoadingOverlay,
      hasWallet,
      initWalletResetNavState,
      navigate,
      showLoadingOverlay,
    ]
  );

  const changeSelectedWallet = useCallback(
    async (wallet, address) => {
      const p1 = dispatch(walletsSetSelected(wallet));
      const p2 = dispatch(addressSetSelected(address));
      await Promise.all([p1, p2]);

      await initializeWallet();
    },
    [dispatch, initializeWallet]
  );

  return {
    initializeWallet,
    createNewWallet,
    importWallet,
    changeSelectedWallet,
    initWalletResetNavState,
  };
}
