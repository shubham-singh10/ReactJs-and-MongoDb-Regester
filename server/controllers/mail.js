import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import ENV from '../config.js'


//https://ethereal.email/create

let nodeConfig={
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: ENV.EMAIL, // generated ethereal user
      pass: ENV.Password, // generated ethereal password
    },
}

let transpoter=nodemailer.createTransport(nodeConfig);

let MailGenerator=new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:"https://mailgen.js/"
    }
})

export const registerMail= async(req,res)=>{
    const{username,userEmail,text,subject}=req.body;

    //Body of Email
    var email={
        body:{
            name:username,
            intro:text|| 'Welcome to Test Account! We\'re very excited to start journey with you. Happy Learning.',
            outro:"Need help,or have questions? Just reply to this email."
        }
    }
        var emailbody=MailGenerator.generate(email)

        let message={
            from:ENV.EMAIL,
            to:userEmail,
            subject:subject || "Signup Succesfull",
            html:emailbody
        }

        //send mail
        transpoter.sendMail(message)
        .then(()=>{
            return res.status(200).send({msg:"You should receive an email from us"})
        })
        .catch(error=> res.status(500).send({error}))
    }
