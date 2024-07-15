const Sequelize = require('sequelize');
const sequelize=require('./../utils/database')

const Ads = sequelize.define("ads", {
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
    // check the value is one of these
    //implement before Hook
    // required: [true, "Please Enter the Property Type "],
    // enum: {
    //   values: ["VILLA", "HOUSE", "LAND", "APARTMENT"],
    //   message: "Please Insert a Correct Property Type",
    // },
  },
  area: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please insert the area",
      },
    },
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please insert a city name",
      },
    },
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: "Please insert a valid price",
      },
      notNull: {
        msg: "Please Insert A Price",
      },
    },
  },
  district: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please Input a district name",
      },
    },
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please Add A property Image",
      },
    },
  },

  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Property Type is required",
      },
      isIn: {
        args: [["SALE", "RENT"]],
        msg: "Please Insert a Correct Type",
      },
    },
  },
});
Ads.beforeValidate(function (ad) {if (ad.propertyType) {
  ad.propertyType = ad.propertyType.toUpperCase();}else if (ad.type) {
    ad.type = ad.type.toUpperCase();
  }
});
// adsSchema.pre(/^find/, function (next) {
//   this.select("-__v");
//   this.populate({
//     path: "agent",
//     select: "name phone _id",
//   });
//   next();
// });
// // adsSchema.pre('aggregate',async function(next){
// // await this.populate({
// //   path: "agent",
// //   select: "name phone -_id",

// // })
// // next()
// // })

// const Ads = mongoose.model("Ads", adsSchema);

module.exports = Ads;
