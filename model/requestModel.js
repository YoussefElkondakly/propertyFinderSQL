// const mongoose = require("mongoose");
const Sequelize = require("sequelize");
const sequelize = require("./../utils/database");

/*
Area: Heliopolis
City: Cairo
District: Heliopolis district, Cairo Governorate
district, price, and area
*/
const RequestAd = sequelize.define("requests", {
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Price is required",
      },
    },
  },
  area: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "you Need To provide the area of the property",
      },
    },
    // required: [true, "you Need To provide the area of the property"],
  },
  district: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "you Need To provide the district of the property",
      },
    },
    // required: [true, "you Need To provide the district of the property"],
  },
  //Non required with requests
  propertyType: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Property Type is required",
      },
      isIn: {
        args: [["VILLA", "HOUSE", "LAND", "APARTMENT"]],
        msg: "Please Insert a Correct Property Type",
      },
    },
  },
  description: Sequelize.STRING,
  city: Sequelize.STRING,
  note: Sequelize.STRING,
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  // refreshedAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});
// requestSchema.pre(/^find/,function(next){
//   this.populate({
//     path: "client",
//     select: "name phone -_id",
//     });
//     next();
// })
// const RequestAd = mongoose.model("RequestAd", requestSchema);
// RequestAd.beforeValidate(function (requestAd) {
//   requestAd.propertyType = requestAd.propertyType.toUpperCase();
//   requestAd.type = requestAd.type.toUpperCase();
// });
module.exports = RequestAd;
