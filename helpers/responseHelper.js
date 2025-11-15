module.exports = {
  // success: devuelve `{ status: 'success', data, ...meta }`
  success(res, data = null, message = null, status = 200, meta = null) {
    const payload = { status: 'success' };
    if (message) payload.message = message;
    if (data !== undefined) payload.data = data;
    if (meta && meta.pagination) payload.pagination = meta.pagination;
    return res.status(status).json(payload);
  },

  // fail / error: devuelven `{ status: 'error', message }`
  fail(res, message = 'Not found', status = 404) {
    return res.status(status).json({ status: 'error', message });
  },

  error(res, message = 'Internal Server Error', status = 500) {
    return res.status(status).json({ status: 'error', message });
  }
};
