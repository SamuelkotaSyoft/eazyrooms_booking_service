const globalErrorHandler = (err, req, res, next) => {
  res.status(500);
};
export default globalErrorHandler;
