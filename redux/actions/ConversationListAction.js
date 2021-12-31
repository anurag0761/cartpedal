import {CONVERSION_LIST_START,CONVERSION_LIST_SUCCESS,CONVERSION_LIST_ERROR  } from './index.actions';
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../../Config';
const fcmToken =  AsyncStorage.getItem('@fcmtoken');

export const ConversationListAction=(userID,type,toid,userAccessToken)=>{
    return(dispatch)=>{
        dispatch({type:CONVERSION_LIST_START})
        let formData = new FormData();
        formData.append('user_id', userID);
        formData.append('toid',toid);
        formData.append('type',type)
        formData.append('msg_type', '0');
        const token = fcmToken ? fcmToken : '1111';
        fetch(`${API_URL}api-message/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token: token,
        device_type: 'android',
        Authorization: JSON.parse(userAccessToken),
      },
      body: formData,   
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
            console.log('fom action file',responseData);
        //   this.setState({chatList: responseData.data, ischatList: true});
        //   this.state.chatList.messages.map(function (v, i) {
        //     if (v.fattach !== null) {
        //       // console.log('asdas', v.fattach.attach);
        //     }
        //   });
        dispatch({
            type: CONVERSION_LIST_SUCCESS,
            payload: responseData.data
        })
        return Promise.resolve(responseData.data);
        } else {
          // alert(responseData.data);
          console.log('logged user stories' + JSON.stringify(responseData));
          dispatch({
            type: CONVERSION_LIST_ERROR,
            payload: responseData
        })
      return Promise.reject(responseData) 
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch({
            type: CONVERSION_LIST_ERROR,
            payload: error
        })
      });
    }
}