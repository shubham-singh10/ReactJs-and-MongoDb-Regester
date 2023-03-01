import UserModel from "../model/User.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenerator from 'otp-generator'

/**Middle ware for verify the user */
export async function verifyUser(req,res,next){
    try{
        const{username}=req.method == "GET" ? req.query:req.body;

        //check the user
        let exist = await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error:"Can't find User!"})
        next()
    } catch(error){
        return res.status(404).send({error:"Authentication Error"})
    }
}

export async function register(req,res){
    
    try{
        const {username,password,profile,email}=req.body;

        //check the existing user
        const exitUsername=new Promise((resolve,reject)=>{
            UserModel.findOne({username},function(err,user){
                if(err) reject(new Error(err))
                if(user) reject({error: "Please use unique username"});

                resolve();
            })
        });

        //check the email
        const exitemail=new Promise((resolve,reject)=>{
            UserModel.findOne({email},function(err,email){
                if(err) reject(new Error(err))
                if(email) reject({error: "Please use unique email"});

                resolve();
            })
        });

        Promise.all([exitUsername,exitemail])
        .then(()=>{
            if(password){
                bcrypt.hash(password,10)
                .then(hashedPassword =>{

                    const user= new UserModel({
                        username,
                        password:hashedPassword,
                        profile:profile || '',
                        email
                    })

                    //return save result
                    user.save()
                    .then(result => res.status(201).send({msg:"User Register Successfull"}))
                    .catch(error => res.status(500).send({error}))

                }).catch(error =>{
                    return res.status(500).send({
                        error:"Enab;e to hashed password"
                    })
                })
            }

        }).catch(error =>{
            return res.status(500).send({
                error
            })
        })

    }catch(error){
        return res.status(500).send(error);
    }
}



export async function login(req,res){
   const {username,password}= req.body;

   try{
    UserModel.findOne({username})
    .then(user =>{
        bcrypt.compare(password, user.password)
        .then(passwordCheck =>{
            if(!passwordCheck) return res.status(400).send({error:"Don't have password"})

            //Create jwt token
          const token=  jwt.sign({
                userId:user._id,
                username:user.username
            },ENV.JWT_SECRET,{expiresIn:'24h'});

            return res.status(200).send({
                msg:"Login Successful",
                username:user.username,
                token
            })
        })
        .catch(error=>{
            return res.status(400).send({error:"Password doesnot found"})
        })
    })
    .catch(error =>{
        return res.status(404).send({error:"Username not found"});
    })

   } catch(error){
    return res.status(500).send({error});
   }
}


export async function getUser(req,res){
    
    const {username}=req.params;

    try{
        if(!username) return res.status(501).send("Invalid Username")

        UserModel.findOne({username},function(err,user){
            if(err) return res.status(500).send({err});
            if(!user) return res.status(501).send({error:"Couldn't Find the User"})

            const {password,...rest}=Object.assign({},user.toJSON());

            return res.status(201).send(rest)
        })

    }catch(error){
        res.status(404).send({error:"Cannot find User Data"})
    }
}



export async function updateUser(req,res){
    try {
        // const id= req.query.id;
        const {userId}=req.user

        if(userId){
            const body = req.body;

            //update the user data
            UserModel.updateOne({_id:userId},body,function(err,data){
                if(err) throw err;

                return res.status(201).send({msg:"Record Update....!"})
            })
        }else{
            return res.status(401).send({error:"User Not Found...."})
        }
    } catch (error) {
        return res.status(500).send({error})
    }
}




export async function generateOTP(req,res){
   
   req.app.locals.OTP =await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
   res.status(201).send({code: req.app.locals.OTP})
}
    


export async function verifyOTP(req,res){
    const {code}= req.query;
    if(parseInt(req.app.locals.OTP)===parseInt(code)){
        req.app.locals.OTP=null; //reset the OTP Values
        req.app.locals.resetSession =true;// store session for reset password
        return res.status(201).send({msg:"verify Successfull"})
    }
    return res.status(400).send({error:"Invalid OTP"})
}



export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
        return res.status(201).send({flag:req.app.locals.resetSession})
    }
    return res.app.status(440).send({error:"Session Expired"})
}



export async function restPassword(req,res){
    try{
        if(!req.app.locals.resetSession) return res.status(400).send({error:"Session Expired...."});

        const{username,password}=req.body;
        try{
            UserModel.findOne({username})
            .then(user=>{
                bcrypt.hash(password,10)
                .then(hashedPassword=>{
                    UserModel.updateOne({username:user.username},
                        {password:hashedPassword},function(err,data){
                            if(err) throw err;
                            req.app.locals.resetSession=false;
                            return res.status(201).send({mdg:"Record Updated....!"})
                        })
                })
                .catch(e=>{
                    return res.status(500).send({
                        error:"Enable hashed Password"
                    })
                })
            })
            .catch(error =>{
                return res.status(404).send({error:"Username not found"})
            })

        }catch(error){
            return res.status(500).send({error})
        }

    }catch(error){
        return res.status(401).send({error})
    }
}

