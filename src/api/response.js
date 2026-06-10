export const getResponseData = (response) => {
  const payload = response?.data;
  return Array.isArray(payload?.data) ? payload.data : [];
};

export const getResponseMessage = (response, fallback = 'Done') =>
  response?.data?.message || fallback;
