function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const isServerError = statusCode >= 500;
  const message = isServerError ? "Something went wrong. Please try again later." : error.message;

  if (isServerError) {
    console.error(`${req.method} ${req.originalUrl}:`, error.message);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = errorHandler;
