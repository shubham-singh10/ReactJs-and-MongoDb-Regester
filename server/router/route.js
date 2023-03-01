import { Router } from "express";


const router =Router();

/**import all controller API */
import * as controller from '../controllers/appController.js'
import Auth,{localVeriables} from '../middleware/auth.js'
import {registerMail} from '../controllers/mail.js'

//POST Methods
router.route('/register').post(controller.register);
router.route('/registerMail').post(registerMail); //send email
router.route('/authenticate').post(controller.verifyUser,(req,res) => res.end()); //authnticate user
router.route('/login').post(controller.verifyUser,controller.login); // login user


//GET Methods
router.route('/user/:username').get(controller.getUser)//user with username
router.route('/generateOTP').get(controller.verifyUser,localVeriables,controller.generateOTP)//generate otp
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP)// verify otp
router.route('/createResetSession').get(controller.createResetSession)


//PUT Methods
router.route('/updateuser').put(Auth,controller.updateUser)
router.route('/resetPassword').put(controller.verifyUser,controller.restPassword)

export default router;