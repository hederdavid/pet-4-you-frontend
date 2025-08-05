import { Notify } from 'quasar';

const defaults = {
  position: 'top-right',
  timeout: 3500,
  progress: true,
  actions: [{ icon: 'close', color: 'white', dense: true, round: true }],
};

const types = {
  success: {
    color: 'positive',
    icon: 'check_circle',
  },
  error: {
    color: 'negative',
    icon: 'error',
  },
  warning: {
    color: 'warning',
    textColor: 'dark',
    icon: 'warning',
  },
  info: {
    color: 'info',
    icon: 'info',
  },
};

const show = (message, type = 'info', options = {}) => {
  Notify.create({
    ...defaults,
    ...types[type],
    message,
    ...options,
  });
};

const handlePromise = async (promise, messages) => {
  const dismiss = Notify.create({
    ...defaults,
    group: false,
    spinner: true,
    message: messages.loading || 'Processando...',
    timeout: 0,
  });

  try {
    const result = await promise;

    const successMessage =
      typeof messages.success === 'function' ? messages.success(result) : messages.success;

    dismiss();
    show(successMessage, 'success');

    return result;
  } catch (error) {
    const errorMessage =
      typeof messages.error === 'function' ? messages.error(error) : messages.error;

    dismiss();
    show(errorMessage || 'Ocorreu um erro inesperado.', 'error');

    throw error;
  }
};

export const notification = {
  show,
  handlePromise,
};
