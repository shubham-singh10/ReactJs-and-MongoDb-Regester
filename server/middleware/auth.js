import jwt from 'jsonwebtoken'
import ENV from '../config.js'

//auth middleware
export default async function Auth(req,res,next){
    try {

        //access authorize user
      const token=  req.headers.authorization.split(" ")[1];

      //retrive the user details
      const decodedtoken = await jwt.verify(token,ENV.JWT_SECRET)
      req.user = decodedtoken
      
      next()
        
    } catch (error) {
        res.status(401).json({error:"Authentication Failed!"})
    }
}


export function localVeriables(req,res,next){
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next()
}