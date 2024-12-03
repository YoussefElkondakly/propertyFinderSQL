//this for reducing the try Catch calling
const catchAsync = (fn) => {
  return (req, res, next) => fn(req, res, next).catch((err) => next(err));
};
module.exports = catchAsync;
