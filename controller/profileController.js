const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { where } = require("sequelize");

exports.getMyProfile = catchAsync(async (req, res, next) => {
  // const user = await User.findByPk(req.user._id);
  // if (!user) return next(new AppError("User Not found", 404));
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});
exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword || req.body.phone)
    return next(new AppError("You Cant Update Password Or phone Here", 400));
  const user = await User.update(req.body, {
    where: { id: req.user.id },
    returning: [
      "id",
      "name",
      "phone",
      "role",
      "verified",
      "createdAt",
      "updatedAt",
      "photo",
    ],
  });
  console.log(user);
  //prevent
  if (!user) return next(new AppError("User Not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return next(new AppError("User Not found", 404));
  if (!req.body.newPassword)
    return next(new AppError("Password does not match ", 400));
  const checkOldPassword = await user.checkPassword(
    req.body.password,
    user.password
  );
  //   console.log(checkOldPassword);
  if (!checkOldPassword)
    return next(
      new AppError("Please make sure you typed The Correct Password")
    );
  if (req.body.newPassword === req.body.confirmPassword)
    user.passwordChangedAt = Date.now() - 1000;
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;

  await user.save();
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.deleteProfile = catchAsync(async (req, res, next) => {
  //we can implement await User.destroy({where: {id:req.user.id},}); Too
  const user = await User.update(
    { status: false },
    {
      where: {
        id: req.user.id,
      },
    }
  );
  if (!user) return next(new AppError("something went wrong", 401));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
