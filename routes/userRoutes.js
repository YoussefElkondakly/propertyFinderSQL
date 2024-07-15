const express =require('express');
const authController=require('./../controller/authController')
const profileController=require('../controller/profileController')
const router = express.Router()
router.use(authController.protect)
router.get("/logout", authController.logout);
//managing all the auth routes 
router.get('/myprofile',profileController.getMyProfile)
router.patch('/updateProfile',profileController.updateProfile)
router.patch('/updatePassword',profileController.updatePassword)
router.delete("/deleteProfile", profileController.deleteProfile);
module.exports = router