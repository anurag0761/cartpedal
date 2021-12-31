import {
    PROFILE_VIEW_START, PROFILE_VIEW_SUCCESS, PROFILE_VIEW_ERROR
} from './index.actions';
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../../Config';
const fcmToken =  AsyncStorage.getItem('@fcmtoken')



export const profileView = (userId, userAccessToken) => {
    return (dispatch) => {
        dispatch({ type: PROFILE_VIEW_START })
        var urlprofile = `${API_URL}api-user/view-profile?user_id=` + userId
    const token = fcmToken ? fcmToken : '1111';
   return  fetch(urlprofile, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      device_id: '1234',
      device_token: fcmToken,
      device_type: 'android',
      Authorization: JSON.parse(userAccessToken),
    },
  })
      .then(response => response.json())
      .then(responseData => {
        
        if (responseData.code == '200') {
        dispatch({
            type: PROFILE_VIEW_SUCCESS,
            payload: responseData
        })
        AsyncStorage.setItem('@current_usermobile',JSON.stringify(responseData.data.mobile));
        return Promise.resolve(responseData);
        } else {
            dispatch({
                type: PROFILE_VIEW_ERROR,
                payload: responseData
            })
          return Promise.reject(responseData)         
        }
      })
      .catch(error => {
        console.log('error : ', error);
        dispatch({
            type: PROFILE_VIEW_ERROR,
            payload: error
        })
      })

      .done()

   
    }
}