import {
    USER_SIGNIN_START,
    USER_SIGNIN_SUCCESS,
    USER_SIGNIN_ERROR,
    FORGOT_PASSWORD_START,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    FORGOT_PASSWORD_OTP_START,
    FORGOT_PASSWORD_OTP_SUCCESS,
    FORGOT_PASSWORD_OTP_ERROR,
    RESET_PASSWORD_START,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
} from './index.actions';
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../../Config';
const fcmToken =  AsyncStorage.getItem('@fcmtoken')
export const signin = (phone, password, fcmtoken) => {
    return (dispatch) => {
        dispatch({ type: USER_SIGNIN_START })
        let formData = new FormData()
        formData.append('identity', '+91' + phone)
        formData.append('password', password)
        var otpUrl = `${API_URL}api-user/login`
        // var otpUrl = API_URL + '/api-user/login'
        const token = fcmToken ? fcmToken : '1111';
        return fetch(otpUrl, {
            method: 'Post',
            headers: {
                'Content-Type': 'multipart/form-data',
                device_id: '1234',
                device_token: token,
                device_type: 'android',
            },
            body: formData,
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.code == '200') {
                    dispatch({
                        type: USER_SIGNIN_SUCCESS,
                        payload: responseData
                    })
                    return Promise.resolve(responseData);
                } else {
                    dispatch({
                        type: USER_SIGNIN_ERROR,
                        payload: responseData
                    })
                    if (responseData.data.password) alert(responseData.data.password);
                    if (responseData.data.mobile) {
                        alert(responseData.data.mobile);
                    }
                    if (responseData.data.email) alert(responseData.data.email)
                    if (responseData.data.username) alert(responseData.data.username) 
                    return Promise.reject(responseData)                   
                }
            })
            .catch(error => {       
                console.log('error : ', error);
                dispatch({
                    type: USER_SIGNIN_ERROR,
                    payload: error
                })
                // return Promise.reject(error) 
            })
            .done()
    }
}

export const forgotPass = (phone) => {
    return (dispatch) => {
        dispatch({ type: FORGOT_PASSWORD_START })
    let formData = new FormData()
    formData.append('mobile', '+91' + phone)
    var otpUrl = `${API_URL}api-user/forgot-password`
    const token = fcmToken ? fcmToken : '1111';
   return fetch(otpUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token: token,
        device_type: 'android',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        
        if (responseData.code == '200') {
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: responseData
        })
        return Promise.resolve(responseData);
        } else {
            dispatch({
                type: FORGOT_PASSWORD_ERROR,
                payload: responseData
            })
          alert(responseData.data.mobile)
          return Promise.reject(responseData)         
        }
      })
      .catch(error => {
        // console.error(error)
        console.log('error : ', error);
        dispatch({
            type: FORGOT_PASSWORD_ERROR,
            payload: error
        })
      })

      .done()

   
    }
}


export const forgotPassOTp = (phone, otp) => {
    return (dispatch) => {
        dispatch({ type: FORGOT_PASSWORD_OTP_START })
        let formData = new FormData()

        formData.append('mobile', phone)
        formData.append('otp', otp)
    var otpUrl =`${API_URL}api-user/verify-otp`
    const token = fcmToken ? fcmToken : '1111';
   return fetch(otpUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token: token,
        device_type: 'android',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        
        if (responseData.code == '200') {
        dispatch({
            type: FORGOT_PASSWORD_OTP_SUCCESS,
            payload: responseData
        })
        return Promise.resolve(responseData);
        } else {
            dispatch({
                type: FORGOT_PASSWORD_OTP_ERROR,
                payload: responseData
            })
          alert(responseData.data.mobile)
          return Promise.reject(responseData)         
        }
      })
      .catch(error => {
        console.log('error : ', error);
        dispatch({
            type: FORGOT_PASSWORD_OTP_ERROR,
            payload: error
        })
      })

      .done()

   
    }
}


export const resetPass = (pass, otp) => {
    return (dispatch) => {
        dispatch({ type: RESET_PASSWORD_START })
        let formData = new FormData()
        formData.append('password', pass)
        formData.append('otp', otp)
    var otpUrl = `${API_URL}api-user/reset-password`
    const token = fcmToken ? fcmToken : '1111';
   return fetch(otpUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token: token,
        device_type: 'android',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.code == '200') {
            dispatch({
                type: RESET_PASSWORD_SUCCESS,
                payload: responseData
            })
            return Promise.resolve(responseData);
  
          } else {
            dispatch({
                type: RESET_PASSWORD_ERROR,
                payload: responseData
            })
            alert(responseData.data.password);
          return Promise.reject(responseData) 
  
          }
      })
      .catch(error => {
        console.log('error : ', error);
        dispatch({
            type: RESET_PASSWORD_ERROR,
            payload: error
        })
      })

      .done()

   
    }
}