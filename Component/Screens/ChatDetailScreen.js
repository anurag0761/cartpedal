import React from 'react';
import {Container, Icon, View} from 'native-base';
import {
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  Animated,
  PermissionsAndroid,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput} from 'react-native-gesture-handler';
import DocumentPicker from 'react-native-document-picker';
// import PushNotification from 'react-native-push-notification';
import firebase from 'react-native-firebase';
import VideoPlayer from 'react-native-video-player';
import ImagePicker from 'react-native-image-crop-picker';
// import ImageCropPicker from 'react-native-image-crop-pick2er';
import resp from 'rn-responsive-font';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {DocumentDirectoryPath, readFile} from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import ImageModal from 'react-native-image-modal';
import Menu, {MenuItem} from 'react-native-material-menu';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {connect} from 'react-redux';
import {ConversationListAction} from '../../redux/actions';
import _ from 'lodash';
// import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
const audioRecorderPlayer = new AudioRecorderPlayer();
import {BASE_URL} from '../Component/ApiClient';
import {MessageComponent} from '../Component/MessageComponent';
import {
  locationPermission,
  recordingPermissions,
} from '../Component/Permissions';

// import firebase from 'react-native-firebase';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
var firebasemsg;
var isMsg = false;
var ModalState = false;

class ChatDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 40,
      open: false,
      message: '',
      chatList: {messages: []},
      ischatList: false,
      fcmToken: '',
      imageshow:true,
      getNotify: '',
      firebaseMsg: '',
      isNotify: false,
      deletemodal:false,
      recievedmsg: '',
      recording: false,
      forwardMessageIds: [],
      userAccessToken:'',
      selectedMode: false,
      copyTexts: [],
      replyMessage:'',
      userId:'',
      showfilerply:false,
      page: 1,
      imageView:'',
      editMode:true,
      caption:'',
      recordStart:true,
      borderval:false,
      lengthMesaage:'',
      showRelymsg:false,
      showEveryone:false,
      showimagerply:false,
      showaudiorply:false,
      showvideorply:false,
      showcontactrply:false,
      showlocationmsg:false
    };
    console.log('ttt', JSON.stringify(this.props));
  }

  toggleSelectedMode = () => {
    this.setState((p) => ({
      ...p,
      selectedMode: !p.selectedMode,
      forwardMessageIds: [],
    }));
  };

  appendMessages = (messageId) => {
    this.setState((p) => ({
      ...p,
      forwardMessageIds: [...p.forwardMessageIds, messageId],
    }));
  };

  removeMessages = async (messageId) => {
    await this.setState((p) => ({
      ...p,
      forwardMessageIds: p.forwardMessageIds.filter((i) => i !== messageId),
      copyTexts: p.copyTexts.filter((i) => i.id !== messageId),
    }));
    if (this.state.forwardMessageIds.length === 0) {
      this.setState({selectedMode: false});
    }
  };

  copyText = ({id, text}) => {
    console.log({id,text});
    this.setState((p) => ({...p, copyTexts: [...p.copyTexts, {id, text}]}));
  };
  replyTo = ( text) => {
    console.log('reply message');
    console.log(text);
    if(this.props.route.params.msg_type=="1" && text.text.tname==""){
      this.setState({showEveryone:true})
    }else{
      if(text.text.fmsg!="") this.setState({showEveryone:true})
      
    }
    
    this.setState({replyMessage:text});
  };

  copyToClipboard = () => {
    let message = '';
    let count = 0;
    this.state.copyTexts.map((i) => {
      message = message + '\n' + i.text;
      count = count + 1;
    });
    Toast.show(`${count} messages copied`, 2000);
    Clipboard.setString(message);
    this.setState({
      selectedMode: false,
      forwardMessageIds: [],
      copyTexts: [],
    });
  };

  componentDidMount = () => {
    // this.focusListener = this.props.navigation.addListener("focus", () => {
      this.requestCameraPermission();
    let test;
    var _this = this;
    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
        this.setState({userId: userId});
        console.log('Edit user id Dhasbord ====' + this.state.userId);
      }
    });
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      console.log('Edit user id token=' + token);
      if (token) {
        this.setState({fcmToken: token});
        this.convertEmoji('128522')
      }
    });
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        this.setState({userAccessToken: accessToken});
        console.log('Edit access token ====' + accessToken);
        this.getConversationList();
      }
    });
    AsyncStorage.getItem('@Phonecontacts').then((mobile) => {
      if (mobile) {
        this.setState({PhoneNumber: JSON.parse(mobile)});
      }
    });
    console.log('props of group ',this.props.route.params.groupexit);
  // });
  };

  // componentDidUpdate = () => {
 
  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       //process token
  //     },
  //     onNotification: function (notification) {
  //       console.log('Asd', notification.message);
  //       this.getConversationList();
  //       console.log('Asd', notification.message);
  //       isMsg = true;
  //       firebasemsg = notification.message;
  //       this.setState({firebaseMsg: JSON.parse(notification.message)});
  //       this.setState({recievedmsg: this.state.firebaseMsg.msg});
  //     }.bind(this),
  //   });

  //   console.log('sss', this.state.recievedmsg);
    
  // };
  componentWillReceiveProps(nextProps){
    let equalArray=_.isEqual(this.props.conversationData,nextProps.conversationData);
    if(!equalArray){
      this.setState({chatList:nextProps.conversationData});
    }
  }
componentDidUpdate(){
  if(this.props.conversationSuccess && this.state.callUpdate){
  this.setState({callUpdate:false},()=>{
    this.setState({chatList:this.props.conversationData, ischatList: true});
    console.log('conversation data',this.props.conversationData);
  })
  }

}
  getConversationList = () => {
    this.setState({callUpdate:true},()=>{
      this.props.ConversationListAction(this.state.userId,this.props.route.params.msg_type,this.props.route.params.userid,this.state.userAccessToken);
    })
   
    // let type;
    // let formData = new FormData();
    // console.log('group value',this.props.route.params.msg_type);
    //  if(this.props.route.params.msg_type=="0"){
    //    type="0"
    //  }else{
    //    console.log('working');
    //    type="1"
    //  }
    //  console.log('value of type',type);
    // formData.append('user_id', this.state.userId);
    // formData.append('toid',this.props.route.params.userid);
    // formData.append('type',this.props.route.params.msg_type)
    // formData.append('msg_type', '0');
    // // formData.append('page', this.state.page);
    // console.log('form data',JSON.stringify(formData));

    // fetch('https://www.cartpedal.com/api-message/conversation', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     device_id: '1234',
    //     device_token: this.state.fcmToken,
    //     device_type: 'android',
    //     Authorization: JSON.parse(this.state.userAccessToken),
    //   },
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     if (responseData.code == '200') {
    //       this.setState({chatList: responseData.data, ischatList: true});
    //       this.state.chatList.messages.map(function (v, i) {
    //         if (v.fattach !== null) {
    //           // console.log('asdas', v.fattach.attach);
    //         }
    //       });
    //     } else {
    //       // alert(responseData.data);
    //       this.setState({chatList:''});

    //       console.log('logged user stories' + JSON.stringify(responseData));
    //     }
    //     console.log('logged user stories' + JSON.stringify(responseData));
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  sendMessage = () => {
    let replyID='0';
    let msg_type='text'
    
    if(this.state.showRelymsg==true && this.state.replyMessage!=''){
      if(this.state.replyMessage.text.fmsg|| this.state.replyMessage.text.tmsg){
        replyID=this.state.replyMessage.text.id;
      }
    }
    if(this.state.showimagerply==true && this.state.replyMessage!=''){
        replyID=this.state.replyMessage.text.id;
    }
    if(this.state.showaudiorply==true  && this.state.replyMessage!=''){
      replyID=this.state.replyMessage.text.id;
    }
    if(this.state.showlocationmsg==true  && this.state.replyMessage!=''){
      replyID=this.state.replyMessage.text.id;
    }
    if(this.state.showfilerply==true  && this.state.replyMessage!=''){
      replyID=this.state.replyMessage.text.id;
    }
    if(this.state.showcontactrply==true  && this.state.replyMessage!=''){
      replyID=this.state.replyMessage.text.id;
    }
    if(this.state.showvideorply==true  && this.state.replyMessage!=''){
      replyID=this.state.replyMessage.text.id;
    }
    let type;
    console.log('group id',this.props.route.params.msg_type)
    if(this.props.route.params.msg_type==0){
      console
      type="0"
    }else{
      type="1"
    }
    this.setState({message: '', height: 40});
    const messageToSent = {
      ...newMessage,
      msg_type: msg_type,
      fmsg: this.state.message,
      time: moment().format('hh:mm'),
    };
    console.log('message',messageToSent);
    if(this.state.ischatList&& this.state.chatList.messages.length>0){
    this.setState((p) => ({
      chatList: {
        ...p.chatList,
        messages: [...p.chatList.messages, messageToSent],
      },
      ischatList: true,
    }));
  }else{
    this.setState((p)=>({
      chatList:{
        message:[ p.chatList.messages,messageToSent]
      }
    }))
  }
    var raw = JSON.stringify({
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: msg_type,
      body: this.state.message,
      reply_id:replyID,
      upload: [],
      type:this.props.route.params.msg_type
    });
    console.log('raw',JSON.stringify(raw));
    fetch(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: this.state.fcmToken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: raw,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          console.log('asda', responseData);
          replyID='0'
          this.setState({selectedMode:false,forwardMessageIds: []});
          this.setState({showRelymsg:false,showaudiorply:false,showimagerply:false,showlocationmsg:false,showfilerply:false,showcontactrply:false,showvideorply:false});
          this.getConversationList();
        } else {
          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  uploadFileApi = (datas) => {
    let type;
    this.setState({open: false});
    if(this.props.route.params.msg_type!==0){
      type='1'
    }else{
      type='0'
    }
    const messageToSent = {
      ...newMessage,
      msg_type: 'file',
      fmsg: '',
      fattach: {
        ...newMessage.fattach,
        attach: `${datas.path}.${datas.type.split('/')[1]}`,
      },
      time: moment().format('hh:mm'),
    };
    if(this.state.ischatList&& this.state.chatList.messages.length>0){
      this.setState((p) => ({
        chatList: {
          ...p.chatList,
          messages: [...p.chatList.messages, messageToSent],
        },
        ischatList: true,
      }));
    }else{
      this.setState((p)=>({
        chatList:{
          message:[ p.chatList.messages,messageToSent]
        }
      }))
    }

    var data = {
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'file',
      reply_id: 0,
      type:this.props.route.params.msg_type,
      body: datas.type,
      upload: [
        {
          path: `${datas.path}.${datas.type.split('/')[1]}`,
          caption: '',
          data: datas.data,
        },
      ],
    };

    fetch(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: '1111',
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          // console.log('asda', responseData);
          // this.LoginOrNot();
          //   alert("Message sent succesfully")

          this.getConversationList();
        } else {
          // alert(responseData.data);

          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  sendVideo = async (data) => {
   let type;
   if(this.props.route.params.msg_type!==0){
    type='1'
  }else{
    type='0'
  }
    await this.setState({open: false});
    const messageToSent = {
      ...newMessage,
      msg_type: 'video',
      fmsg: '',
      fattach: {...newMessage.fattach, attach: data.path},
      time: moment().format('hh:mm'),
    };
    if(this.state.ischatList&& this.state.chatList.messages.length>0){
      this.setState((p) => ({
        chatList: {
          ...p.chatList,
          messages: [...p.chatList.messages, messageToSent],
        },
        ischatList: true,
      }));
    }else{
      this.setState((p)=>({
        chatList:{
          message:[ p.chatList.messages,messageToSent]
        }
      }))
    }
    var data = {
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'video',
      reply_id: 0,
      type:this.props.route.params.msg_type,
      body: '',
      upload: [
        {
          path: data.path,
          caption: '',
          data: data.data,
        },
      ],
    };

    fetch(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: '1111',
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          //   console.log('asda', responseData);
          // this.LoginOrNot();
          //   alert("Message sent succesfully")

          this.getConversationList();
        } else {
          // alert(responseData.data);

          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  selectOneFile = () => {
    //Opening Document Picker for selection of one file
    try {
      const res = DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).then(async (data) => {
        this.setState({open: false});
        // console.log(data);
        // FileViewer.open(data.uri, {showOpenWithDialog: true});
        const base64string = await readFile(data.uri, 'base64');
        const newData = {
          path: data.uri,
          data: base64string,
          type: data.type,
        };
        this.uploadFileApi(newData);
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error

        throw err;
      }
    }
  };

  selectOneFile1 = () => {
    //Opening Document Picker for selection of one file
    try {
      const res = DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      }).then(async (data) => {
        // console.log(data)
        console.log(data);

        const base64 = await readFile(data.uri, 'base64');
        const newData = {
          path: `${data.uri}.${data.type.split[1]}`,
          data: base64,
        };

        this.sendAudio(newData);

        // this.uploadFileApi(data);
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error

        throw err;
      }
    }
  };

  selectOneFile2 = () => {
    //Opening Document Picker for selection of one file
    try {
      const res = DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      }).then((data) => {
        // console.log('asd', `data:base64,${data.uri}`);
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error

        throw err;
      }
    }
  };

  uploadImage = (datas) => {
    let type;
    this.setState({open: false});
    if(this.props.route.params.msg_type!==0){
      type='1'
    }else{
      type='0'
    }
    var data = {
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'image',
      type:this.props.route.params.msg_type,
      reply_id: '0',
      body: 'sfsdfsdfd dsfsdfs',
      upload: [
        {
          fileName: datas.fileName,
          fileSize: datas.fileSize,
          height: datas.height,
          isVertical: datas.isVertical,
          originalRotation: datas.originalRotation,
          path: datas.path,
          type: datas.type,
          caption: this.state.caption,
          uri: '',
          width: datas.width,
          data: datas.data,
        },
      ],
    };

    axios(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: '1111',
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      data,
    })
      .then((responseData) => {
        if (responseData.data.code === 200) {
          // console.log('asda', responseData);
          // this.LoginOrNot();
          //   alert("Message sent succesfully")
           this.setState({caption:''})
          this.getConversationList();
        } else {
          // alert(responseData.data);

          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  launchCamera =  async () => {
    this.setState({message:''})
    // ImagePicker.launchCamera({mediaType: 'photo'}, async (response) => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64:true
      }).then(async response => {
          console.log('image data',response);
          this.setState({imageshow:false});
            this.setState({imageView:response});
      // await this.inputRef.focus();
      await this.setState({open: false});
      const messageToSent = {
        ...newMessage,
        msg_type: 'image',
        fmsg: '',
        fattach: {...newMessage.fattach, attach: response.path},
        time: moment().format('hh:mm'),
      };
      if(this.state.ischatList&& this.state.chatList.messages.length>0){
        this.setState((p) => ({
          chatList: {
            ...p.chatList,
            messages: [...p.chatList.messages, messageToSent],
          },
          ischatList: true,
        }));
      }else{
        this.setState((p)=>({
          chatList:{
            message:[ p.chatList.messages,messageToSent]
          }
        }))
      }
      
      // this.uploadImage(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.path};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    // });
  }).catch(error=>{
    alert(error);
    console.log('err >>>>>>> ', error);
    // firebase.crashlytics().recordError(error); 
   });
  };
   
  sendImage=async()=>{
    this.setState({imageshow:true})
    let response=this.state.imageView;
    await this.setState({open: false});
    // const messageToSent = {
    //   ...newMessage,
    //   msg_type: 'image',
    //   fmsg: '',
    //   fattach: {...newMessage.fattach, attach: response.path},
    //   time: moment().format('hh:mm'),
    // };
    // if(this.state.ischatList&& this.state.chatList.messages.length>0){
    //   this.setState((p) => ({
    //     chatList: {
    //       ...p.chatList,
    //       messages: [...p.chatList.messages, messageToSent],
    //     },
    //     ischatList: true,
    //   }));
    // }else{
    //   this.setState((p)=>({
    //     chatList:{
    //       message:[ p.chatList.messages,messageToSent]
    //     }
    //   }))
    // }
   
    this.uploadImage(response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else {
      const source = {uri: response.path};

      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };

      this.setState({
        avatarSource: source,
      });
    }
  }
  imagepicker = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      includeBase64:true
    }).then(async(response)=> {
      console.log('pickimage==',response);
      this.setState({imageshow:false});
      this.setState({imageView:response});
    // ImagePicker.showImagePicker({mediaType: 'photo'}, async (response) => {
      //  await this.inputRef.focus();
    
    // });
  });
  };
// LeftActions = () => {
//   const scale = dragX.interpolate({
//     inputRange: [0, 100],
//     outputRange: [0, 1],
//     extrapolate: 'clamp'
//   })
//     return (
//       <View
//         style={{ flex: 1, backgroundColor: 'blue', justifyContent: 'center' }}>
//         <Text
//           style={{
//             color: 'white',
//             paddingHorizontal: 10,
//             fontWeight: '600'
//           }}>
//           Left Action
//         </Text>
//       </View>
//     )
//    }
 requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'App Premission',
        'message': 'Chat x App need permission.'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
  videoPicker = async () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then(async (response) => {
      console.log('video',response);
        // this.uploadFileApi(response);

        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          this.props.navigation.navigate('VideoProcessScreen', {
            uri: response.path,
            sendVideo: this.sendVideo,
          });
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        }
  });
  };

  sendContact = (contact) => {
    let type;
    if(this.props.route.params.msg_type!==0){
      type='1'
    }else{
      type='0'
    }
    this.setState({open: false});
    var raw = JSON.stringify({
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'contact',
      type:this.props.route.params.msg_type,
      body: JSON.stringify(contact),
      reply_id: '0',
      upload: [],
    });

    const messageToSent = {
      ...newMessage,
      msg_type: 'contact',
      fmsg: JSON.stringify(contact),
      time: moment().format('hh:mm'),
    };
    if(this.state.ischatList&& this.state.chatList.messages.length>0){
      this.setState((p) => ({
        chatList: {
          ...p.chatList,
          messages: [...p.chatList.messages, messageToSent],
        },
        ischatList: true,
      }));
    }else{
      this.setState((p)=>({
        chatList:{
          message:[ p.chatList.messages,messageToSent]
        }
      }))
    }
  

    fetch(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: this.state.fcmToken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: raw,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          // console.log('asda', responseData);
          this.getConversationList();
        } else {
          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  contactPicker = async () => {
    this.setState({open: false});
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    ).then(() => {
      this.props.navigation.navigate('ContactsListScreen', {
        sendContact: this.sendContact,
      });
    });
  };

  sendAudio = (data) => {
    let type;
    this.setState({open: false});
    if(this.props.route.params.msg_type!==0){
      type='1'
    }else{
      type='0'
    }
    const messageToSent = {
      ...newMessage,
      msg_type: 'audio',
      fmsg: '',
      fattach: {...newMessage.fattach, attach: data.path},
      time: moment().format('hh:mm'),
    };
    if(this.state.ischatList&& this.state.chatList.messages.length>0){
      this.setState((p) => ({
        chatList: {
          ...p.chatList,
          messages: [...p.chatList.messages, messageToSent],
        },
        ischatList: true,
      }));
    }else{
      this.setState((p)=>({
        chatList:{
          message:[ p.chatList.messages,messageToSent]
        }
      }))
    }
    var data = {
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'audio',
      type:this.props.route.params.msg_type,
      reply_id: 0,
      body: '',
      upload: [
        {
          path: data.path,
          caption: '',
          data: data.data,
        },
      ],
    };

    fetch(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: '1111',
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          console.log('asda', responseData);
          // this.LoginOrNot();
          //   alert("Message sent succesfully")

          this.getConversationList();
        } else {
          // alert(responseData.data);

          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  startRecording = async () => {
    await recordingPermissions();
    const result = await audioRecorderPlayer.startRecorder(
      DocumentDirectoryPath + '/sample.mp4',
    );
    audioRecorderPlayer.addRecordBackListener((e) => {
      return;
    });
  };
  createTwoButtonAlert = () =>{
    if(this.state.recording){
    Alert.alert(
      "Audio Record",
      "Do you want to send this Audio?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => {this.onStopRecord()} }
      ],
      { cancelable: false }
    );
    }
    }
  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    const base64string = await readFile(result, 'base64');
    const data = {
      data: base64string,
      path: result,
    };
    this.sendAudio(data);
  };

  sendLocation = (location) => {
    let type;
    if(this.props.route.params.msg_type!==0){
      type='1'
    }else{
      type='0'
    }
    const messageToSent = {
      ...newMessage,
      msg_type: 'location',
      fmsg: JSON.stringify(location),
      time: moment().format('hh:mm'),
    };
    if(this.state.ischatList&& this.state.chatList.messages.length>0){
      this.setState((p) => ({
        chatList: {
          ...p.chatList,
          messages: [...p.chatList.messages, messageToSent],
        },
        ischatList: true,
      }));
    }else{
      this.setState((p)=>({
        chatList:{
          message:[ p.chatList.messages,messageToSent]
        }
      }))
    }
    var raw = JSON.stringify({
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'location',
      type:this.props.route.params.msg_type,
      body: JSON.stringify(location),
      reply_id: '0',
      upload: [],
    });

    fetch(`${BASE_URL}api-message/sent-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        device_id: '1234',
        device_token: this.state.fcmToken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: raw,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          // console.log('asda', responseData);
          this.getConversationList();
        } else {
          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  locationPicker = async () => {
    try {
      this.setState({open: false});
      await locationPermission();
      Geolocation.getCurrentPosition(
        (info) => {
          const location = {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          };
          this.sendLocation(location);
        },
        (err) => {
          alert(err.message);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
      );
    } catch (error) {
      console.log(error, 'I am here ');
    }
  };

  onChangeText = (text) => {
    this.emojiUnicode(text)
    this.setState({message: text});
  };
  NotificationCallPhone=(type)=> {
    let formData = new FormData()
      formData.append('user_id', this.state.userId)
      formData.append('toid', this.props.route.params.userid)
      formData.append('calltype',type)
      formData.append('type',type)
      console.log('form data==' + JSON.stringify(formData))
    // var CartList = this.state.baseUrl + 'api-product/cart-list'
      var RecentShare = `${BASE_URL}api-user/call-notification`
      console.log('Add product Url:' + RecentShare)
      console.log('form data general tab',JSON.stringify(formData));
      fetch(RecentShare, {
        method: 'Post',
        headers: new Headers({
          'Content-Type': 'multipart/form-data',
          device_id: '1111',
          device_token: this.state.fcmToken,
          device_type: 'android',
          Authorization: JSON.parse(this.state.userAccessToken), 
        }),
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
        // this.hideLoading();
          if (responseData.code == '200') {
            if(type==1){
          // this.props.navigation.navigate('VideoCall',{useravatar:this.props.route.params.useravatar}) 
            }else{
              // if(type==0)this.props.navigation.navigate('VoiceCall',{useravatar:this.props.route.params.useravatar})
            }
            console.log('call notification',JSON.stringify(responseData));
          } else {
            console.log('call notification',JSON.stringify(responseData));
          }
          console.log('response object:', responseData)
          console.log('User user ID==', JSON.stringify(responseData))
        })
        .catch(error => {;
          console.error(error)
        })
        .done()
      }

  deleteMessages = (type) => {
    const {fcmToken, userId, userAccessToken, forwardMessageIds} = this.state;

    const msgids = JSON.stringify(forwardMessageIds);

    const data = new FormData();

    data.append('user_id', userId);
    data.append('msgids', msgids.substring(1, msgids.length - 1));
    data.append('type',type)
       console.log('message delete',JSON.stringify(data));
    var EditProfileUrl =
      `${BASE_URL}api-message/delete-message`;
    console.log('Add product Url:' + EditProfileUrl);
    fetch(EditProfileUrl, {
      method: 'POST',
      headers: {
        device_id: '1234',
        device_token: fcmToken,
        device_type: 'android',
        Authorization: JSON.parse(userAccessToken),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseData) => {
        //   this.hideLoading();
        if (responseData.code == '200') {
          if(this.state.chatList.messages.length===1){
           this.setState({ischatList:false})
          }
          this.setState({
            selectedMode: false,
            showEveryone:false,
            forwardMessageIds: [],
          });
          this.getConversationList();
        } else {
          console.log(responseData.data);
        }
        console.log(
          'contact list response object:',
          JSON.stringify(responseData),
        );
      })
      .catch((error) => {
        //  this.hideLoading();
        console.error(error);
      })
      .finally(() => {});
  };
  clearMessages = () => {
    const {fcmToken, userId, userAccessToken, forwardMessageIds} = this.state;

    const msgids = JSON.stringify(forwardMessageIds);

    const data = new FormData();

    data.append('user_id', userId);
    data.append('type',this.props.route.params.msg_type)
    data.append('toid',this.props.route.params.userid );
       console.log('data',JSON.stringify(data))
    var EditProfileUrl =
      `${BASE_URL}-message/clear-all`;
    console.log('Add product Url:' + EditProfileUrl);
    fetch(EditProfileUrl, {
      method: 'POST',
      headers: {
        device_id: '1234',
        device_token: fcmToken,
        device_type: 'android',
        Authorization: JSON.parse(userAccessToken),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseData) => {
        //   this.hideLoading();
        if (responseData.code == '200') {
        
          //  Toast.show(responseData.message);
          this.setState({chatList: {messages: []}});
        } else {
          console.log(responseData.data);
        }

        //console.log('Edit profile response object:', responseData)
        console.log(
          'clear response object:',
          JSON.stringify(responseData),
        );
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch((error) => {
        //  this.hideLoading();
        console.error(error);
      })
      .finally(() => {});
  };
 emojiUnicode=(emoji)=>{
    var comp;
    
    if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
    }
    comp = (
        (emoji.charCodeAt(0) - 0xD800) * 0x400
      + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
        comp = emoji.charCodeAt(0);
    }
    console.log('comp',comp)
    return comp.toString("16");
    
};
convertEmoji=(text)=> {
  console.log('emoji',text)
  return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });

}
  openProfile=()=>{
    console.log('group id',this.props.route.params.groupId);
    console.log('group id',this.state.userId);
    let items=this.props.route.params.useravatar;
    let id=this.props.route.params.userid;
    let name=this.props.route.params.username;
    let about=this.props.route.params.userabout;
    let phone=this.props.route.params.userphone;
    let groupid=this.props.route.params.groupId;
    if(this.props.route.params.msg_type=="1"){
      if(items){
        this.props.navigation.navigate('GroupProfile',{imageURL:items,name:name,about:about,phone:phone,groupId:groupid})
        }else{
          this.props.navigation.navigate('GroupProfile',{imageURL:'',imageURL:items,name:name,about:about,phone:phone,groupId:groupid})
        }
    }else{
    if(items){
    this.props.navigation.navigate('ChatProfile',{imageURL:items,name:name,about:about,phone:phone,userid:id})
    }else{
      this.props.navigation.navigate('ChatProfile',{imageURL:'',imageURL:items,name:name,about:about,phone:phone,userid:id})
    }
  }
}
  onSlideRight = () => {
    //perform Action on slide success.
};
SendReportIssue() {
  console.log('working send report')
  let formData = new FormData()
  formData.append('user_id', this.state.userId)
  formData.append('reason','Report User')
  formData.append('message','Something went wrong with this user')
  console.log('form data==' + JSON.stringify(formData))
 // var otpUrl= 'http://cartpadle.atmanirbhartaekpahel.com/frontend/web/api-user/send-otp'
  
  var otpUrl =`${BASE_URL}api-user/report-problem`
  console.log('url:' + otpUrl)
  fetch(otpUrl, {
    method: 'Post',
    headers: {
      'Content-Type': 'multipart/form-data',
      device_id: '1234',
      device_token:this.state.fcmToken,
      device_type: 'android',
      Authorization: JSON.parse(this.state.userAccessToken),
    },
    body: formData,
  })
    .then(response => response.json())
    .then(responseData => {

      if (responseData.code == '200') {
      //   this.props.navigation.navigate('LoginScreen')
      alert(responseData.data)
           console.log(responseData);
      } 
      else {
          alert(responseData.message);
        console.log(responseData)
      }
      
     
    })
    .catch(error => {
      console.error(error)
    })

    .done()
}
replytype=()=>{
  let replymsg=this.state.replyMessage;
  if(replymsg.text.msg_type=="text"){
    this.setState({showRelymsg:true,borderval:true});
  }
  if(replymsg.text.msg_type=="location"){
    this.setState({showlocationmsg:true,borderval:true});
  }
  if(replymsg.text.msg_type=="image"){
    this.setState({showimagerply:true,borderval:true});
  }
  if(replymsg.text.msg_type=="audio"){
    this.setState({showaudiorply:true,borderval:true});
  }
  if(replymsg.text.msg_type=="video"){
    this.setState({showvideorply:true,borderval:true});
  }
  if(replymsg.text.msg_type=="contact"){
    this.setState({showcontactrply:true,borderval:true});
  }
  if(replymsg.text.msg_type=="file"){
    this.setState({showfilerply:true,borderval:true});
  }

 
}
  render() {
    return (
      <Container style={{backgroundColor: '#F1F0F2'}}>
       {this.state.imageshow?(<View style={{flex:1}}>
        <View
          style={{
            width: '100%',
            height: '10%',
            backgroundColor: '#FFFFFF',
            zIndex: 2,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}  >
            <View style={styles.BackButtonContainer}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image
                  source={require('../images/back_blck_icon.png')}
                  style={styles.backButtonStyle}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.TitleContainer}>
              <ImageModal
                imageBackgroundColor="transparent"
                source={
                  this.props.route.params.useravatar
                    ? {uri: this.props.route.params.useravatar}
                    : require('../images/default_user.png')
                }
                style={styles.LogoIconStyle}
              />
              {/* <Image
                source={
                  this.props.route.params.useravatar
                    ? {uri: this.props.route.params.useravatar}
                    : require('../images/default_user.png')
                }
                style={styles.LogoIconStyle}
              /> */}
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 4,
                }} onPress={this.openProfile}>
                <Text
                  style={[styles.TitleStyle, { textAlign: 'left',fontSize: resp(15)}]}>
                  {this.props.route.params.username}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {this.state.selectedMode ? (
                <>
                 <Icon
                    name="reply"
                    type="Entypo"
                    onPress={() => {
                     this.replytype()
                      console.log('abc',this.state.replyMessage.text.fmsg);
                      // this.replyTo();
                    }}
                    style={{color: '#2B2B2B', fontSize: 18, marginRight: 15}}
                  />
                  <Icon
                    name="delete"
                    type="MaterialCommunityIcons"
                    onPress={() => {
                      this.setState({deletemodal:true})
                      // this.deleteMessages()

                    }}
                    style={{color: '#2B2B2B', fontSize: 18, marginRight: 15}}
                  />
                  <Icon
                    name="content-copy"
                    type="MaterialCommunityIcons"
                    onPress={() => {
                      this.copyToClipboard();
                    }}
                    style={{color: '#2B2B2B', fontSize: 18, marginRight: 15}}
                  />
                  <Icon
                    name="forward"
                    type="Entypo"
                    onPress={() => {
                      const msgids = JSON.stringify(
                        this.state.forwardMessageIds,
                      );
                      this.setState({
                        selectedMode: false,
                        forwardMessageIds: [],
                      });
                      this.props.navigation.navigate('ForwardMessageScreen', {
                        fcmToken: this.state.fcmToken,
                        PhoneNumber: this.state.PhoneNumber,
                        userId: this.state.userId,
                        userAccessToken: this.state.userAccessToken,
                        msgids: msgids.substring(1, msgids.length - 1),
                      });
                    }}
                    style={{
                      color: '#2B2B2B',
                      fontSize: 18,
                      marginHorizontal: 10,
                      marginRight: 15,
                    }}
                  />
                </>
              ) : (
                <>
                  <Icon
                    name="video"
                    onPress={() => {
                      this.NotificationCallPhone(1);
                    }}
                    type="Feather"
                    style={{color: '#2B2B2B', fontSize: 18, marginRight: 15}}
                  />
                  <Icon
                    name="phone"
                    type="Feather"
                    onPress={() => {
                      this.NotificationCallPhone(0);
                    }}
                    style={{
                      color: '#2B2B2B',
                      fontSize: 18,
                      marginHorizontal: 10,
                      marginRight: 15,
                    }}
                  />
                  {/* <Icon
                name="more-vertical"
                type="Feather"
                style={{color: '#2B2B2B', fontSize: 24, marginRight: 5}}
              /> */}
                  <Menu
                    ref={(ref) => (this._menu = ref)}
                    button={
                      <TouchableOpacity
                        onPress={() => {
                           this._menu.show()
                           
                        }}>
                        <Icon
                          name="more-vertical"
                          type="Feather"
                          style={{
                            color: '#2B2B2B',
                            fontSize: 24,
                            marginRight: 5,
                          }}
                        />
                      </TouchableOpacity>
                    }>
                    {/* <MenuItem onPress={() =>{ this._menu.hide()
                    this.openProfile()
                    }}>
                      View Contact
                    </MenuItem> */}
                    <MenuItem onPress={() => {this._menu.hide()
                    this.openProfile()
                    }}>
                      Media,links,and docs
                    </MenuItem>
                    <MenuItem onPress={() => {this._menu.hide()
                    this.clearMessages()
                    }}>
                      Clear Chat
                    </MenuItem>
                    <MenuItem onPress={() => {this._menu.hide()
                    this.SendReportIssue()
                    }}>
                      Report user
                    </MenuItem>
                  </Menu>
                </>
              )}
            </View>
          </View>
        </View>
        <ScrollView
          style={{height: height * 0.84}}
          ref={(ref) => {
            this.scrollView = ref;
          }}
          onContentSizeChange={() =>
            this.scrollView.scrollToEnd({animated: true})
          }>
          <ScrollView>
            <View style={{paddingHorizontal: 10, marginTop: '20%'}}>
              {/* <Text
                style={{
                  color: 'red',
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 10,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                {moment().format("DD-MM-YYYY")}
              </Text> */}
              {this.state.ischatList
                ? this.state.chatList.messages.map((v, i) => {
                  console.log('the v values',v.exit);
                    return (
                      <MessageComponent
                        key={`message-${i}`}
                        message={v}
                        toggleSelectedMode={this.toggleSelectedMode}
                        appendMessages={this.appendMessages}
                        removeMessages={this.removeMessages}
                        selectedMode={this.state.selectedMode}
                        forwardMessageIds={this.state.forwardMessageIds}
                        copyText={this.copyText}
                        replyMessage={this.replyTo}
                      />
                    );
                  })
                : null}
            </View>
          </ScrollView>
        </ScrollView>

        {this.state.open && (
          <View
            style={{
              width: '90%',
              height: '25%',
              backgroundColor: '#FFFFFF',
              alignSelf: 'center',
              borderRadius: 10,
              justifyContent: 'space-around',
              padding: 20,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View>
                <TouchableOpacity
                  style={{justifyContent: 'center', alignItems: 'center'}}
                  onPress={() => this.selectOneFile()}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#ffebe6',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../images/docs.png')}
                      // resizeMode="center"
                      style={{width:15,height:20,alignSelf:'center'}}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2B2B2B',
                      textAlign: 'center',
                    }}>
                    Document
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => this.videoPicker()}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#e7f0fe',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name="videocam"
                      type="Ionicons"
                      style={{
                        fontSize: 18,
                        alignSelf: 'center',
                        color: '#4086F4',
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2B2B2B',
                      textAlign: 'center',
                    }}>
                    Video
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => this.imagepicker()}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#e6fef6',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../images/gal.png')}
                      // resizeMode="center"
                      style={{width:20,height:15,alignSelf:'center'}}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2B2B2B',
                      textAlign: 'center',
                    }}>
                    Photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={{marginLeft: 10}}>
                <TouchableOpacity onPress={() => this.selectOneFile1()}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#fffae6',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../images/audioo.png')}
                      // resizeMode="center"
                      style={{alignSelf: 'center',width:15,height:15}}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2B2B2B',
                      textAlign: 'center',
                    }}>
                    Audio
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.locationPicker()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#e6fef6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../images/loc.png')}
                    // resizeMode="center"
                    style={{alignSelf: 'center',width:15,height:20}}
                  />
                </TouchableOpacity>
                <Text
                  style={{fontSize: 12, color: '#2B2B2B', textAlign: 'center'}}>
                  Location
                </Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => this.contactPicker()}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#e7f0fe',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../images/folw.png')}
                      // resizeMode="center"
                      style={{alignSelf: 'center',width:15,height:20}}
                    />
                  </View>
                  <Text style={{fontSize: 12, color: '#2B2B2B'}}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {this.props.route.params.groupexit==false || this.props.route.params.groupexit==undefined  ?
        <View> 
         {this.state.showRelymsg==true? 
         this.state.replyMessage.text.fmsg!==""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showRelymsg:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10}}>
            <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.fmsg}</Text>
            </View>
            </View>):(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showRelymsg:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10}}>
            <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tmsg}</Text>
            </View>
            </View>)
             :null} 
              {this.state.showimagerply==true? 
         this.state.replyMessage.text.fattach!=""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showimagerply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
             
            <Image style={{marginBottom:5,color:'#191919',width:40,height:40,alignSelf:'flex-end'}} source={{uri:this.state.replyMessage.text.fattach.attach}}></Image>
            </View>
            </View>):this.state.replyMessage.text.tattach!=""?(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showimagerply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10}}>
           <Image style={{marginBottom:5,color:'#191919',width:40,height:40,alignSelf:'flex-end'}} source={{uri:this.state.replyMessage.text.tattach.attach}}></Image>
            {/* <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tattach.attach}</Text> */}
            </View>
            </View>):null
             :null} 
                  {this.state.showaudiorply==true? 
         this.state.replyMessage.text.fattach!=""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showaudiorply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="mic"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919'}}>Voice message</Text>
            
            </View>
            </View>):this.state.replyMessage.text.tattach!=""?(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showaudiorply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="mic"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919'}}>Voice message</Text>
            {/* <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tattach.attach}</Text> */}
            </View>
            </View>):null
             :null} 
              {this.state.showcontactrply==true? 
         this.state.replyMessage.text.fmsg!=""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showcontactrply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="user"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:8}}>Contact</Text>
            
            </View>
            </View>):this.state.replyMessage.text.tattach!=""?(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showcontactrply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="user"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:8}}>Contact</Text>
            
            {/* <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tattach.attach}</Text> */}
            </View>
            </View>):null
             :null} 
            {this.state.showfilerply==true? 
         this.state.replyMessage.text.fattach!=""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showfilerply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="file"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:5}}>Document</Text>
            
            </View>
            </View>):this.state.replyMessage.text.tattach!=""?(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showfilerply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="file"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:5}}>Document</Text>
            {/* <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tattach.attach}</Text> */}
            </View>
            </View>):null
             :null} 
              {this.state.showvideorply==true? 
         this.state.replyMessage.text.fattach!=""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showfilerply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="video"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:5}}>Video</Text>
            
            </View>
            </View>):this.state.replyMessage.text.tattach!=""?(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showfilerply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="video"
                  type="Feather"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:5}}>Video</Text>
            {/* <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tattach.attach}</Text> */}
            </View>
            </View>):null
             :null} 

{this.state.showlocationmsg==true? 
         this.state.replyMessage.text.fmsg!=""?
         (<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'red'}}>You</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showlocationmsg:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="location"
                  type="Entypo"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:8}}>Location</Text>
            
            </View>
            </View>):this.state.replyMessage.text.tattach!=""?(<View style={{width:'80%',backgroundColor:'#e5e5e5', marginHorizontal:15,height:'auto',borderTopRightRadius:10,borderTopLeftRadius:10}}> 
           <View style={{marginLeft:10,marginTop:5,flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:"bold",color:'green'}}>{this.props.route.params.username}</Text>
             <View >
           <Icon type="Entypo" name="cross" style={{fontSize:20,textAlign:'right'}} onPress={()=>{this.setState({showcontactrply:false,selectedMode: false, forwardMessageIds: [],})}}    />
           </View>
             {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
             </View>
           <View style={{marginLeft:10,marginTop:5,marginRight:10,flexDirection:'row'}}>
           <Icon
                  name="location"
                  type="Entypo"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
           <Text style={{marginBottom:5,color:'#191919',marginLeft:8}}>Location</Text>
            
            {/* <Text style={{marginBottom:5,color:'#191919'}}>{this.state.replyMessage.text.tattach.attach}</Text> */}
            </View>
            </View>):null
             :null}
             
             
        <View
          style={{
            flexDirection: 'row',
            marginBottom:
              this.state.chatList.length === 0
                ? height * 0.001
                : height * 0.001,
            alignSelf: 'center',
          }}>
           <TextInput
            ref={(ref) => (this.inputRef = ref)}
            multiline={true}
            value={this.state.message}
            onContentSizeChange={(event) => {
              this.setState({height: event.nativeEvent.contentSize.height});
            }}
            onChangeText={(text) => this.onChangeText(text)}
            placeholder="Type a message…"
            editable={this.state.editMode}
            style={{
              marginLeft: 10,
              marginRight:10,
              marginBottom:10,
              backgroundColor: '#FFFFFF',
              color: '#0000008A',
              borderRadius: 1,
              width: '60%',
              height: this.state.height,
              fontSize: 15,
              paddingLeft: 10,
              borderWidth: 0,
              borderTopLeftRadius: this.state.borderval?0:15,
              borderBottomLeftRadius: 15,
            }}
          />
          <View
            style={{
              backgroundColor: '#FFFFFF',
              alignSelf: 'center',
              height: this.state.height,
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 0,
              marginLeft: -10,
              borderTopRightRadius: this.state.borderval?0:15,
              borderBottomRightRadius: 15,
              paddingBottom: 4,
              marginBottom: 22,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                onPress={() => {
                  this.setState({open: !this.state.open});
                  this.setState({editMode:!this.state.editMode});
                  this.setState({message:''})
                }}
                name="attachment"
                type="MaterialIcons"
                style={{color: '#0000008A', marginRight: 8}}
              />
              {!this.state.message.length>0?(<Icon
                onPress={() => {
                  this.launchCamera();
                }}
                name="photo-camera"
                type="MaterialIcons"
                style={{color: '#0000008A', marginRight: 8}}
              />):null}
            </View>
          </View>
          <View >
           
          <View
            style={{
              alignSelf: 'flex-end',
              width: this.state.recording ? 60 : 40,
              height: this.state.recording ? 60 : 40,
              margin: this.state.recording ? 0 : 10,
              borderRadius: this.state.recording ? 30 : 20,
              backgroundColor: 'red',
              justifyContent: 'center',
              
            }}>
            <TouchableOpacity
              onLongPress={() => {
                this.startRecording();
                this.setState({recording: true});
              }}
              onPressOut={() => {
                this.createTwoButtonAlert();
                this.setState({recording: false});
              }}
              onPress={() => {
                this.sendMessage();
              }}>
              {this.state.message === '' ? (
                
                <Icon
                  name="mic"
                  type="Feather"
                  style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                /> 
              ) : (
                <Icon
                  name="arrowright"
                  type="AntDesign"
                  style={{fontSize: 20, color: '#FFFFFF', alignSelf: 'center'}}
                />
              )}
            </TouchableOpacity>
          </View>
          </View>
        </View>
        </View>:<Text style={{margin:10,color:'red'}}>You can't sent message to this group because you're no longer a Participant</Text>}
        </View>):(
          <View style={{flex:1,backgroundColor:'black'}}>
            <ScrollView>
              <View>
            <Image source={{uri:this.state.imageView.path}} style={{width:500,height:600}} />
           <View style={{flexDirection:'row'}}>
            <TextInput
            placeholder="Type a caption...."
            style={{backgroundColor:'#fff',marginTop:15,width:"90%"}}
            onChangeText={(text)=>{this.setState({caption:text})}}
             />
             <View style={{backgroundColor:'red',marginTop:15,justifyContent:'center',alignContent:'center',width:"10%"}}>
              <Icon
                  name="arrowright"
                  type="AntDesign"
                  onPress={()=>{this.sendImage()}}
                  style={{fontSize: 20, color: '#FFFFFF', alignSelf: 'center'}}
                />
                </View>
             </View>
             </View>
             </ScrollView>
          </View>
        )}
          <Modal
              animationType='slide'
              transparent={true}
              visible={this.state.deletemodal}
              onRequestClose={() => this.closeModal()}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View>
                    <View >
                  <Text style={{margin:15,fontSize:15}}>{'Delete Message ?'}</Text>
                  </View>
                  <TouchableOpacity style={{alignItems:'flex-end',margin:10}} onPress={()=>{this.deleteMessages("1")}}>
                    <Text style={{color:'red'}}>DELETE FOR ME</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{alignItems:'flex-end',margin:10}} onPress={()=>{this.setState({deletemodal:false,selectedMode: false,
                        forwardMessageIds: [],showEveryone:false})}}>
                    <Text style={{color:'red'}}>CANCEL</Text>
                  </TouchableOpacity>
                 {this.state.showEveryone?<TouchableOpacity style={{alignItems:'flex-end',margin:10}} onPress={()=>{this.deleteMessages("0")}}>
                    <Text style={{color:'red'}}>DELETE FOR EVERYONE</Text>
                  </TouchableOpacity>:null}
                  </View>
                </View>
              </View>
            </Modal>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    width: 300,
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  BackButtonContainer: {
    flex: 0.1,
    marginLeft:5,
    backgroundColor: 'white',
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 20,
  },
  TitleContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
    borderRadius:5
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  SearchIconStyle: {
    margin: 5,
    marginRight: 20,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
  },
  TabBox: {
    flex: 0.1,
    color: '#000',
  },
  tabStyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    shadowColor: '#ecf6fb',
    elevation: 20,
    shadowColor: 'grey',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0,
  },
  tabButtonStyle: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  StyleHomeTab: {
    marginTop: 5,
    width: 30,
    height: 28,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActiveTextStyle: {
    color: '#FB3954',
    fontSize: resp(10),
    marginTop: 5,
    textAlign: 'center',
  },
  styleChartTab: {
    marginTop: 9,
    width: 30,
    height: 30,
    marginLeft: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomInactiveTextStyleChart: {
    color: '#887F82',
    fontSize: resp(10),
    marginTop: 3,
    marginLeft: 8,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  bottomInactiveTextStyle: {
    color: '#887F82',
    fontSize: resp(10),
    marginTop: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  StyleSettingTab: {
    marginTop: 9,
    width: 30,
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StyleOpenForPublicTab: {
    marginTop: 11,
    marginRight: 10,
    width: 38,
    height: 23,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StyleChatTab: {
    marginTop: 9,
    width: 30,
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
function mapStateToProps(state){
  const {data:conversationData,success:conversationSuccess,isLoading:conversationLoading,error:conversationError}=state.ConversationListReducer;
  return{
    conversationData,conversationSuccess,conversationLoading,conversationError
  }
}
export default connect(mapStateToProps,{ConversationListAction})(ChatDetailScreen);

const newMessage = {
  fattach: null,
  fmsg: '',
  id: 42,
  isread: '0',
  msg_type: '',
  reply_id: 0,
  tattach: '',
  time: moment().format('hh:mm'),
  tmsg: '',
  type: '0',
  sending: true,
};