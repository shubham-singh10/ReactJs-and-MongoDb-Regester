import toast from 'react-hot-toast';
import { authnticate } from './helper';

/**Validate login page username */

export async function usernameValidate(values){
    const errors =usernameVerify({},values);

    if(values.username){
        //check user
        const {status}= await authnticate(values.username)

        if(status !==200){
            errors.exist= toast.error("User does not exist...")
        }
    }
    return errors;
}

/**Validate Password */
export async function passwordValidate(values){
    const errors=passwordVerify({},values);

    return errors;
}

/**Validate reset Password */

export async function restPasswordValidate(values){
    const errors=passwordVerify({},values)

    if(values.password !== values.confirm_pwd){
        errors.exit= toast.error("Password not match")
    }

    return errors
}

/**Validate Register */

export async function registerValidate(values){
    const errors= usernameVerify({},values);
    passwordVerify(errors,values);
    emailVerify(errors,values)

    return errors;

}

/**validate profile */
export async function profileValidate(values){
    const errors=emailVerify({},values);
    return errors;
}




/**Validate Password */
function passwordVerify(errors={},values){

    const specialChars = /[`!"#$%&'()*+,-./:;<=>?@[\]^_{|}~]/;

    if(!values.password){
        errors.password=toast.error("Password Required...")
    } else if(values.password.includes(" ")){
        errors.password=toast.error("Wrong Password...")
    }else if(values.password.length<4){
        errors.password=toast.error("Password must more than 4 characters long")
    }else if(!specialChars.test(values.password)){
        errors.password=toast.error("Password Must contain a Special character")
    }

    return errors
}

/**Validate username */
function usernameVerify(errors={},values){
    if(!values.username){
        errors.username=toast.error("Username Requied...!")
    }else if(values.username.includes(" ")){
        errors.username=toast.error("Invalid Username....!")
    }

    return errors;
}

/**email validate */
function emailVerify(error={},values){
    if(!values.email){
        error.email=toast.error("Email Required....")
    }else if(values.email.includes(" ")){
        error.email=toast.error("Wrong Email....")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email=toast.error("Invalid email address....")
    }
    return error;
}