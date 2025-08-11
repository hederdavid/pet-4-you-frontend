import { Dialog } from 'quasar';

const defaultOptions = {
  persistent: true,
  html: true,
};

interface ConfirmOptions {
  title: string;
  message: string;
  okLabel?: string;
  okColor?: string;
  cancelLabel?: string;
  cancelColor?: string;
}

const confirm = ({
  title,
  message,
  okLabel = 'Confirmar',
  okColor = 'positive',
  cancelLabel = 'Cancelar',
  cancelColor = 'negative',
}: ConfirmOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    Dialog.create({
      ...defaultOptions,
      title,
      message,
      ok: {
        label: okLabel,
        color: okColor,
        unelevated: true,
        'data-cy': 'dialog-confirm-ok',
      },
      cancel: {
        label: cancelLabel,
        color: cancelColor,
        flat: true,
        'data-cy': 'dialog-confirm-cancel',
      },
    })
      .onOk(() => {
        resolve();
      })
      .onCancel(() => {
        reject(new Error('Ação cancelada pelo usuário.'));
      })
      .onDismiss(() => {
        reject(new Error('Diálogo fechado sem ação.'));
      });
  });
};

interface AlertOptions {
  title: string;
  message: string;
  okLabel?: string;
  color?: string;
}

const alert = ({ title, message, okLabel = 'OK', color = 'primary' }: AlertOptions): void => {
  Dialog.create({
    ...defaultOptions,
    title,
    message,
    ok: {
      label: okLabel,
      color: color,
      unelevated: true,
    },
  });
};

export const dialogService = {
  confirm,
  alert,
};
