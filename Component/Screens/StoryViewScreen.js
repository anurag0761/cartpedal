import React, {Component} from 'react'
console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  Alert,
  PermissionsAndroid
} from 'react-native'
import resp from 'rn-responsive-font'
import {SliderBox} from 'react-native-image-slider-box'
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {DocumentDirectoryPath, readFile} from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage'
import { Button, Container, Content, Footer, FooterTab, Icon, Item, } from 'native-base';
import { flatMap } from 'lodash'
import {BASE_URL} from '../Component/ApiClient';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
const audioRecorderPlayer = new AudioRecorderPlayer();
import {
  locationPermission,
  recordingPermissions,
} from '../Component/Permissions';
// let width=Dimensions.get('window').width;
// let height=Dimensions.get('window').height;
class StoryViewScreen extends Component{
    constructor (props) {
        super(props)
        this.state = {
          currentTime:'',
          avatar:null,
          userId:'',
          imageshow:true,
          fcmtoken:'',
          userAccessToken:'',
          ReplyMessage:'',
          message:'',
          height:40,
          open: false,
          position:'',
          storyid:'',
          ownUserID:'',
          imageView:'',
          storyLength:'',
          leftcount:1,
          defaultavatar:require('../images/default_user.png'),
            images:'',
            visibleReply:true,
            nameStory:'',
              // require('../images/story_images_2.png'),
              // require('../images/story_images_3.png'),
              // require('../images/story_images_4.png')
              
        }
        console.log( 'story ',this.props.route.params.storyImages);
        console.log('user id',this.props.route.params.userid);
    }
    componentDidMount(){
      AsyncStorage.getItem('@fcmtoken').then(token => {
        if (token) {
          this.setState({fcmtoken: JSON.parse(token)})
         let storyArr= this.props.route.params.storyArray;
         let position=this.props.route.params.position
         this.setState({position:position})
         this.setState({storyLength:storyArr.length})
         console.log('position',position,storyArr.length);
         console.log('story Arr',JSON.stringify(storyArr));
          console.log('device fcm token ====' + this.state.fcmtoken);
        }
      });
      AsyncStorage.getItem('@user_id').then(userId => {
        if (userId) {
          this.setState({userId: userId})
          console.log('Edit user id Dhasbord ====' + this.state.userId)
         this.storyData()
        }
      });
     
  AsyncStorage.getItem('@access_token').then((accessToken) => {
    if (accessToken) {
      this.setState({ userAccessToken: accessToken });
      console.log("Edit access token ====" + accessToken);
         this.viewStory();
    } 
  })
    }
    storyData=()=>{
      let item=this.props.route.params.storyArray[this.state.position].avatar;
      this.setState({avatar:item});
      let name=this.props.route.params.storyArray[this.state.position].name;
      this.setState({nameStory:name});
      console.log('avatar',JSON.stringify(item));
      let imageArr=[];
      let storyID;
      let time;
      let storyImage=this.props.route.params.storyArray[this.state.position].stories;
      storyID=storyImage[0].stid;
      console.log('story Image',storyImage);
      storyImage.map((item,index)=>{
        imageArr.push(item.image)
         time=item.time;
      });
      console.log('story ID',storyID);
      this.setState({storyid:storyID})
      this.setState({images:imageArr});
      let timeID =moment(time*1000).fromNow();
      this.setState({currentTime:timeID});
      console.log(imageArr);
    }
    onChangeText = (text) => {
      this.setState({message: text});
    };
    sendMessage = () => {
      console.log('user id', this.props.route.params.userid);
      this.setState({message: '', height: 40});
      var raw = JSON.stringify({
        user_id: this.state.userId,
        type:"0",
        toid: this.props.route.params.userid,
        msg_type: 'text',
        body: this.state.message,
        reply_id: '0',
        upload: [],
      });
      console.log('raw', raw);
      fetch(`${BASE_URL}api-message/sent-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          device_id: '1234',
          device_token: this.state.fcmtoken,
          device_type: 'android',
          Authorization: JSON.parse(this.state.userAccessToken),
        },
        body: raw,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.code === 200) {
            alert('Message has been sent');
            this.setState({visibleReply:true})
            console.log('asda', responseData);
          } else {
            console.log('logged user stories' + JSON.stringify(responseData));
          }
        })
  
        .catch((error) => {
          console.error(error);
        });
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
    uploadFileApi = (datas) => {
      let type='0';
      this.setState({open: false})
      var data = {
        user_id: this.state.userId,
        toid: this.props.route.params.userid,
        msg_type: 'file',
        reply_id: 0,
        type:type,
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
              alert("Message sent succesfully")
  
            // this.getConversationList();
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
    sendContact = (contact) => {
      let type;
      if(this.props.route.params.groupId!==0){
        type='1'
      }else{
        type='0'
      }
      this.setState({open: false});
      var raw = JSON.stringify({
        user_id: this.state.userId,
        toid: this.props.route.params.userid,
        msg_type: 'contact',
        type:type,
        body: JSON.stringify(contact),
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
  
    sendVideo = async (data) => {
      let type='0';
       await this.setState({open: false});
       var data = {
         user_id: this.state.userId,
         toid: this.props.route.params.userid,
         msg_type: 'video',
         reply_id: 0,
         type:type,
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
             this.setState({})
               alert("Message sent succesfully")
   
            //  this.getConversationList();
           } else {
             // alert(responseData.data);
   
             console.log('logged user stories' + JSON.stringify(responseData));
           }
         })
         .catch((error) => {
           console.error(error);
         });
     };
   
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
    
  uploadImage = (datas) => {
    let type='0';
    this.setState({open: false});
    // if(this.props.route.params.groupId!==0){
    //   type='1'
    // }else{
    //   type='0'
    // }
    var data = {
      user_id: this.state.userId,
      toid: this.props.route.params.userid,
      msg_type: 'image',
      type:type,
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
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      data,
    })
      .then((responseData) => {
        if (responseData.data.code === 200) {
          // console.log('asda', responseData);
          // this.LoginOrNot();
          this.setState({visibleReply:true})
            alert("Message sent succesfully")
           this.setState({caption:''})
          // this.getConversationList();
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
    sendAudio = (data) => {
      let type='0';
      this.setState({open: false});
      var data = {
        user_id: this.state.userId,
        toid: this.props.route.params.userid,
        msg_type: 'audio',
        type:type,
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
            this.setState({visibleReply:true})
          } else {
            // alert(responseData.data);
  
            console.log('logged user stories' + JSON.stringify(responseData));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
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
    sendImage=async()=>{
      this.setState({imageshow:true})
      let response=this.state.imageView;
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
    launchCamera =  async () => {
      this.setState({message:''})
      // ImagePicker.launchCamera({mediaType: 'photo'}, async (response) => {
        ImagePicker.openCamera({
          // width: 300,
          // height: 400,
          cropping: true,
          includeBase64:true
        }).then(async response => {
            console.log('image data',response);
            this.setState({imageshow:false});
            this.setState({imageView:response});
        // await this.inputRef.focus();
        
        })
      // });
    };
    viewStory=()=>{
      // this.showLoading();
        let formData = new FormData()
    
        formData.append('user_id', this.state.userId);
       formData.append('story_id',this.state.storyid)
        console.log('form data==' + JSON.stringify(formData))
    
        // var CartList = this.state.baseUrl + 'api-product/cart-list'
        var viewStory = `${BASE_URL}api-user/view-story`
        console.log('Add product Url:' + viewStory)
        fetch(viewStory, {
          method: 'Post',
          headers: new Headers({
            'Content-Type': 'multipart/form-data',
            device_id: '1111',
            device_token: this.state.fcmtoken,
            device_type: 'android',
            // Authorization: 'Bearer' + this.state.access_token,  
            Authorization: JSON.parse(this.state.userAccessToken),
    
          }),
          body: formData,
        })
          .then(response => response.json())
          .then(responseData => {
              // this.hideLoading();
            if (responseData.code == '200') {
              console.log(responseData.data);
            } else {
              console.log(responseData.data);
            }
            //console.log('Edit profile response object:', responseData)
            console.log('view response object:', JSON.stringify(responseData))
            // console.log('access_token ', this.state.access_token)
            //   console.log('User Phone Number==' + formData.phone_number)
          })
          .catch(error => {
             this.hideLoading();
            console.error(error)
          })
          .done();
       }
       onSwipeLeft(gestureState) {
         console.log('swipe left',gestureState);
         let leftcount=this.state.leftcount;
         this.setState({leftcount:leftcount+1});
         let itemVariable=this.props.route.params.storyArray[this.state.position].stories.length;
         console.log('length',itemVariable);
         console.log('left position',this.state.position,'story length',this.state.storyLength-1);
         if(this.state.position!==this.state.storyLength-1&&itemVariable==leftcount){
           console.log('working')
        this.setState({position:this.state.position+1},()=>{
          this.setState({leftcount:1})
          this.storyData()
        });
      }
      }
     
      onSwipeRight(gestureState) {
        console.log('swipe right',gestureState);
        let leftcount=this.state.leftcount;
        this.setState({leftcount:leftcount-1});
        let itemVariable=this.props.route.params.storyArray[this.state.position].stories.length;
        console.log('length',itemVariable,'left count',leftcount);
        console.log('right position',this.state.position,'story length',this.state.storyLength);
        if(this.state.position!=0&&1==leftcount){
        this.setState({position:this.state.position-1},()=>{
          this.setState({leftcount:1})
          this.storyData()
        });
      }
      }
      onSwipe(gestureName, gestureState) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        this.setState({gestureName: gestureName});
        switch (gestureName) {
          case SWIPE_UP:
            this.setState({backgroundColor: 'red'});
            break;
          case SWIPE_DOWN:
            this.setState({backgroundColor: 'green'});
            break;
          case SWIPE_LEFT:
            this.setState({backgroundColor: 'blue'});
            break;
          case SWIPE_RIGHT:
            this.setState({backgroundColor: 'yellow'});
            break;
        }
      }
      onSwipeUp(gestureState) {
        this.props.navigation.goBack()
       }
    render () {
      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };
        return (
          <SafeAreaView style={styles.container}>
                <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          // backgroundColor: this.state.backgroundColor
        }}
        >
           {this.state.imageshow?(<>
          {/* <TouchableOpacity style={styles.CloseButtonContainerStyles}
          onPress={() => {
            this.props.navigation.goBack()
          }}>
          <Image
                source={require('../images/red_close_icon.png')}
                style={styles.CloseButtonViewStyles}
              />  
          </TouchableOpacity> */}
          {/* <View> */}
          <View style={{flexDirection:'row',marginBottom:10}}>
            
            <View style={styles.BackButtonContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../images/back_blck_icon.png')}
                style={styles.backButtonStyle}
              />
            </TouchableOpacity>
          </View>
            <View style={styles.CloseButtonContainerStyles}>
              <Image style={styles.CloseButtonViewStyles} source={this.state.avatar==null?(this.state.defaultavatar):{uri:this.state.avatar}} />
            </View>
            <View style={{flexDirection:'column'}}>
            <View style={{width:300}}>
              <Text style={styles.username}>{this.state.nameStory}</Text>
              </View>
        <Text style={{marginTop:5,fontSize:12}}>{this.state.currentTime}</Text>
            </View>
            </View>
        
            <View style={styles.ImageContainer}>
             <SliderBox
                images={this.state.images}
                style={styles.sliderImageStyle}></SliderBox>
                </View>
                
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
                {this.state.visibleReply?(<View style={styles.reply}>
                  <View style={{flexDirection:'column'}}>
                    <TouchableOpacity onPress={()=>{this.setState({visibleReply:false})}} >
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                  <Image source={require('../images/reply.png')} style={{width:30,height:30}} />
                  </View>
                  <Text style={{marginTop:2}}>REPLY</Text>
                  </TouchableOpacity>
                  </View>
                </View>):
                (<View style={{ flexDirection: 'row', marginBottom: 10,marginTop:25,borderRadius:25,position:'absolute',bottom:20, alignSelf: 'center',backgroundColor:'#F1F0F2' }}>
                    <TextInput 
                    onChangeText={(text) => this.onChangeText(text)}
                    multiline={true}
                    value={this.state.message}
                    ref={(ref) => (this.inputRef = ref)}
                    onContentSizeChange={(event) => {
                      this.setState({height: event.nativeEvent.contentSize.height});
                    }}
                    placeholder='Type a message…' style={{
                        margin: 10,
                        backgroundColor: '#FFFFFF', color: '#0000008A',
                        borderRadius: 35, width: '60%',
                        height: this.state.height, fontSize: 12, paddingLeft: 10, borderWidth: 0,
                        borderTopRightRadius: 0, borderBottomRightRadius: 0
                    }} />
                    <View 
            style={{
              backgroundColor: '#FFFFFF',
              alignSelf: 'center',
              height: this.state.height,
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop:10,
              borderWidth: 0,
              marginLeft: -10,
              borderTopRightRadius: this.state.showRelymsg?0:15,
              borderBottomRightRadius: 15,
              paddingBottom: 4,
              marginBottom: 12,
            }}
            >
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
                    {/* <View style={{
                        backgroundColor: '#FFFFFF', alignSelf: 'center',
                        height: 40, width: '20%', justifyContent: 'center', borderWidth: 0,
                        marginLeft: -10, borderTopRightRadius: 35, borderBottomRightRadius: 35
                    }}>
                    </View> */}
                    <View  style={{
              alignSelf: 'flex-end',
              width: this.state.recording ? 60 : 40,
              height: this.state.recording ? 60 : 40,
              margin: this.state.recording ? 0 : 10,
              borderRadius: this.state.recording ? 30 : 20,
              backgroundColor: 'red',
              justifyContent: 'center',
              
            }}>
                        {/* <TouchableOpacity onPress={() => { this.sendMessage() }}>
                            <Icon name='arrowright' type='AntDesign' style={{ fontSize: 20, color: '#FFFFFF', alignSelf: 'center' }} />
                        </TouchableOpacity> */}
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
                </View>)}
               
                {/* </View> */}
                </>):(
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
        </GestureRecognizer>
          </SafeAreaView>
        )
      }
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      },
      reply:{
       justifyContent:'center',
       alignItems:'center',
       marginTop:45,
      },
      CloseButtonContainerStyles: {
          marginTop:resp(30),
          marginRight:resp(70),
        flex: 0.1,
        width: '20%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        
      },
      backButtonStyle: {
        margin: 10,
        height: 20,
        width: 20,
      },
      BackButtonContainer: {
        marginTop:40,
        marginLeft: 10,
        backgroundColor: 'white',
      },
      username:{
      marginTop:35,
      marginLeft:2,
      fontSize:15,
      fontWeight:"bold"
      },
      CloseButtonViewStyles:{
        marginLeft:resp(2),
            width:resp(60),
            height:resp(60),
            borderWidth: 2,
            borderRadius: 5,
            borderColor: '#F01738',
      },
      ImageContainer:{
          flex:0.75
      },
      sliderImageStyle: {
          marginTop:resp(10),
          alignContent:'center',
          alignItems:'center',
          alignSelf:'center',
          width:'99%',
          height: resp(500),
      },
})
export default StoryViewScreen