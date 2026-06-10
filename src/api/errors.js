export const getApiErrorMessage = (error, fallback) => {
  if (!error.response) {
    return 'Unable to reach the server. Please try again in a moment.';
  }

  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(', ');
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (detail?.message) {
    return detail.message;
  }

  return error.message || fallback;
};
