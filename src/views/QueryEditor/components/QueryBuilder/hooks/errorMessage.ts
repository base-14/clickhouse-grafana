export const extractErrorMessage = (err: any): string => {
  if (!err) {
    return 'Unknown error';
  }
  if (typeof err === 'string') {
    return err;
  }
  if (typeof err.message === 'string' && err.message) {
    return err.message;
  }
  if (typeof err.data?.error === 'string' && err.data.error) {
    return err.data.error;
  }
  if (typeof err.data?.message === 'string' && err.data.message) {
    return err.data.message;
  }
  if (typeof err.statusText === 'string' && err.statusText) {
    return err.statusText;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
};
