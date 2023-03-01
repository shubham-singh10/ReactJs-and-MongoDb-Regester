import React, { useEffect } from 'react'
import {toast, Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import {restPasswordValidate} from '../helper/validate'

import styles from '../styles/Username.module.css';
import { resetpassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import { useNavigate,Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';

export default function Reset() {
const navigate=useNavigate()
const [{isLoading,apiData,status,serverError}]= useFetch('createResetSession')

  const {username}=useAuthStore(state=>state.auth)
  const formik =useFormik({
    initialValues:{
      password:'admin@123',
      confirm_pwd:'admin@123'
    },
    validate: restPasswordValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async values =>{
     let resetPromise= resetpassword({username,password:values.password})
      toast.promise(resetPromise,{
        loading:"Updating....",
        success:<b>Reset Successfully.....</b>,
        error:<b>Could not Reset!</b>
      })
      resetPromise.then(function(){navigate('/password')})
    }
  })
  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-2xl text-red-500'>{serverError.message}</h1>
  if(status && status !==201) return <Navigate to={'/password'} replace={true}> </Navigate>


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{width:"50%"}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter New Password
            </span>
          </div>

          <form className='py-20' onSubmit={formik.handleSubmit} >
             

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password' />
                  <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="text" placeholder='Confirm Password' />
                  <button className={styles.btn} type='submit'>Reset</button>
              </div>

            

          </form>

        </div>
      </div>
    </div>
  )
}
