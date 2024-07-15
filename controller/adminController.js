const AppError = require('../utils/appError');
const Ads=require('./../model/adsModel')
const RequestAd = require("./../model/requestModel");
const catchAsync=require('./../utils/catchAsync')
const paginate=require('./../utils/paginate')
/*
Implement an endpoint for admin users to return statistics about how many ads or requests exist for a user (client or agent) and the total amount of those ads or requests.
     - Only admins can access this endpoint.
     - Use MongoDB's aggregation framework to implement this endpoint.
     - Response example
```javascript
{
  data: [{
    name: XXX,
    role: XXX,
    ...other user data,
    adsCount: 0,
    totalAdsAmount: 0,
    requestsCount: 10,
    totalRequestsAmount: 23600,
  }],
  page: 1,
  limit: 10
  total: 200
  hasNextPage: true
  hasPreviousPage: false
}
```
*/


exports.getStats=catchAsync(async (req,res,next)=>{
    const query = Ads.aggregate([
      {
        $group: {
          _id: "$agent",
          adsCount: { $sum: 1 },
          totalAdsAmount: { $sum: "$price" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $addFields: {
          agentName:"$agent.name",
           agentPhone:"$agent.phone"
        },
      },
        {
          $project: {
            _id: 0,
         agentName:1,
agentPhone:1,
            adsCount: 1,
            totalAdsAmount: 1,
          },
        },
    ]);
     let totalCount = await Ads.aggregate([
       {
         $group: {
           _id: "$agent",
         },
       },
       {
         $count: "totalCount",
       },
     ]);
     totalCount = totalCount[0]["totalCount"];
    const stats=await paginate(req.query,query)
    if(stats.length===0)return next(new AppError("No data please go to the first page",401))
      const page=req.query.page*1||1
      const limit=req.query.limit*1||10
    const hasnextpage =
      page * limit >= totalCount  ? false : true;
      res.status(200).json({
        status: "success",
        data: stats,
        page: page,
        limit: limit,
        total: totalCount,
        hasNextPage: hasnextpage,
        hasPreviousPage: page > 1 ? true : false,
      });
});
exports.getRequestsStats = catchAsync(async (req, res, next) => {
  const query = RequestAd.aggregate([
    {
      $group: {
        _id: "$client",
        refreshCount: { $sum: 1 },
        totalRefreshAmount: { $sum: "$price" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: "$client",
    },
    {
      $addFields: {
        clientName: "$client.name",
        clientPhone: "$client.phone",
      },
    },
    {
      $project: {
        _id: 0,
        clientName: 1,
        clientPhone: 1,
        refreshCount: 1,
        totalRefreshAmount: 1,
      },
    },
  ]);
let totalCount = await RequestAd.aggregate([
  {
    $group: {
      _id: "$client",
    },
  },
  {
    $count: "totalCount",
  },
]);
totalCount = totalCount[0]["totalCount"];
  const stats = await paginate(req.query, query);
  if (stats.length === 0)
    return next(new AppError("No data please go to the Previous page", 401));
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const hasnextpage =
      page * limit >= totalCount  ? false : true;
  res.status(200).json({
    status: "success",
    data: stats,
    page: page,
    limit: limit,
    total: stats.length,
    hasNextPage: hasnextpage,
    hasPreviousPage: page > 1 ? true : false,
  });
});