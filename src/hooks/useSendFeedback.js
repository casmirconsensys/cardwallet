import Clipboard from '@react-native-community/clipboard';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import Mailer from 'react-native-mail';
import { Alert } from '../components/alerts';
import useAppVersion from './useAppVersion';
import { SUPPORT_EMAIL_ADDRESS } from '@cardstack/constants';

const setClipboardToFeedbackEmail = () =>
  Clipboard.setString(SUPPORT_EMAIL_ADDRESS);

const FeedbackErrorAlert = () =>
  Alert({
    buttons: [
      {
        onPress: setClipboardToFeedbackEmail,
        text: 'Copy email address',
      },
      {
        style: 'cancel',
        text: 'No thanks',
      },
    ],
    message:
      'Would you like to manually copy our feedback email address to your clipboard?',
    title: 'Error launching email client',
  });

const handleMailError = debounce(
  error => (error ? FeedbackErrorAlert() : null),
  250
);

function feedbackEmailOptions(appVersion) {
  return {
    recipients: [SUPPORT_EMAIL_ADDRESS],
    subject: `Card Wallet Feedback - ${ios ? 'iOS' : 'Android'} ${appVersion}`,
  };
}

export default function useSendFeedback() {
  const appVersion = useAppVersion();
  const onSendFeedback = useCallback(
    () => Mailer.mail(feedbackEmailOptions(appVersion), handleMailError),
    [appVersion]
  );
  return onSendFeedback;
}
