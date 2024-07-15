const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const sendEmail = require("./../utils/mailSender");
const createHashedToken = function (urlToken) {
  return crypto.createHash("sha256").update(urlToken).digest("hex");
};
const createMailToken = async function (user, request, type) {
  const verifycode = user.createToken(type);
  await user.save();

  const verifyURL = `${request.protocol}://${request.get(
    "host"
  )}/auth/verifyaccount/${verifycode}`;
  const message = `your Verification Link is: ${verifyURL}`;
  try {
    await sendEmail({
      email: "toto2013elkondkly92@gmail.com",
      subject: `Verify Account`,
      message,
    });
  } catch (err) {
    if (type === "reset") {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
    } else user.verifyUserToken = undefined;
    user.save();
    return new AppError(
      "There was an error sending the verification email. Please try again later",
      500
    );
  }
};
const sendJsonResponseToken = function (
  data,
  status,
  res,
  message = undefined
) {
  //remember to change the data
  // console.log(data);
  const token = jwt.sign({ data }, process.env.JWT_SECURE, {
    expiresIn: process.env.JWT_DURATION,
  });

  res.status(status).json({
    status: "success",
    token,
    message,
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !(req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return next(new AppError("You are Not Logged in please log in", 400));
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token === "null")
    return next(new AppError("You are Not Logged In Please Login", 400));

  const data = await jwt.verify(token, process.env.JWT_SECURE);
  //  console.log(data)
  //here you will compare the TS of The TOKEN with The TS of PasswordChanged at
  const id = data.data;
  const uuser = await User.findByPk(id,{
    attributes: ['id', 'name', 'phone', 'role', 'verified', 'createdAt','updatedAt','photo']
  });
  const user = uuser.dataValues;
  // console.log(user)
  if (!user) return next(new AppError("User not found", 400));
  if (uuser.checkChangedPassword(data.iat))
    return next(
      new AppError(
        "It seemed That You changed The Password After logging in please login again"
      )
    );
  req.user = user;
  //اوحش تسمية فالتاريخ البرمجي 😶🙄
  req.youser=uuser
  next();
});
/**************************************************************/
exports.accessManager = function (role) {
  return function (req, res, next) {
    if (!(req.user.role === role))
      return next(
        new AppError("You are not allowed to access this route", 400)
      );
    next();
  };
};
exports.isVerified = (req, res, next) => {
  if (!req.user.verified)
    return next(
      new AppError("You Cant make any Ad unless Your account Be Verified")
    );
  next();
};
/**************************************************************/

exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body.phone.includes("+2")) req.body.phone = "+2" + req.body.phone;
  const newUser = await User.create({
    name: req.body.name,
    phone: req.body.phone,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  if (!newUser) return next(new AppError("problem", 404));
  console.log(newUser);

  await createMailToken(newUser, req, "verify");
  let message;
  //her implementing send Verification Email
  sendJsonResponseToken(newUser.id, 201, res, message);
});
//find && findOne
exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.phone.includes("+2")) req.body.phone = "+2" + req.body.phone;
  // console.log(req.body.phone)
  if (!req.body.password)
    return next(new AppError("Please Provide the password filed", 404));
  const user = await User.findAll({
    where: {
      phone: req.body.phone,
    },
  });
  // console.dir(user)
  if (!user[0]) return next(new AppError("Incorrect Phone Or Password", 404));
  // console.dir(user);
  const checkPassword = await user[0].checkPassword(
    req.body.password,
    user[0].password
  );
  if (!checkPassword)
    return next(new AppError("Incorrect Phone Or Password", 404));
  sendJsonResponseToken(user[0].id, 201, res);
});
exports.verifyAccount = catchAsync(async (req, res, next) => {
  const receivedToken = req.params.verificationcode;
  const userToken = createHashedToken(receivedToken);
  const user = await User.findAll({
    where: {
      verifyUserToken: userToken,
    },
  });
  console.log(user);
  if (!user[0]) return next(new AppError("User not found ", 400));
  if (user[0].verified) return next(new AppError("User already verified", 400));
  user[0].verified = true;
  user[0].verifyUserToken = null;
  await user[0].save();

  res.status(200).json({
    status: "success",
    message: "user has Been Verified please login",
  });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findAll({ where: { phone: req.body.phone } });
  if (!user) return next(new AppError("User not found", 404));
  await createMailToken(user[0], req, "reset");

  res.status(201).json({
    status: "success",
    message: "Token sent to your email please check your email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const receivedToken = req.params.code;
  const userToken = createHashedToken(receivedToken);
  const user = await User.findAll({
    where: {
      passwordResetToken: userToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });
  if (!user[0]) return next(new AppError("User not found ", 404));
  if (!(user[0].passwordResetExpires.getTime() > Date.now()))
    return next(
      new AppError(
        "Password Reset Token Has Expired please send another request",
        400
      )
    ); //send error
  user[0].password = req.body.password;
  user[0].confirmPassword = req.body.confirmPassword;
  user[0].passwordResetToken = null;
  user[0].passwordResetExpires = null;
  user[0].passwordChangedAt = Date.now() - 1000;
  await user[0].save();

  res.status(201).json({
    status: "success",
    message: "Password Rested Successfully please login",
  });
});

exports.logout = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
};
