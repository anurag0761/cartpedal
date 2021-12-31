import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Dimensions,
  Modal,
  Share,
  ScrollView
} from 'react-native'
import resp from 'rn-responsive-font'
import CustomMenuIcon from './CustomMenuIcon'
import MenuIcon from './MenuIcon'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
// import {withNavigation} from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import ImagePicker from 'react-native-image-crop-picker';
import ProfileCustomMenuIcon from './ProfileCustomMenuIcon'
import firebase from 'react-native-firebase'
import SeeMore from 'react-native-see-more-inline'
import { DESTROY_SESSION } from "../../redux/actions/types";
import {BackHandler} from 'react-native'
import {isEmpty, isNull} from 'lodash'
import Contacts from 'react-native-contacts';
import {profileView, storiesAction, loggedStoriesAction,RecentDataAction,addStoryAction,resetStore} from '../../redux/actions';
import { connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {BASE_URL} from '../Component/ApiClient';
import {hp,wp} from '../Component/hightWidthRatio';
const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
console.disableYellowBox = true





const options = {
  title: 'Select Option',
  customButtons: [{name: 'fb', title: 'View Story'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

class DashBoardScreen extends Component {
  constructor (props) {
    super(props)
    console.log('props id', JSON.stringify(this.props))
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
      this.RecentUpdateCall = this.RecentUpdateCall.bind(this),
      this.ProfileViewCall = this.ProfileViewCall.bind(this),
      this.state = {
        userName: '',
        baseUrl: `${BASE_URL}`,
        userId: '',
        spinner: '',
        userAccessToken: '',
        isStoryModalVisible:false,
        phonenumber:'',
        about: '',
        NoData: '',
        userProfileData: '',
        avatar: null,
        user_stories: '',
        fcmtoken:'',
        newContacts:'',
        stories:'',
        newImageArr:[],
        loggeduserstory_avatar: null,
        pickedImage: require('../images/default_user.png'),
        RecentUpdateProduct: '',
        callUpdate:false
      }
  }

  showLoading () {
    this.setState({spinner: true})
  }

  hideLoading () {
    this.setState({spinner: false})
  }

  actionOnRow (item) {
    console.log('Selected Item :', item)
  }

  actionOnViewProfile (item) {
    console.log('Selected view Item :', item)
    // this.UserProfileCall();
    this.props.navigation.navigate('OpenForProfileScreen')
  }

  componentWillMount () {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    )
  }
  onShare = async (links) => {
    try {
      const result = await Share.share({
        message:
          `Get the product at ${links}`,
          url:`${links}`,
          
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  link =async(id,name)=>{
    const link = new firebase.links.DynamicLink(
      `https://play.google.com/store/apps/details?id=in.cartpedal&page=${name}&profileId=`+id,
      'cartpedal.page.link',
    ).android
      .setPackageName('com.cart.android')
      .ios.setBundleId('com.cart.ios');
  
  firebase.links()
    .createDynamicLink(link)
    .then((url) => {
      console.log('the url',url);
      this.onShare('http://'+url);
    });
  }
  forwardlink = async (userid,name) => {
    const link = new firebase.links.DynamicLink(
      `https://play.google.com/store/apps/details?id=in.cartpedal&page=${name}&profileId=`+
        userid,
      'cartpedal.page.link',
    ).android
      .setPackageName('com.cart.android')
      .ios.setBundleId('com.cart.ios');

    firebase
      .links()
      .createDynamicLink(link)
      .then((url) => {
        console.log('the url', url);
        //  this.sendMessage(url,userid);
        this.props.navigation.navigate('ForwardLinkScreen', {
          fcmToken: this.state.fcmtoken,
          PhoneNumber: this.state.phonenumber,
          userId: this.state.userId,
          userAccessToken: this.state.userAccessToken,
          msgids: 'http://' + url,
        });
      });
  };
  componentWillUnmount () {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    )
  }
  handleBackButtonClick () {
    // this.props.navigation.goBack();
    // if (this.props.navigation.state.routeName === DashBoardScreen){
    //   BackHandler.exitApp();
    // }
   
    // return true;

    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp()
      console.log('if excute')
      return true
    } else {
      this.props.navigation.goBack(null)

      console.log('else excute')
      return true
    }
  }
  async requestReadContactsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'App Premission',
          'message': 'Chat x App need permission.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let newArr=[];
        let phoneName=[]
        let sortData;
        Contacts.getAll().then(contacts => {
        //  console.log('contacts',JSON.stringify(contacts));
          contacts.map((item)=>{
            if(item.phoneNumbers!==undefined&&item.phoneNumbers.length>0){
              let obj={
                phoneNumber:item.phoneNumbers[0].number,
                name:item.displayName
              }
              newArr.push(item.phoneNumbers[0].number);
              phoneName.push(obj);
            // console.log('map function contacts',item.phoneNumbers[0].number);
            // console.log('given Name',item.displayName)
            sortData= phoneName.sort((a,b)=>a.name.localeCompare(b.name));
          //  console.log('sort contacts',sortData);
            
            }
          }) 
          // console.log('new array',newArr.join(','));
          //  console.log('new format array',JSON.stringify(phoneName));
          // console.log('new array',JSON.stringify(contacts));
          let itemContacts=newArr.join(',')
          this.setState({newContacts:newArr.join(',')})
          this.ContactListall(sortData);
          this.setState({phonenumber:sortData})
          AsyncStorage.setItem('@Phonecontacts',JSON.stringify(sortData));
          });
          
            
      } else {
        console.log("read contacts permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  } 
  blockuser=(block_id)=>{
    this.showLoading();
    let id=this.state.userId;
    let formData = new FormData();
      
    formData.append('user_id', id);
    formData.append('block_id',block_id);
    formData.append('type', 0);
    console.log('form data==' + JSON.stringify(formData));

  // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var fav = `${BASE_URL}api-user/block-fav-user`
    console.log('Add product Url:' + fav)
    fetch(fav, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token:this.state.fcmtoken,
        device_type: 'android',
        // Authorization: 'Bearer' + this.state.access_token,  
        Authorization:JSON.parse(this.state.userAccessToken), 
      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.code == '200') {
          alert('User is blocked successfully');
          this.ContactListall(this.state.phonenumber);
          // this.hideLoading();
        } else {
          //  this.setState({NoData:true});
           this.hideLoading();
        }
        console.log('User user ID==', JSON.stringify(responseData))
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })
      .done();
  }
  ContactListall(contacts) {
    // this.showLoading()
    // console.log('contacts',JSON.stringify({
    //   user_id:this.state.userId,type:0,lfor:0,contacts:contacts
    // }));
    // let formData = new FormData()

    // formData.append('user_id', JSON.parse(this.state.userId));
    // formData.append('type', 0);
    // formData.append('contacts',contacts);
    // formData.append('lfor',0);
    // console.log('form data==' + JSON.stringify(formData))

    // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var EditProfileUrl = `${BASE_URL}api-product/contact-list`
    // console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl,  {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization:JSON.parse(this.state.userAccessToken),
      },
      body:JSON.stringify({
        user_id:this.state.userId,type:0,lfor:0,contacts:contacts
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        //   this.hideLoading();
        if (responseData.code == '200') {
        //  Toast.show(responseData.message);
          // this.setState({ contactList: responseData.data.appcontact });
          // console.log('contacts list',JSON.stringify(responseData))
          let cartPadleContact=[]
          let nameofCartPadle=[]
          responseData.data.appcontact.map((item)=>{
          cartPadleContact.push(item.mobile);
          })
          let commaNumber=cartPadleContact.join(',');
            // console.log('cart padle',cartPadleContact.join(','));
          this.setState({appContacts:cartPadleContact.join(',')});
          // this.RecentShareCall(commaNumber);
          this.RecentUpdateCall(commaNumber);
        } else {
          // this.hideLoading()
          console.log(responseData.data);
        }

        //console.log('Edit profile response object:', responseData)
        // console.log('contact list response object:', JSON.stringify(responseData))
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
         this.hideLoading();
        console.error('error coming',error)
      })
      .done()
  }
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

  componentDidMount=async ()=> {
    this.focusListener = this.props.navigation.addListener("focus", () => {
    // this.requestCameraPermission();
    this.requestReadContactsPermission();
    AsyncStorage.getItem('@fcmtoken').then(token => {
      if (token) {
        this.setState({fcmtoken: JSON.parse(token)})
      }
    });
    AsyncStorage.getItem('@user_id').then(userId => {
      if (userId) {
        this.setState({userId: userId})
      }
    });
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        this.setState({ userAccessToken: accessToken },()=>{
          this.showLoading();
          this.ProfileViewCall();
          this.userStories();
          this.loggedUserstory(); 
        });

      }
    })

    // AsyncStorage.getItem('@user_name').then(userName => {
    //   if (userName) {
    //     this.setState({userName: JSON.parse(userName)})
    //     console.log('Edit user name Dhasbord ====' + userName)
       
    //   }
    // });
  });
  const notificationOpen = await firebase
  .notifications()
  .getInitialNotification();
  console.log('dashboard notification',notificationOpen)
// console.log(
//   JSON.parse(notificationOpen.notification.data.notify_msg),
//   'NotificationOpen',
// );
if (notificationOpen) {
  this.props.navigation.navigate('ChatDetailScreen', {
    userid: 2,
  });
}
  }

  customButton=()=>{
    this.setState({isStoryModalVisible: false});
    if(JSON.stringify(this.props.loggedStoriesData)!=JSON.stringify({})){
    if(this.props.loggedStoriesData.data[0].stories!=JSON.stringify({}))
    {
    if(this.state.loggeduserstory_avatar==null){
       const itemImage1=null;
       this.props.navigation.navigate('UserStoryPage',{images:itemImage1,storyImages:this.props.loggedStoriesData.data[0].stories,name:this.state.userName}) 
    }else{
     const itemImage=this.state.loggeduserstory_avatar;
      this.props.navigation.navigate('UserStoryPage',{images:itemImage,storyImages:this.props.loggedStoriesData.data[0].stories,name:this.state.userName}) 
    }
  }
}else{
  alert("No story available");
}
  }
  sendMessage = (UrlLink,userID) => {
    // console.log('user id', this.props.route.params.userid);
    // this.setState({message: '', height: 40});
    var raw = JSON.stringify({
      user_id: this.state.userId,
      toid: userID,
      msg_type: 'text',
      body: UrlLink,
      reply_id: '0',
      upload: [],
    });
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
          alert('forward link has been sent');
          // this.setState({visibleReply:true})
          console.log('asda', responseData);
        } else {
          console.log('logged user stories' + JSON.stringify(responseData));
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };
  addStoryApi=(data)=>{
    this.setState({addstoryload:true},()=>{
      this.props.addStoryAction(this.state.userId,this.state.userAccessToken,data);
    })

  }
  ListEmpty = () => {
    return (
      <View style={{justifyContent:'center',alignItems:'center'}}>
      <Text style={{ marginTop:120
   }}>{this.state.NoData?'No Record':null} </Text>
  </View>
    )
  }
 
  RecentUpdateCall (newContacts) {
    this.setState({callUpdate:true},()=>{
      this.props.RecentDataAction(this.state.userId, this.state.userAccessToken,newContacts);
    })
 
  }
  loggedUserstory=()=>{
      this.props.loggedStoriesAction(this.state.userId, this.state.userAccessToken);
  }
  userStories=()=>{
    this.props.storiesAction(this.state.userId, this.state.userAccessToken);
  }

  componentDidUpdate()  {
    // console.log('add story',this.props.recenterror,this.props.recentData)
    if(this.props.addStorySuccess && this.state.addstoryload){
      this.setState({addstoryload:false},()=>{
        this.props.loggedStoriesAction(this.state.userId, this.state.userAccessToken);
        this.hideLoading();
      })
    }
    // console.log('error of data',this.props.recenterror,this.state.callUpdate)
    if(this.props.recenterror && this.state.callUpdate){
      this.setState({callUpdate:false,NoData:true},()=>{
        this.hideLoading();
        }); 
    }
    // console.log('recent',this.props.recentDataSuccess,'data',this.state.callUpdate);
    if(this.props.recentDataSuccess && this.state.callUpdate){
      console.log('entered');
      this.setState({callUpdate:false,spinner:false});
    }
  }
    
  ProfileViewCall=()=>{
    // this.showLoading();
    let formData = new FormData()
    var urlprofile =
      `${BASE_URL}api-user/view-profile?user_id=`+this.state.userId
    console.log('profileurl :' + urlprofile)
    fetch(urlprofile, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.code == '200') {
          // console.log(responseData.data.name,responseData.data.avatar)
          if(responseData.data.name!==null){
            this.setState({userName:responseData.data.name});
          }
          if (responseData.data.avatar == null) {
            this.setState({avatar: null,loggeduserstory_avatar:null})
          } else {
            this.setState({avatar:responseData.data.avatar,loggeduserstory_avatar:responseData.data.avatar})
          }
          if (responseData.data.about !== null) {
            this.setState({about: responseData.data.about})
          }
          console.log(this.state.loggeduserstory_avatar,this.state.avatar);
        } else {
          console.log('profile')
          console.log('profile Data' + responseData);
        }
      })
      .catch(error => {
        console.error(error)
      })
      .done()
  }
  _renderTruncatedFooter = handlePress => {
    return (
      <Text style={{color: 'red', marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    )
  }
  _renderRevealedFooter = handlePress => {
    return (
      <Text style={{color: 'red', marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    )
  }
  logOut=()=>{
    AsyncStorage.removeItem('@user_id').then(succss=>{
      AsyncStorage.removeItem('@access_token').then(resul=>{
          this.props.navigation.navigate('LoginScreen');
      })
    })
  }
  openStoryModal(){
    this.setState({isStoryModalVisible: !this.state.isStoryModalVisible})
  }
  closeProfileModal= ()=> {
    this.setState({isStoryModalVisible: false})
  }
  openImageGallery() {
    this.setState({ isStoryModalVisible: !this.state.isStoryModalVisible })
  //  this.imageSelectDialog.openGallery()
  ImagePicker.openPicker({
    cropping: true,
    includeBase64:true
  }).then(image => {
    this.onImagePick(image)
    console.log('image pic===',image);
  });
  }
  onImagePick(response){
   // let newImage=this.state.newImageArr;
   this.showLoading();
    let imgOjc= {
      path:response.path,
        type:response.mime,
         data:response.data,
         fileName:response.modificationDate
    }
    let imageArray=[]
    imageArray.push(imgOjc);
    //this.state.newImageArr.push(imgOjc)
    //this.setState({newImageArr:imgOjc})
    console.log('imagepickethe',imageArray)
   // console.log('image in array in different format',this.state.newImageArr);
  //  this.uploadProfilePic();
  this.addStoryApi(imageArray);
  }

  openCamara() {
    this.setState({ isStoryModalVisible: !this.state.isStoryModalVisible})
   // this.imageSelectDialog.openCamera()
   ImagePicker.openCamera({
    cropping: true,
    includeBase64:true
  }).then(image => {
    this.onImagePick(image)
    console.log('pickedImage===',image);
  });
  }
  SendReportIssue() {
    console.log('working send report')
    let formData = new FormData()
    formData.append('user_id', this.state.userId)
    formData.append('reason','Report post')
    formData.append('message','Something went wrong with this post')
    console.log('form data==' + JSON.stringify(formData))
   // var otpUrl= 'http://cartpadle.atmanirbhartaekpahel.com/frontend/web/api-user/send-otp'
    
    var otpUrl =`${BASE_URL}api-user/report-problem`
    console.log('url:' + otpUrl)
    fetch(otpUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token:this.state.fcmtoken,
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
  render () {
    // const {resetStore}=this.props
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          color='#F01738'
          // textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                // resetStore
                AsyncStorage.removeItem('@is_login').then(succ=>{
                  this.logOut()
                })
               
              }}>
              <Text style={styles.backButtonStyle}>Log Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.TitleContainer}>
            <Image
              source={require('../images/logo_cart_paddle.png')}
              style={styles.LogoIconStyle}
            />
            <TouchableOpacity
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.TitleStyle}>Cartpedal</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              // this.props.navigation.navigate('StoryViewScreen');
              // this.props.navigation.navigate('SearchBarScreen')
            }}>
            {/* <Image
              source={require('../images/search.png')}
              style={styles.SearchIconStyle}
            /> */}
          </TouchableOpacity>
        </View>
        <Modal
              animationType='slide'
              transparent={true}
              useNativeDriver={true}
              visible={this.state.isStoryModalVisible}
              onRequestClose={() => this.closeProfileModal()}>
              <View style={styles.centeredView}>
                <View style={styles.ProfilemodalViewStyle}>
                <TouchableOpacity
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => {
                      this.closeProfileModal()
                    }}>
                    <Image
                      source={require('../images/modal_close.png')}
                      style={styles.CloseButtonStyle}
                    />
                  </TouchableOpacity>
                 
                  <Text style={styles.TitleProfileModalStyle}>
                    Choice Option
                  </Text>
                  <TouchableOpacity
                   onPress={() => {
                    this.openCamara();
                      
                    }}>
                  <Text style={styles.OptionsProfileModalStyle}>Camera</Text>
                  </TouchableOpacity>
                  
                 <TouchableOpacity
                  onPress={() => {
                    this.openImageGallery();
                    }}>
                 <Text style={styles.Options2ProfileModalStyle}>Gallery</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                 onPress={() => {
                      this.customButton();
                    }}>
                 <Text style={styles.Options2ProfileModalStyle}>View Story</Text>
                   </TouchableOpacity>
                </View>
              </View>
            </Modal>
        <View style={styles.MainContentBox}>
          <ScrollView>
            <View style={styles.hairline} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.storyItemBox}
                onPress={() => this.openStoryModal()}
                //this.coverPhotogallery()
                >
                <Image
                  source={this.state.loggeduserstory_avatar!=null?{uri:this.state.loggeduserstory_avatar}: 
                    this.state.pickedImage
                  }
                  style={styles.ImageViewStyle}
                />
                <Image
                  source={require('../images/status_add_icon.png')}
                  style={styles.StatusAddStyle}></Image>
                <Text style={styles.storyTextView}>Your Story</Text>
              </TouchableOpacity>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{flex: 1, flexDirection: 'row'}}
                data={this.props.storiesData}
                keyExtractor={item => item.StoryImage}
                renderItem={({item,index}) => {
                   return(
                    <View>
                      <TouchableOpacity
                        style={styles.storyItemBox}
                        onPress={() => {
                          console.log(item);
                          this.props.navigation.navigate('StoryViewScreen', {
                           position:index, images:item.avatar,storyImages:item.stories,name:item.name,userid:item.id,storyArray:this.props.storiesData
                          })
                        }
                        }>
                        <Image
                          source={
                            item.avatar == null
                              ? this.state.pickedImage
                              : {uri: item.avatar}
                          }
                          style={[styles.ImageViewStyleStory,{ borderColor:item.stories[0].viewer==1?'#06BE7E':'#F01738'}]}
                        />

                        <Text style={styles.storyTextView}>{item.name.substring(0,8)+".."}</Text>
                      </TouchableOpacity>
                    </View>
                  )
              
                }}
              />
            </View>

            <View style={styles.hairline} />

            <View style={styles.Profile2Container} 
            // onPress={()=>{this.props.navigation.navigate('ProfileScreen')}}
            >
              <View style={styles.Profile2ImageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ProfileScreen')
                  }}>
                  <Image
                    source={this.state.avatar!=null?{uri:this.state.avatar}:
                      this.state.pickedImage
                    }
                    style={styles.Profile2ImageViewStyle}
                  />
                  <Image
                    source={require('../images/status_add_largeicon.png')}
                    style={styles.StatusAddLargeStyle}></Image>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.Profile2InfoContainer} onPress={() => {
                    this.props.navigation.navigate('ProfileScreen')
                  }}>
                <Text style={styles.PersonNameStyle}>
                  {this.state.userName}
                </Text>
                <View style={{width:width*0.7}}>
                  {this.state.about!=''? (
                    <SeeMore
                    style={styles.ProfileDescription}
                    numberOfLines={3}
                    linkColor='red'
                    seeMoreText='read more'
                    seeLessText='read less'>
                      {this.state.about}
                      </SeeMore>
                  ) : null}
                </View>
              </TouchableOpacity>
              <View style={styles.RiyaMenuContainer}>
                <TouchableOpacity
                  style={styles.openButtonContainer}
                  onPress={() => {
                    // this.props.navigation.navigate('HomeScreen')
                    this.props.navigation.navigate('ProfileScreen')
                    //  Toast.show('CLicked Share Link', Toast.LONG)
                  }}>
                  <Text style={styles.openButtonStyle}>Open</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <CustomMenuIcon
                    menutext='Menu'
                    menustyle={{ 
                      // left:4,
                      // position:'absolute',
                      // flexDirection: 'row',
                      // justifyContent: 'flex-end',
                    }}
                    textStyle={{
                      color: 'white',
                    }}
                    option1Click={() => {
                      // this.BlockUserCall()
                      let name="ProfileScreen";
                       this.link(this.state.userId,name)
                      // Toast.show('CLicked Shared Link', Toast.LONG)
                    }}
                    option2Click={() => {
                      let name="DashBoardScreen";
                      this.forwardlink(this.state.userId,name)
                      // Toast.show('CLicked Forward Link', Toast.LONG)
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.RecentViewStyle}>
              <Text style={styles.RecentTextStyle}>RECENT UPDATES</Text>
            </View>
            <FlatList
              style={{flex: 1}}
              data={JSON.stringify(this.props.recentData)!=JSON.stringify({})?this.props.recentData:[]}
              keyExtractor={(item,index) => index}
              renderItem={({item,index}) => {
                // console.log('item of dashboard',item.products[1])
                return(
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('OpenForProfileScreen', {
                      id: item.id,
                      name: item.name,
                    })
                  }}
                  style={styles.itemBox}>
                  <View style={styles.box}>
                    <View style={styles.ProfileImageContainer}>
                      <TouchableOpacity>
                        <Image
                          source={
                            item.avatar == null
                              ? this.state.pickedImage
                              : {uri: item.avatar}
                          }
                          style={styles.ProfileImageViewStyle}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.ProfileInfoContainer}>
                      <Text style={styles.PersonNameStyle}>{item.name}</Text>
                      <View style={{marginLeft: resp(0),width:width*0.75}}>
                        {item.about ? (
                   <SeeMore style={styles.ProfileDescription} numberOfLines={2}  linkColor="red" seeMoreText="read more" seeLessText="read less">
                            {item.about.substring(0,50)+".."}
                            </SeeMore>
                        ) : null}
                      </View>
                      {/* <Text >{item.about}</Text> */}
                    </View>
                    <View style={styles.ListMenuContainer}>
                      <TouchableOpacity style={styles.messageButtonContainer}  onPress={() => {
                        this.props.navigation.navigate('ChatDetailScreen',{userid:item.id,username:item.name,userabout:item.about,useravatar:item.avatar,groupexit:false,groupId:"0",msg_type:"0",userphone:item.mobile})
                           }}>
                          <Image
                            source={require('../images/message_icon.png')}
                            style={styles.messageButtonStyle}></Image>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.ViewButtonContainer}
                        onPress={() => {
                          console.log('user id from api', item)
                          this.props.navigation.navigate(
                            'OpenForProfileScreen',
                            {id: item.id, name: item.name},
                          )
                          //  this.props.navigation.navigate('OpenForPublicDetail')
                        }}>
                        <Text style={styles.viewButtonStyle}>{'View All'}</Text>
                      </TouchableOpacity>

                      <MenuIcon
                        menutext='Menu'
                        menustyle={{
                          // right:15,
                          // position:'absolute',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}
                        textStyle={{
                          color: 'white',
                        }}
                        option1Click={() => {
                          let name="DashBoardScreen";
                         this.blockuser(item.id,name) 
                        }}
                        option2Click={() => {
                          let name="DashBoardScreen";
                          this.link(item.id,name)
                          // Toast.show('CLicked Shared Link', Toast.LONG)
                        }}
                        option3Click={() => {
                          this.forwardlink(item.id)
                          // Toast.show('CLicked Forward Link', Toast.LONG)
                        }}
                        option4Click={() => {
                          this.SendReportIssue()
                        }}
                      />
                    </View>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.columnView}>
                      <View style={styles.ImageContainer}>
                        <Image
                          source={item.products[0].image?{uri: item.products[0].image}:null}
                          style={styles.Image2Container}></Image>
                        <Text style={styles.itemNameStyle}>
                          {item.products[0].name}
                        </Text>
                        <Text style={styles.itemPriceStyle}>
                          {'\u20B9'}
                          {item.products[0].price}
                        </Text>
                      </View>
                    {item.products[1]?(<View style={styles.ImageContainer2}>
                        <Image
                          source={item.products[1].image?{uri: item.products[1].image}:null}
                          style={styles.Image2Container}></Image>
                        <Text style={styles.itemNameStyle}>
                          {item.products[1].name}
                        </Text>
                        <Text style={styles.itemPriceStyle}>
                          {'\u20B9'}
                          {item.products[1].price}
                        </Text>
                      </View>):null}
                      {item.products[2]?(<View style={styles.ImageContainer2}>
                        <Image
                         source={item.products[2].image?{uri: item.products[2].image}:null}
                          style={styles.Image2Container}></Image>
                        <Text style={styles.itemNameStyle}>
                          {item.products[2].name}
                        </Text>
                        <Text style={styles.itemPriceStyle}>
                          {'\u20B9'}
                          {item.products[2].price}
                        </Text>
                      </View>):null}
                      {item.products[3]?(<View style={styles.ImageContainer2}>
                        <Image
                          source={item.products[3].image?{uri: item.products[3].image}:null}
                          style={styles.Image2Container}></Image>
                        <Text style={styles.itemNameStyle}>
                          {item.products[3].name}
                        </Text>
                        <Text style={styles.itemPriceStyle}>
                          {'\u20B9'}
                          {item.products[3].price}
                        </Text>
                      </View>):null}
                    </View>
                    <View style={styles.hairline} />
                  </ScrollView>

                  <View style={styles.hairline} />
                </TouchableOpacity>
              )}
                    }
              ListEmptyComponent={this.ListEmpty}
            />
          </ScrollView>
        </View>
        
        <View style={styles.TabBox}>
          <View style={styles.tabStyle}>
            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('DashBoardScreen');
              }}>
              <Image
                source={require('../images/home_active_icon.png')}
                style={styles.StyleHomeTab}
              />

              <Text style={styles.bottomActiveTextStyle}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('OpenForPublicScreen')
              }}>
              <Image
                source={require('../images/group_inactive_icon.png')}
                style={styles.StyleOpenForPublicTab}
              />
              <Text style={styles.bottomInactiveTextStyle}>
                Open for Public
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('CartScreen')
              }}>
              <Image
                source={require('../images/cart_bag_inactive_icon.png')}
                style={styles.styleChartTab}
              />
              <Text style={styles.bottomInactiveTextStyleChart}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('ChatScreen')
              }}>
              <Image
                source={require('../images/chat_inactive_icon.png')}
                style={styles.StyleChatTab}
              />
              <Text style={styles.bottomInactiveTextStyle}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('SettingScreen')
                // this.props.navigation.navigate('AudioPlayer')
                
              }}>
              <Image
                source={require('../images/setting_inactive_icon.png')}
                style={styles.StyleSettingTab}
              />
              <Text style={styles.bottomInactiveTextStyle}>Setting</Text>
            </TouchableOpacity>
          </View>
        </View>
     
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Profile2Container: {
    color: '#fff',
    flexDirection: 'row',
  },
  PersonNameStyle: {
    marginTop: resp(5),
    width: resp(100),
    height: resp(20),
    color: '#000',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    
  },
  ProfileDescription: {
    marginTop: 5,
  
    width: resp(200),
    height: resp(50),
    color: '#7F7F7F',
    fontSize: resp(12),
  },
  Profile2ImageContainer: {
    // margin: resp(10),
    marginTop:hp(10),
    marginLeft:wp(5),
    flexDirection: 'column',
    flex: 0.2,
    width: resp(70),
    height: resp(70),
  },
  ProfileImageContainer: {
    // margin: resp(10),
    marginTop:hp(10),
    marginLeft:wp(5),
    flexDirection: 'column',
    flex: 0.2,
    width: wp(70),
    height: hp(70),
  },
  box: {
    marginTop: 5,
    width: resp(415),
    height: resp(75),
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  itemBox: {
    height: hp(290),
    backgroundColor: 'white',
    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 5,
    },
    elevation: 0,
  },
  storyItemBox: {
    // marginLeft: resp(6),
    // height: resp(90),
    // backgroundColor: 'white',
    // flexDirection: 'column',
    // shadowColor: 'black',
    // shadowOpacity: 0.2,
    // // shadowOffset: {
    // //   height: 1,
    // //   width: 1,
    // // },
    // elevation: 2,
  },
  Profile2ImageViewStyle: {
    width: resp(70),
    height: resp(70),

    borderRadius: resp(10),
  },
  ProfileImageViewStyle: {
    // margin: resp(10),
    width: wp(50),
    height: hp(50),
    borderRadius: resp(8),
  },
  RecentViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: resp(2),
    height: resp(25),
    backgroundColor: '#F1F0F2',
    width: '100%',
  },
  RecentTextStyle: {
    fontSize: resp(12),
    marginTop: resp(30),
    marginLeft: resp(10),
    height: resp(50),
    color: '#8E8E8E',
  },
  spinnerTextStyle: {
    color: '#F01738',
  },
  Options2ProfileModalStyle: {
    alignContent:'flex-start',
   marginTop:resp(5),
    color: '#000',
    marginBottom:10,
    width: resp(207),
    fontSize: resp(16),
  },
  margintop: {
    marginTop: '10',
  },
  ImageViewStyle: {
    margin: resp(6),
    width: resp(55),
    height: resp(55),
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#F01738',
  },
  ImageViewStyleStory: {
    margin: resp(6),
    width: resp(55),
    height: resp(55),
    borderWidth: 2,
    borderRadius: 5,
   
  },
  hairline: {
    backgroundColor: '#C8C7CC80',
    height: 2,
    width: '100%',
  },

  MainContentBox: {
    flex: 1,
  },

  TabBox: {
    flex: 0.1,
    color: '#000',
  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  TitleProfileModalStyle: {
    alignContent:'flex-start',
    fontWeight: 'bold',
    color: '#000',
    
    width: resp(207),
    fontSize: resp(16),
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 80,
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  SearchIconStyle: {
    margin: 5,
    marginRight: 20,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: resp(20),
    textAlign: 'center',
  },
  CloseButtonStyle: {
  
    alignSelf: 'flex-end',
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 20,
  },
  ProfilemodalViewStyle: {
   
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  bottomActiveTextStyle: {
    color: '#FB3954',
    fontSize: resp(10),
    marginTop: 5,
    textAlign: 'center',
  },

  Image2Container: {
    flexDirection: 'column',
    width: wp(90),
    height: hp(130),
    backgroundColor: 'white',
    marginTop:hp(5),
    borderRadius: resp(5),
  },
  ImageContainer: {
    marginTop: resp(-8),
    flexDirection: 'column',
    width: wp(90),
    height: hp(180),
    backgroundColor: 'white',
    marginRight: resp(3),
    marginBottom:resp(10),
    marginLeft: resp(2),
    borderRadius: resp(5),
  },
  ImageContainer2: {
    marginTop: resp(-8),
    flexDirection: 'column',
    width: wp(90),
    height: hp(180),
    backgroundColor: 'white',
    marginRight: resp(3),
    marginBottom:resp(10),
    borderRadius: resp(5),
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
  OptionsProfileModalStyle: {
    alignContent:'flex-start',
   marginTop:resp(10),
    color: '#000',
    width: resp(207),
    marginBottom:10,
    fontSize: resp(16),
  },
  StyleHomeTab: {
    marginTop: resp(5),
    width: resp(30),
    height: resp(28),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StatusAddStyle: {
    width: resp(20),
    height: resp(20),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', //Here is the trick
    bottom: resp(15),
    left: resp(3),
    marginLeft: resp(45),
  },
  StatusAddLargeStyle: {
    marginTop: resp(0),
    marginLeft: resp(50),
    width: resp(25),
    height: resp(25),
    position: 'absolute', //Here is the trick
    bottom: resp(-2),
  },
  Profile2InfoContainer: {
    color: '#fff',
    marginTop:resp(8),
    flexDirection: 'column',
    backgroundColor:'white',
    flex: 0.6,
    width: resp(70),
    height: resp(70),
  },
  ProfileInfoContainer: {
    // marginLeft:wp(5),
    backgroundColor:'white',
    marginTop: hp(15),
    flexDirection: 'column',
    flex: 0.7,
    width: wp(70),
    height: hp(50),
  },
  sliderMenuContainer: {
    marginTop: resp(20),
    marginRight: resp(-15),
    position: 'absolute',
    top: 0,
    right: 0,
    width: resp(28),
    height: resp(28),
    borderRadius: resp(20),
    backgroundColor: '#9da1a3',
  },
  RiyaMenuContainer: {
  flex:0.22,
    marginTop: resp(5),
    flexDirection: 'row',
    // width: resp(80),
    // height: resp(40),
  },
  ListMenuContainer: {
    marginTop: resp(20),
    flexDirection: 'row',
    flex: 0.47,
    alignContent:'flex-end',
    width: resp(0),
    height: resp(45),
  },
  openButtonStyle: {
    color: '#06BE7E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(10),
    fontSize:resp(14)
  },
  viewButtonStyle: {
    color: '#000',
    marginRight: resp(-20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(4),
  },

  openButtonContainer: {
    marginRight: 0,
    width: resp(55),
    height: resp(24),
    borderRadius: resp(20),
    backgroundColor: '#e6f7f2',
  },
  messageButtonContainer: {
    marginTop: resp(2),
    width: resp(20),
    height: resp(20),
    borderRadius: resp(50),
    backgroundColor: '#ebced7',
  },
  messageButtonStyle: {
    marginTop: resp(5),
    color: '#F01738',
    width: resp(9),
    height: resp(9),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewButtonContainer: {
    width: resp(60),
    height: resp(24),
    backgroundColor: '#fff',
  },

  StyleOpenForPublicTab: {
    marginTop: resp(11),
    marginRight: resp(10),
    width: resp(38),
    height: resp(23),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleChartTab: {
    marginTop: resp(9),
    width: resp(30),
    height: resp(30),
    marginLeft: resp(10),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  StyleChatTab: {
    marginTop: resp(9),
    width: resp(30),
    height: resp(30),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StyleSettingTab: {
    marginTop: resp(9),
    width: resp(30),
    height: resp(30),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabStyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: resp(60),
    shadowColor: '#ecf6fb',
    elevation: resp(20),
    shadowColor: 'grey',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: resp(0),
  },
  columnView: {
    flexDirection: 'row',
    width: '100%',
    // marginLeft: resp(5),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonStyle: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  storyTextView: {
    color: '#887F82',
    fontSize: resp(10),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  itemNameStyle: {
  
    color: '#887F82',
    width:'100%',
    marginLeft: resp(7),
    fontSize: resp(10),
  },
  itemPriceStyle: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: resp(7),
    fontSize: resp(13),
  },
})
// function mapDispatchToProps(dispatch){  
//   console.log('dispatch',dispatch);
//   return {
//     actions: bindActionCreators(RecentDataAction, dispatch),
// };
// }
function mapStateToProps(state) {
  const { isLoading, data, success } = state.signinReducer
  const { data: storiesData, success: storiesSuccess } = state.storiesReducer
  const { data: loggedStoriesData, success: loggedStoriesSuccess } = state.loggedStoriesReducer
   const {data:recentData,success:recentDataSuccess,isLoading:loadingRecentData,error:recenterror}= state.RecentDataReducer
   const {success:addStorySuccess,data:addStorydata} = state.addStoryReducer;
  return {
    isLoading, data, success, storiesData,loadingRecentData,recenterror, storiesSuccess, loggedStoriesData, loggedStoriesSuccess,recentData,recentDataSuccess,addStorySuccess
  }
}


export default connect(mapStateToProps, { profileView, storiesAction, loggedStoriesAction,RecentDataAction,addStoryAction})(DashBoardScreen);

// export default withNavigation(DashBoardScreen)
