// import React from 'react'
// import { View, Text } from "react-native";
// import {createStackNavigator} from 'react-navigation-stack'
// import {createAppContainer, StackActions} from 'react-navigation'
// import LoginScreen from './Component/Screens/LoginScreen'
// import SplashScreen from './Component/Screens/SplashScreen'
// import SignUPScreen from './Component/Screens/SignUPScreen'
// import ForgotPasswordScreen from './Component/Screens/ForgotPasswordScreen'
// import ResetPasswordScreen from './Component/Screens/ResetPasswordScreen'
// import SignUPWithOtpScreen from './Component/Screens/SignUPWithOtpScreen'
// import PhoneScreen from './Component/Screens/PhoneScreen'
// import DashBoardScreen from './Component/Screens/DashBoardScreen'
// import OpenForPublicScreen from './Component/Screens/OpenForPublicScreen'
// import CartScreen from './Component/Screens/CartScreen'
// import ChatScreen from './Component/Screens/ChatScreen'
// import SettingScreen from './Component/Screens/SettingScreen'
// import ProfileScreen from './Component/Screens/ProfileScreen'
// import UploadCoverPhotoScreen from './Component/Screens/UploadCoverPhotoScreen'
// import StoryViewScreen from './Component/Screens/StoryViewScreen'
// import ForgetOtpScreen from './Component/Screens/ForgetOtpScreen'
// import AddProductScreen from './Component/Screens/AddProductScreen'
// import HomeScreen from './Component/Screens/HomeScreen';
// import EditProductScreen from './Component/Screens/EditProductScreen'
// import ProductDetailScreen from './Component/Screens/ProductDetailScreen'
// import CartPlaceScreen from './Component/Screens/CartPlaceScreen'
// import OderPlacedScreen from './Component/Screens/OderPlacedScreen'
// import OderReceivedScreen from './Component/Screens/OderReceivedScreen'
// import ShareWithScreen from './Component/Screens/ShareWithScreen'
// import CartViewScreen from './Component/Screens/CartViewScreen'
// import OderPlacedViewScreen from './Component/Screens/OderPlacedViewScreen'
// import AccountScreen from './Component/Screens/AccountScreen'
// import BackUpChats from './Component/Screens/BackUpChats'
// import HelpScreen from './Component/Screens/HelpScreen';
// import NotificationsScreen from './Component/Screens/NotificationsScreen';
// import PrivacyScreen from './Component/Screens/PrivacyScreen';
// import OpenForProfileScreen from './Component/Screens/OpenForProfileScreen';
// import GeneralTab from './Component/Screens/GeneralTab';
// import FavouriteTab from './Component/Screens/FavouriteTab' ;
// import OpenForPublicDetail from './Component/Screens/OpenForPublicDetail';
// import FliterScreen from './Component/Screens/FliterScreen';
// import SearchBarScreen from './Component/Screens/SearchBarScreen';
// // import EditProductHarshit from './Component/Screens/EditProductHarshit';
// import UpdateProductScreen from './Component/Screens/UpdateProductScreen';
// import FullViewProfileScreen from './Component/Screens/fullViewProfileScreen';
// import AddGroupMember from './Component/Screens/AddGroupMember';
// import ImageHome from './Component/Screens/ImageHome';
// import ProductDetailImageFullView from './Component/Screens/ProductDetailImageFullView';
// import ChatDetailScreen from './Component/Screens/ChatDetailScreen'
import AsyncStorage from '@react-native-community/async-storage';
// import ProfileStory from './Component/Screens/ProfileStory';
// import ViewProfileScreen from './Component/Screens/ViewProfileScreen';
// import PushNotification from 'react-native-push-notification';
// import ProductListScreen from './Component/Screens/ProductListScreen'
import firebase from 'react-native-firebase';
import { pushNotifications } from './Component/Screens/services';
// import UserStoryPage from './Component/Screens/UserOwnStoryPage';
// import AddMoreShare from './Component/Screens/addMoreShare';
// import MyWebComponent from './Component/Screens/webViewReactnative';
// import FaqWebPanel from './Component/Screens/faqWebPanel';
// import AppInfo from './Component/Screens/AppInfo';
// import Contactus from './Component/Screens/Contactus'
// import CartDetailsScreen from './Component/Screens/CartDetailsScreen';
// import OrderRecievedViewScreen from './Component/Screens/OrderReceviedViewScreen';
// import SettingFullView from './Component/Screens/SettingFullView';
// import {VideoProcessScreen} from './Component/Screens/VideoProcessScreen';
// import ContactsListScreen from './Component/Screens/ContactsListScreen';

// already commented
// import VideoCall from './Component/Screens/VideoCall';
// import VoiceCall from './Component/Screens/voiceCall';

// import ProductMasterUpdate from './Component/Screens/ProductMaster'
// import NewContactListScreen from './Component/Screens/NewContactListScreen';
// import ForwardMessageScreen from './Component/Screens/ForwardMessageScreen';
// import ProductMasterImage from './Component/Screens/ProductMasterImageSharingPage';
// import ChatProfile from './Component/Screens/chatProfile';
// import ChatGroupListScreen from './Component/Screens/ChatGroupList';
// import ProvideGroupName from './Component/Screens/ProvideGroupName';
// import EditImageUpdateProduct from './Component/Screens/EditImageUpdateProduct';
// import ForwardLinkScreen from './Component/Screens/ForwardLinkScreen';
// import GroupProfile from './Component/Screens/GroupProfile';
// import ChangePassword from './Component/Screens/ChangePassword';
// import AdminReport from './Component/Screens/AdminReport'
// import ReportIssue from './Component/Screens/ReportIssue';
// import ProductMasterSaveScreen from './Component/Screens/ProductMatserSaveScreen';
// import AudioPlayer from './Component/Component/AudioPlayer';
// import { notif_token } from './PushNotification/NotificationHandler';
// import NotifService from './PushNotification/NotifService';
pushNotifications.configure();
const messaging = firebase.messaging();

messaging.hasPermission()
  .then((enabled) => {
    console.log('enabled',enabled);
      if (enabled) {

          messaging.getToken()
              .then(token => { 
                console.log("fcm Token",token)  
                AsyncStorage.setItem('@fcmtoken',JSON.stringify(token));
              })
              .catch(error => { /* handle error */ console.log('erorr',error)});
      } else {
          messaging.requestPermission()
              .then(() => {
                console.log('got permission');
                /* got permission */ })
              .catch(error => {
                console.log('not got permission');
                 /* handle error */ });
      }
  })
  .catch(error => { /* handle error */ });

  firebase.notifications().onNotification((notification) => {
     console.log('uper notification',notification);
    const { title, body } = notification;
    alert(notification)

  });

// const NavStack = createStackNavigator(
//   {
//     // eslint-disable-next-line no-trailing-spaces

//     LoginScreen: {screen: LoginScreen},
//     SplashScreen: {screen:SplashScreen},
//     SignUPScreen:{screen:SignUPScreen},
//     ForgotPasswordScreen:{screen:ForgotPasswordScreen},
//     ResetPasswordScreen: {screen:ResetPasswordScreen},
//     SignUPWithOtpScreen :{screen:SignUPWithOtpScreen},
//     PhoneScreen :{screen:PhoneScreen},

//     DashBoardScreen:{screen:DashBoardScreen},
//     OpenForPublicScreen:{screen:OpenForPublicScreen},
//     CartScreen :{screen:CartScreen},
//     ChatScreen:{screen:ChatScreen},
//     SettingScreen:{screen:SettingScreen},
//     ProfileScreen:{screen:ProfileScreen},
//     UploadCoverPhotoScreen:{screen:UploadCoverPhotoScreen},
//     StoryViewScreen :{screen:StoryViewScreen},
//     ForgetOtpScreen:{screen:ForgetOtpScreen},
//     AddProductScreen:{screen:AddProductScreen},
//     AccountScreen: {screen:AccountScreen},
//     BackUpChats: {screen:BackUpChats},
//     HelpScreen:{screen:HelpScreen},
//     NotificationsScreen:{screen:NotificationsScreen},
//     PrivacyScreen:{screen:PrivacyScreen},
//     OpenForProfileScreen:{screen:OpenForProfileScreen},
//     GeneralTab :{screen:GeneralTab},
//     FavouriteTab: {screen:FavouriteTab},
//     OpenForPublicDetail:{screen:OpenForPublicDetail},
//     FliterScreen :{screen:FliterScreen},
//     SearchBarScreen:{screen:SearchBarScreen},
//     // EditProductHarshit:{screen:EditProductHarshit},
//     UpdateProduct:{screen:UpdateProductScreen},
//     FullViewProfileScreen:{screen:FullViewProfileScreen},
//     ImageHome:{screen:ImageHome},
//     ProductDetailImageFullView:{screen:ProductDetailImageFullView},
//     ProfileStory:{screen:ProfileStory},
//     HomeScreen : {screen : HomeScreen},
//     EditProductScreen :  {screen : EditProductScreen},
//     ProductDetailScreen : {screen : ProductDetailScreen},
//     ViewProfileScreen:{screen:ViewProfileScreen},
//     ProductListScreen:{screen:ProductListScreen},
//     UserStoryPage:{screen:UserStoryPage},
//     CartPlaceScreen :{screen:CartPlaceScreen},
//     OderPlacedScreen:{screen:OderPlacedScreen},
//     OderReceivedScreen:{screen:OderReceivedScreen},
//     CartDetailsScreen:{screen:CartDetailsScreen},
//     OrderRecievedViewScreen:{screen:OrderRecievedViewScreen},
//     SettingFullView:{screen:SettingFullView},
//     CartViewScreen :{screen:CartViewScreen},
//     OderPlacedViewScreen:{screen:OderPlacedViewScreen},
//     ShareWithScreen : {screen :ShareWithScreen},     
//     ChatDetailScreen : {screen :ChatDetailScreen},     
//     AddMoreShare:{screen:AddMoreShare},
//     MyWebComponent:{screen:MyWebComponent},
//     FaqWebPanel:{screen:FaqWebPanel},
//     AppInfo:{screen:AppInfo},
//     Contactus:{screen:Contactus},
//     VideoProcessScreen: {screen: VideoProcessScreen},
//     ContactsListScreen: {screen: ContactsListScreen},
//     // VideoCall:{screen:VideoCall},
//     AddGroupMember:{screen:AddGroupMember},
//     // VoiceCall:{screen:VoiceCall},
//     ProductMasterUpdate:{screen:ProductMasterUpdate},
//     ForwardMessageScreen: {screen: ForwardMessageScreen},
//     NewContactListScreen: {screen: NewContactListScreen},
//     ChatProfile:{screen:ChatProfile},
//     ChatGroupListScreen:{screen:ChatGroupListScreen},
//     ProvideGroupName:{screen:ProvideGroupName},
//     EditImageUpdateProduct:{screen:EditImageUpdateProduct},
//     ForwardLinkScreen:{screen:ForwardLinkScreen},
//     GroupProfile:{screen:GroupProfile},
//     ChangePassword:{screen:ChangePassword},
//     AdminReport:{screen:AdminReport},
//     ReportIssue:{screen:ReportIssue},
//     ProductMasterImage:{screen:ProductMasterImage},
//     ProductMasterSaveScreen:{screen:ProductMasterSaveScreen},
//     AudioPlayer:{screen:AudioPlayer}
//   },
//   {

//     initialRouteName: 'SplashScreen',
//     headerMode: 'none',
//     defaultNavigationOptions: ({navigation}) => ({
//       animationEnabled: false,
//     })


//   },


// );



// const Apps = createAppContainer(NavStack)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainStack } from './Routes';
import  initStore  from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

const { store, persistor } = initStore();
export default class App extends React.Component {
  constructor(props) {
    super(props);
    // this.notif = new NotifService(this.onRegister, this.onNotification);
  }
  render() {
    return (
      <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
      </PersistGate>
    </Provider>
     
    )
  }
}


// export default function App() {
//   return (
//     <NavigationContainer>
//       <AuthStack />
//     </NavigationContainer>
//   );
// }
