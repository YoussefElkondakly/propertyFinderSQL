const Ads = require("./../model/adsModel");
const RequestAd = require("./../model/requestModel");
const User = require("./../model/userModel");
const relationShips = function () {
  Ads.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
  User.hasMany(Ads);
  RequestAd.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
  User.hasMany(RequestAd);
};
module.exports = relationShips;
