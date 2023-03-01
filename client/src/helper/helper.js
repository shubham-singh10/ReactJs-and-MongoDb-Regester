import axios from 'axios'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL= process.env.REACT_APP_SERVER_DOMAIN

// Make API Request

//To get username from token
export async function getUsername(){
    const token=localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find token")
    let decode=jwt_decode(token)
    return decode
}

//Authnticate function

export async function authnticate(username){
    try{
        return await axios.post("/api/authenticate",{username})
    }catch(error){
        return {error:"Username doesn't exist...."}
    }
}

//get user details

export async function getUser({username}){
    try {
        const {data}= await axios.get(`/api/user/${username}`)
        return {data};
    } catch (error) {
        return {error:"Password doesn't Match...."}
    }
}

//Register function

export async function registerUser(credential){
    try {
       const {data:{msg},status}= await axios.post(`/api/register`,credential)

       let {username,email}= credential;

       //Send Email
       if(status === 201){
        await axios.post(`/api/registerMail`,{username,userEmail:email,text:msg})
       }

       return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({error})
    }
}

//Login Function
export async function verifyPassword({username,password}){
    try {
        if(username){
           const {data}= await axios.post(`/api/login`,{username,password})
           return Promise.resolve({data})
        }
        
    } catch (error) {
        return Promise.reject({error:"Password doesn't match...."})
    }
}


//Update USer function

export async function updateUser(response){
    try {
      const token= await localStorage.getItem('token')
      const data=  await axios.put('/api/updateuser',response,{headers:{"Authorization":`Bearer ${token}`}})
      return Promise.resolve({data})

    } catch (error) {
        return Promise.reject({error:"Couldn't Update Profile....!"})
    }
    
}

//Generate OTP

export async function GenerateOTP(username){
    try {
        const {data:{code},status}= await axios.get('/api/generateOTP',{params:{username}})
        
        //Send OTP in mail
        if(status === 201){
           let {data:{email}}= await getUser({username})
           let text=`Your Password Recovery OTP is ${code}. Verify and recover your password`
           await axios.post('/api/registerMail',{username,userEmail:email,text,subject:"Password Recovery OTP"})

        }
        return Promise.resolve(code)
    } catch (error) {
        return Promise.reject({error})
    }
}

//Verify Otp

export async function verifyOTP({username,code}){
    try {
      const {data,status} = await axios("/api/verifyOTP",{params:{username,code}})
      return {data,status}
    } catch (error) {
        return Promise.reject(error)
    }
}

//Rest Pasword
export async function resetpassword({username,password}){
    try {
        const {data,status}= await axios.put('/api/resetPassword',{username,password})
        return Promise.resolve({data,status})
    } catch (error) {
        return Promise.reject({error})
    }
}