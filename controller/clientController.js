// const imageUpload = require("./../utils/imageUpload");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Ads = require("./../model/adsModel");
const RequestAd = require("./../model/requestModel");

exports.getAds = catchAsync(async (req, res, next) => {
  const ads = await Ads.find();
  if (ads.length === 0) return next(new AppError("No Ads Right Now", 404));

  res.status(200).json({
    status: "success",
    data: ads,
  });
});

exports.getAd = catchAsync(async (req, res, next) => {
  const ad = await Ads.findOne({ _id: req.params.adId });
  if (ad.length === 0) return next(new AppError("No Ads Right Now", 404));

  res.status(200).json({
    status: "success",
    data: ad,
  });
});
//POST REQUEST
exports.postApropertyRequest = catchAsync(async (req, res, next) => {
  const makeRequest = await req.youser.createRequest(req.body);
  if (!makeRequest)
    return next(new AppError("There is A problem Sending The Ad", 401));

  res.status(200).json({
    status: "success",
    data: makeRequest,
  });
  // res.end()
});

exports.viewMatchAds = catchAsync(async (req, res, next) => {
  const request = await RequestAd.findOne(req.params.id);
  if (!request) return next(new AppError("No Request Found", 404));
  // console.log(request);
  const budget = request.price;
  //$or: [ { score: { $gt: 70, $lt: 90 } }
  //district, price, and area
  console.log(budget + budget * 0.1, budget - budget * 0.1);
  const ads = await Ads.aggregate(
    [
      {
        $match: {
          $or: [
            {
              price: {
                $lte: budget + budget * 0.1,
                $gte: budget - budget * 0.1,
              },
            },
          ],
          area: { $regex: request.area },
          district: { $regex: request.district },
        },
      },
    ],
    {}
  );
  await Ads.populate(ads, { path: "agent", select: "name phone -_id" });
  if (ads.length === 0)
    return next(new AppError("No Ads Found at this moment", 404));
  res.status(200).json({
    status: "success",
    data: ads,
  });
});
exports.getAllRequests = catchAsync(async (req, res, next) => {
  const requests = await RequestAd.find({ client: req.user._id });
  if (requests.length === 0) return next(new AppError("No Ads Right Now", 404));
  res.status(200).json({
    status: "success",
    data: requests,
  });
});
exports.checkOwnerShip = catchAsync(async (req, res, next) => {
  const request = await RequestAd.findOne({ _id: req.params.requestId });
  if (!request || !("" + request.client === req.user.id))
    return next(new AppError("No Ads Right Now", 404));
  next();
});
exports.getRequest = catchAsync(async (req, res, next) => {
  const request = await RequestAd.findOne({ _id: req.params.requestId });
  // if (request.length === 0) return next(new AppError("No Ads Right Now", 404));

  request.refreshedAt = Date.now();
  await request.save();
  res.status(200).json({
    status: "success",
    data: request,
  });
});

exports.updateRequest = catchAsync(async (req, res, next) => {
  const updatedRequest = await RequestAd.findByIdAndUpdate(
    req.params.requestId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedRequest,
  });
});

exports.deleteRequest = catchAsync(async (req, res, next) => {
  const request = await RequestAd.findByIdAndDelete(req.params.requestId);
  // if (request.length === 0||!(''+request.client===req.user.id)) return next(new AppError("No Ads Right Now", 404));
  res.status(204).json({
    status: "success",
    data: request,
  });
});

// const {client} = await RequestAd.findOne({ _id: req.params.requestId }).select("client -_id");
// console.log(client)
//   if (request.length === 0 || !("" + request.client === req.user.id))
//     return next(new AppError("No Ads Right Now", 404));

// const request = await RequestAd.findOne({ _id: req.params.requestId });
// console.log(request)
// if (!request||!(''+request.client===req.user.id)) return next(new AppError("No Ads Right Now", 404));

//in this controller you are an official verified client
//you have in the request the params of the requested property's Id and your user Id that will be linked
//to the ad
//you have in the request body that have a message to the agent

// const getAll=function(Model){
//   return catchAsync(async (req, res, next) => {
//   const all = await Model.find({client:user.id});
//   if (all.length === 0) return next(new AppError("No Ads Right Now", 404));

//   res.status(200).json({
//     status: "success",
//     data: all,
//   });
// });
// }
