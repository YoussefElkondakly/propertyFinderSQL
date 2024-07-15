const Sequelize = require("sequelize");
const sequelize = require("./../utils/database");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const User = sequelize.define("users", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Name is required",
      },
    },
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    // minlength: [11, "Please Type a Correct Phone Number"],
    // maxlength: [11, "Please Type a Correct Phone Number"],

    validate: {
      notNull: {
        msg: "Phone is required",
      },
      isMobilePhone(val) {
        if (
          !validator.isMobilePhone(val, ["ar-EG"], {
            strictMode: true,
          })
        )
          throw new Error("Wrong Phone Number");
      },
      // msg: "Please Type a Correct Phone Number",
    },
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "client",
    validate: {
      notNull: {
        msg: "Phone is required",
      },
      isIn: {
        args: [["client", "agent"]],
        msg: "The Roles Must Be Either Client or Agent",
      },
    },
  },
  photo: Sequelize.STRING,
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    // minLength: [8, "The Password Field Must Be at Least 8 Characters"],
    validate: {
      notNull: {
        msg: "Password is required",
      },
      min: {
        args: 8,
        msg: "The Password Field Must Be at Least 8 Characters",
      },
    },
  },
  confirmPassword: {
    type: Sequelize.STRING,
    validate: {
      confirmed(value) {
        if (value !== this.password) {
          value = null;
          throw new Error("The Passwords Do Not Match");
        }
      },
    },
  },

  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  status:{
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  passwordChangedAt: Sequelize.DATE,
  passwordResetToken: Sequelize.STRING,
  passwordResetExpires: Sequelize.DATE,
  verifyUserToken: Sequelize.STRING,

});
User.prototype.checkChangedPassword = function (jwtIat) {
  //Here we can use This
  if (this.passwordChangedAt) {
    const changedPasswordTime = this.passwordChangedAt.getTime() / 1000;
    return jwtIat < changedPasswordTime;
  }
  return false;
};
User.prototype.createToken = function (type) {
  if (type === "reset") {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256") //
      .update(resetToken) //
      .digest("hex"); //
    // console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
  if (type === "verify") {
    const verifyToken = crypto.randomBytes(32).toString("hex");
    this.verifyUserToken = crypto
      .createHash("sha256") //
      .update(verifyToken) //
      .digest("hex");
    //

    return verifyToken;
  }
};

User.prototype.checkPassword = async function (givenPass, documentPass) {
  console.log(this);
  return await bcrypt.compare(givenPass, documentPass);
};

User.addHook(
  "beforeUpdate",
  "beforeCreate",
  async function (user, options, next) {
    user.password = await bcrypt.hash(user.password, 12);
    user.confirmPassword = null;
  }
);
module.exports = User;
/*-----------------FINISHED

// userSchema.methods.checkPassword = async function (givenPass, documentPass) {
  //   console.log(this);
  //   return await bcrypt.compare(givenPass, documentPass);
  // };
  // console.log(user)
  // console.log(!user.changed("password"));
  // if (!user.changed("password"))throw new Error("ojj");
  // next();
  userSchema.pre("save", async function (next) {
    console.log(!this.isModified("password"));
    if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
*/
// userSchema.pre("save", function (next) {
//   console.log(!this.isModified("password") || this.isNew);
//   if (!this.isModified("password") || this.isNew) return next();
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

/**FINISHED** 
   userSchema.methods.createToken = function (type) {
    if (type === "reset") {
      const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash("sha256") //
    .update(resetToken) //
    .digest("hex"); //
    // console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
  }
  if (type === "verify") {
    const verifyToken = crypto.randomBytes(32).toString("hex");
    this.verifyUserToken = crypto
    .createHash("sha256") //
    .update(verifyToken) //
      .digest("hex");
      //
      
    return verifyToken;
  }
};*/

/**FINISHED**
userSchema.methods.checkChangedPassword = function (jwtIat) {
  // console.log("Hi");
  if (this.passwordChangedAt) {
    const changedPasswordTime = this.passwordChangedAt.getTime() / 1000;
    // console.log(changedPasswordTime, jwtIat);
    // console.log(jwtIat < changedPasswordTime);
    return jwtIat < changedPasswordTime;
  }
  return false;
}; */
