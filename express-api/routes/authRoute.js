const express = require("express")
const { postUser, postEmailConfirmation, signIn, forgetPassword, resetPassword, userList, userDetails, requireAdmin } = require("../controller/authController")
const router = express.Router();

router.post("/register", postUser)
router.put('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/forget/password',forgetPassword)
router.post('/reset/password/:token',resetPassword)
router.get('/user/list',requireAdmin, userList)
router.get('/user/details/:id',userDetails)

module.exports = router
