import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL=process.env.REACT_APP_SERVER_DOMAIN;

//customerhook
export default function useFetch(query){
   const [getdata,setgeta]= useState({isLoading:false,apiData:undefined,staus:null,serverError:null})

   useEffect(()=>{

    const fetchData= async()=>{
        try{
            setgeta(prev=> ({...prev,isLoading:true}))
            const {username}=!query ? await getUsername():''
            const {data,status}=!query ?await axios.get(`/api/user/${username}`): await axios.get(`/api/${query}`)

            if(status === 201){
                setgeta(prev=> ({...prev,isLoading:false,apiData:data,staus:status}))
            }
            setgeta(prev=> ({...prev,isLoading:false}))

        }catch(error){
            setgeta(prev=>({...prev,isLoading:false}))
            setgeta(prev=>({...prev,serverError:error}))
        }
    }
    fetchData()

   },[query])

   return[getdata,setgeta]
}