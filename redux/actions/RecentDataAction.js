import {
    GET_RECENT_START,
    GET_RECENT_SUCCESS,
    GET_RECENT_ERROR,
    GET_RECENT_UPDATE_PROPS
} from './index.actions';
import _ from 'lodash'
import { API_URL } from '../../Config';
import AsyncStorage from '@react-native-community/async-storage';
const fcmToken = AsyncStorage.getItem('@fcmtoken');

export const RecentDataAction = (userId,userAccessToken,newContacts)=> {
    return(dispatch) =>{
        dispatch({ type: GET_RECENT_START })
    let formData = new FormData()
    formData.append('user_id',userId)
    formData.append('type', 0)
    formData.append('public',0)
    formData.append('contact',newContacts)
    console.log('api from redux==' + JSON.stringify(userId,userAccessToken,newContacts))
    var RecentShare = `${API_URL}api-user/recent-share`
    const token = fcmToken ? fcmToken : '1111';
    fetch(RecentShare, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: token,
        device_type: 'android',
        Authorization: JSON.parse(userAccessToken), 
      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.code == '200') {
          console.log('redux api data',responseData);
            dispatch({
                type: GET_RECENT_SUCCESS,
                payload: responseData.data
            });
            return Promise.resolve(responseData.data);
        } else {
            dispatch({
                type: GET_RECENT_ERROR,
                payload: responseData
            })
            return Promise.reject(responseData)
        }
      })
      .catch(error => {
        console.log('error : ', error);
        dispatch({
            type: GET_RECENT_ERROR,
            payload: error
        })
        // return Promise.reject(error);
      })
      .done();
    }
  }