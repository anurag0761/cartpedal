import { USER_SIGNUP_START, USER_SIGNUP_SUCCESS, USER_SIGNUP_ERROR, 
    USER_SIGNUP_CONF_START,
    USER_SIGNUP_CONF_SUCCESS,
    USER_SIGNUP_CONF_ERROR
} from './index.actions';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../../Config';
import _ from 'lodash'
const fcmToken =  AsyncStorage.getItem('@fcmtoken')

export const signUp = (phone) => {
    return (dispatch) => {
        dispatch({ type: USER_SIGNUP_START })
        let formData = new FormData()
        formData.append('mobile', '+91' + phone)
        var otpUrl = `${API_URL }api-user/send-otp`
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
                        type: USER_SIGNUP_SUCCESS,
                        payload: responseData
                    })
                    return Promise.resolve(responseData);
                } else {
                    dispatch({
                        type: USER_SIGNUP_ERROR,
                        payload: responseData
                    })
                    alert(JSON.stringify(responseData.data))
                    return Promise.reject(responseData)                   
                }
            })
            .catch(error => {       
                console.log('error : ', error);
                dispatch({
                    type: USER_SIGNUP_ERROR,
                    payload: error
                })
                // return Promise.reject(error) 
            })
            .done()
    }
}


export const signUpConf = (name, phone, email, pass) => {
    return (dispatch) => {
        dispatch({ type: USER_SIGNUP_CONF_START })
        let formData = new FormData();
        formData.append('name', name)
        formData.append('mobile', phone)
        formData.append('email', email)
        formData.append('password', pass)
    
        var otpUrl = `${API_URL }api-user/signup`
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
                    // this.SignupORNot();
                    console.log(responseData);
                    // let access_token='Bearer '+responseData.data.access_token
                    // AsyncStorage.setItem('@access_token',JSON.stringify(access_token)).then(succ=>{
                    //   AsyncStorage.setItem('@user_id',JSON.stringify(responseData.data.userid)).then(success=>{
                    //     // this.props.navigation.navigate('DashBoardScreen');
                    //   })
                    // });
                    dispatch({
                        type: USER_SIGNUP_CONF_SUCCESS,
                        payload: responseData
                    })
                    return Promise.resolve(responseData);
                  } else if(responseData.code=='500'){
                    if(responseData.data.password) alert(responseData.data.password);
                    if(responseData.data.mobile){
                      alert(responseData.data.mobile);
                    }
                    if(responseData.data.email) alert(responseData.data.email)
                    if(responseData.data.username) alert(responseData.data.username)
                    dispatch({
                        type: USER_SIGNUP_CONF_ERROR,
                        payload: responseData
                    })
                    return Promise.reject(responseData)     
                  }
                  else {
                    dispatch({
                        type: USER_SIGNUP_CONF_ERROR,
                        payload: responseData
                    })
                    return Promise.reject(responseData)  
                  }
            })
            .catch(error => {       
                console.log('error : ', error);
                dispatch({
                    type: USER_SIGNUP_CONF_ERROR,
                    payload: error
                })
                // return Promise.reject(error) 
            })
            .done()
    }
}