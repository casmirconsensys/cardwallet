import assert from 'assert';
import { captureException } from '@sentry/react-native';
import { endsWith, forEach, map } from 'lodash';
import { ACCESSIBLE, Options } from 'react-native-keychain';
import {
  CLOUD_BACKUP_ERRORS,
  encryptAndSaveDataToCloud,
  getDataFromCloud,
} from '../handlers/cloudBackup';
import WalletBackupTypes from '../helpers/walletBackupTypes';
import WalletTypes from '../helpers/walletTypes';
import {
  allWalletsKey,
  iCloudKey,
  privateKeyKey,
  seedPhraseKey,
  selectedWalletKey,
} from '../utils/keychainConstants';
import * as keychain from './keychain';
import {
  AllRainbowWallets,
  allWalletsVersion,
  createOrImportWallet,
  publicAccessControlOptions,
  RainbowWallet,
} from './wallet';

import { Device } from '@cardstack/utils/device';
import logger from 'logger';

type BackupPassword = string;

interface BackedUpData {
  [key: string]:
    | string
    | {
        version: number;
        wallets: AllRainbowWallets;
      };
}

interface BackupUserData {
  wallets: AllRainbowWallets;
}

export interface ICloudBackupData {
  createdAt: number;
  updatedAt: number;
  secrets: { [key: string]: string };
}

async function extractSecretsForWallet(wallet: RainbowWallet) {
  const allKeys = await keychain.loadAllKeys();
  if (!allKeys) throw new Error(CLOUD_BACKUP_ERRORS.KEYCHAIN_ACCESS_ERROR);
  const secrets = {} as { [key: string]: string };

  const allowedPkeysKeys = map(
    wallet?.addresses,
    account => `${account.address}_${privateKeyKey}`
  );

  allKeys.forEach(item => {
    // Ignore allWalletsKey
    if (item.username === allWalletsKey) {
      return;
    }

    // Ignore selected wallet
    if (item.username === selectedWalletKey) {
      return;
    }

    // Ignore another wallets seeds
    if (
      item.username.indexOf(`_${seedPhraseKey}`) !== -1 &&
      item.username !== `${wallet.id}_${seedPhraseKey}`
    ) {
      return;
    }

    // Ignore other wallets PKeys
    if (
      item.username.indexOf(`_${privateKeyKey}`) !== -1 &&
      allowedPkeysKeys.indexOf(item.username) === -1
    ) {
      return;
    }

    secrets[item.username] = item.password;
  });
  return secrets;
}

export async function backupWalletToCloud(
  password: BackupPassword,
  wallet: RainbowWallet
) {
  const now = Date.now();

  logger.log('calling extractSecretsForWallet');
  const secrets = await extractSecretsForWallet(wallet);
  const data = {
    createdAt: now,
    secrets,
  } as ICloudBackupData;
  logger.log('calling encryptAndSaveDataToCloud');
  return encryptAndSaveDataToCloud(data, password, `backup_${now}.json`);
}

export async function addWalletToCloudBackup(
  password: BackupPassword,
  wallet: RainbowWallet,
  filename: string
): Promise<boolean> {
  const backup = await getDataFromCloud(password, filename);
  assert(backup, 'No backup found');
  const now = Date.now();

  const secrets = await extractSecretsForWallet(wallet);

  backup.updatedAt = now;
  // Merge existing secrets with the ones from this wallet
  backup.secrets = {
    ...backup.secrets,
    ...secrets,
  };
  const savedFilename = await encryptAndSaveDataToCloud(
    backup,
    password,
    filename
  );
  return !!savedFilename;
}

export function findLatestBackUp(wallets: AllRainbowWallets): string | null {
  let latestBackup: string | null = null;
  let filename: string | null = null;

  forEach(wallets, wallet => {
    // Check if there's a wallet backed up
    if (
      wallet.backedUp &&
      wallet.backupDate &&
      wallet.backupFile &&
      wallet.backupType === WalletBackupTypes.cloud
    ) {
      // If there is one, let's grab the latest backup
      if (!latestBackup || wallet.backupDate > latestBackup) {
        filename = wallet.backupFile;
        latestBackup = wallet.backupDate;
      }
    }
  });

  return filename;
}

export async function restoreCloudBackup(
  password: BackupPassword,
  userData: BackupUserData | null,
  backupSelected: string | null
): Promise<boolean> {
  // We support two flows
  // Restoring from the welcome screen, which uses the userData to rebuild the wallet
  // Restoring a specific backup from settings => Backup, which uses only the keys stored.

  try {
    const filename =
      backupSelected || (userData && findLatestBackUp(userData?.wallets));
    if (!filename) {
      return false;
    }
    // 2- download that backup
    const data = await getDataFromCloud(password, filename);
    if (!data) {
      throw new Error('Invalid password');
    }
    let dataToRestore = {
      ...data.secrets,
    } as {
      [key: string]: string | { version: number; wallets: AllRainbowWallets };
    };

    if (userData) {
      // Restore only wallets that were backed up in cloud
      // or wallets that are read-only
      const walletsToRestore: AllRainbowWallets = {};
      forEach(userData.wallets, wallet => {
        if (
          (wallet.backedUp &&
            wallet.backupDate &&
            wallet.backupFile &&
            wallet.backupType === WalletBackupTypes.cloud) ||
          wallet.type === WalletTypes.readOnly
        ) {
          walletsToRestore[wallet.id] = wallet;
        }
      });

      // All wallets
      dataToRestore[allWalletsKey] = {
        version: allWalletsVersion,
        wallets: walletsToRestore,
      };
      return restoreCurrentBackupIntoKeychain(dataToRestore);
    } else {
      return restoreSpecificBackupIntoKeychain(dataToRestore);
    }
  } catch (e) {
    logger.sentry('Error while restoring back up');
    captureException(e);
    return false;
  }
}

async function restoreSpecificBackupIntoKeychain(
  backedUpData: BackedUpData
): Promise<boolean> {
  try {
    // Re-import all the seeds (and / or pkeys) one by one
    for (const key of Object.keys(backedUpData)) {
      if (endsWith(key, seedPhraseKey)) {
        const valueStr = backedUpData[key];
        assert(typeof valueStr == 'string', 'Seed is not a string');
        const { seedphrase } = JSON.parse(valueStr);
        await createOrImportWallet({ seed: seedphrase });
      }
    }
    return true;
  } catch (e) {
    logger.sentry('error in restoreSpecificBackupIntoKeychain');
    captureException(e);
    return false;
  }
}

async function restoreCurrentBackupIntoKeychain(
  backedUpData: BackedUpData
): Promise<boolean> {
  try {
    // Access control config per each type of key
    const privateAccessControlOptions = await keychain.getPrivateAccessControlOptions();

    await Promise.all(
      Object.keys(backedUpData).map(async key => {
        const value = backedUpData[key];
        let accessControl: Options = publicAccessControlOptions;
        if (endsWith(key, seedPhraseKey) || endsWith(key, privateKeyKey)) {
          accessControl = privateAccessControlOptions;
        }
        if (typeof value === 'string') {
          return keychain.saveString(key, value, accessControl);
        } else {
          return keychain.saveObject(key, value, accessControl);
        }
      })
    );

    return true;
  } catch (e) {
    logger.sentry('error in restoreBackupIntoKeychain');
    captureException(e);
    return false;
  }
}

// Attempts to save the password to decrypt the backup from the iCloud keychain
export async function saveBackupPassword(
  password: BackupPassword
): Promise<void> {
  try {
    if (Device.isIOS) {
      await keychain.saveString(iCloudKey, password, {
        accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      });
    }
  } catch (e) {
    logger.sentry('Error while backing up password', e);
    captureException(e);
  }
}

// Attempts to fetch the password to decrypt the backup from the iCloud keychain
export async function fetchBackupPassword(): Promise<string | null> {
  if (Device.isAndroid) {
    return null;
  }

  try {
    const password = (await keychain.loadString(iCloudKey)) || null;
    if (typeof password === 'string') {
      return password;
    }
    throw new Error('Unexpected response loading decryption password');
  } catch (e) {
    logger.sentry('Error while fetching backup password', e);
    captureException(e);
    return null;
  }
}
