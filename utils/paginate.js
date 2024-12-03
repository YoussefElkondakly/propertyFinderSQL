const paginate = function (reqQuery, query) {
  let limit = 10;
  let page = 1;
  if (reqQuery.page && reqQuery.limit) {
    limit = reqQuery.limit * 1;
    page = reqQuery.page * 1;
  }
  // console.log(limit, page)
  // console.dir(query.count(this));
  return query.skip((page - 1) * limit).limit(limit);
};
module.exports = paginate;
