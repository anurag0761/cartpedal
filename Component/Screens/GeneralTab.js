import React, {Component, } from 'react'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Share,
   TouchableHighlight
} from 'react-native'
import resp from 'rn-responsive-font'
import Toast from 'react-native-simple-toast'
import ReadMore from 'react-native-read-more-text'
import MenuIcon from './MenuIcon'
import Spinner from 'react-native-loading-spinner-overlay';
import SeeMore from 'react-native-see-more-inline';
import firebase from 'react-native-firebase';
import {hp,wp} from '../Component/hightWidthRatio';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;
import {BASE_URL} from '../Component/ApiClient';


class GeneralTab extends Component {
  constructor (props) {
    super(props);
    this.RecentShareCall = this.RecentShareCall.bind(this);
    this.AddFavourite = this.AddFavourite.bind(this);
    this.state = {
      RescentProduct:'',
      NoData:'',
      spinner:'',
      userNo:'',
      block_id:'',
      userAccessToken:'',
      favourite:'',
      PhoneNumber:'',
      fcmToken:'',
      currentUserMobile:'',
      appContacts:'',
      redIcon:require('../images/Heart_icon.png'),
      whiteIcon:require('../images/dislike.png'),
      avatar:'',
      pickedImage:require('../images/default_user.png'),
    }
    console.log('this props',JSON.stringify(this.props));
  }
  showLoading() {
    this.setState({ spinner: true });
  }

  hideLoading() {
    this.setState({ spinner: false });
  }

  ContactListall() {
    AsyncStorage.getItem('@Phonecontacts').then((NumberFormat=>{
      if(NumberFormat){
        let numID=JSON.parse(NumberFormat)
     
    this.showLoading()
    console.log('form data==' + JSON.stringify(numID))
    // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var EditProfileUrl = `${BASE_URL}api-product/contact-list`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl, {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmToken,
        device_type: 'android',
        Authorization:JSON.parse(this.state.userAccessToken),
      },
      body:JSON.stringify({
        user_id:this.state.userNo,type:0,lfor:0,contacts:numID
      }),
    })

      .then(response => response.json())
      .then(responseData => {
        //   this.hideLoading();
        if (responseData.code == '200') {
        //  Toast.show(responseData.message);
          this.setState({ contactList: responseData.data.appcontact });
          let cartPadleContact=[]
          let nameofCartPadle=[]
          responseData.data.appcontact.map((item)=>{
          cartPadleContact.push(item.mobile);
          })
          let commaNumber=cartPadleContact.join(',');
            console.log('cart padle',cartPadleContact.join(','));
          this.setState({appContacts:cartPadleContact.join(',')});
          this.RecentShareCall(commaNumber);
        } else {
          this.hideLoading()
          console.log(responseData.data);
        }

        //console.log('Edit profile response object:', responseData)
        console.log('contact list response object:', JSON.stringify(responseData))
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
         this.hideLoading();
        console.error(error)
      })
      .done()
    }
  }))
  }
  async componentDidMount() {
    // if(this.props.navigation.isFocused()){    
this.showLoading();
console.log('component',this.props); 
AsyncStorage.getItem('@Phonecontacts').then((NumberFormat=>{
  if(NumberFormat){
    let numID=JSON.parse(NumberFormat)
    this.setState({PhoneNumber:numID})
  }
}));
AsyncStorage.getItem('@current_usermobile').then((mobile)=>{
  if(mobile){
    this.setState({currentUserMobile:JSON.parse(mobile)});
    console.log('mobile number ',this.state.currentUserMobile);
  }else{
    console.log('no contacts');
  }
  });
AsyncStorage.getItem('@access_token').then((accessToken) => {
  if (accessToken) {
    this.setState({ userAccessToken: accessToken });
    console.log("Edit access token ====" + accessToken);
   
   
  }
});
AsyncStorage.getItem('@fcmtoken').then((token) => {
  console.log("Edit user id token=" +token);
  if (token) {
    this.setState({ fcmToken: token });
   
  }
});
     AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
          this.setState( { userNo: userId });
          this.ContactListall()
          console.log("Edit user id Dhasbord ====" + userId);
      }
  });
  
  }
  _handleTextReady = () => {
    console.log('ready!');
  }

  ListEmpty = () => {
    return (
         <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{ marginTop:120
         }}>{this.state.NoData?'No Record':null} </Text>
        </View>
    );
  };
  AddFavourite(block_id){
    this.showLoading();
    let id=this.state.userNo;
    let formData = new FormData();
      
    formData.append('user_id', id);
    formData.append('block_id',block_id);
    formData.append('type', 1);
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
      this.hideLoading();
        if (responseData.code == '200') {
          this.ContactListall();
        //  this.props.navigation.navigate('StoryViewScreen')
         // Toast.show(responseData.message);
        //  this._b.FavouriteListCall
          this.setState({NoData:false},()=>{
            this.ContactListall();
            //this.props.navigation.navigate('OpenForPublicScreen');
          });
          
          // this.RecentShareCall();
        } else {
          // alert(responseData.data);
          // alert(responseData.data.password)
           this.setState({NoData:true});
        }

        console.log('response object:', responseData)
        console.log('User user ID==', JSON.stringify(responseData))
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })
      .done();
    
  }

  RecentShareCall(contacts) {
    let formData = new FormData()
      
      formData.append('user_id', this.state.userNo)
      formData.append('type', 0)
      formData.append('public',1)
      formData.append('contact',contacts)
      console.log('form data==' + JSON.stringify(formData))

    // var CartList = this.state.baseUrl + 'api-product/cart-list'
      var RecentShare = `${BASE_URL}api-user/recent-share`
      console.log('Add product Url:' + RecentShare)
      console.log('form data general tab',JSON.stringify(formData));
      fetch(RecentShare, {
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
        this.hideLoading();
          if (responseData.code == '200') {
            console.log('general Data',JSON.stringify(responseData));
          //  this.props.navigation.navigate('StoryViewScreen')
         //   Toast.show(responseData.message);
         if(responseData.data.length>0){
         if(responseData.data[0].avatar==null){
          this.setState({avatar:''})
        }else{
          this.setState({avatar:responseData.data[0].avatar});
        }
            this.setState({RescentProduct:responseData.data});
            console.log("value",responseData.data[0].id);
            this.setState({block_id:responseData.data[0].id});
            console.log('fevtert========',responseData.data[0].favourite);
            this.setState({favourite:responseData.data[0].favourite})
          // this.SaveProductListData(responseData)
      }else{
        this.setState({NoData:true});
      }
          } else {
            // alert(responseData.data);
            // alert(responseData.data.password)
             this.setState({NoData:true});
          }

          console.log('response object:', responseData)
          console.log('User user ID==', JSON.stringify(responseData))
          // console.log('access_token ', this.state.access_token)
          //   console.log('User Phone Number==' + formData.phone_number)
        })
        .catch(error => {
        //  this.hideLoading();
          console.error(error)
        })

        .done()
      }
      onShare = async (links) => {
        try {
          const result = await Share.share({
            message:
              `Get the product at ${links}`,
              url:`${links}`
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
      blockuser=(block_id)=>{
        this.showLoading();
        let id=this.state.userNo;
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
            device_token:this.state.fcmToken,
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
              this.ContactListall();
              this.hideLoading();
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
    link =async(id)=>{
      const link = new firebase.links.DynamicLink(
        'https://play.google.com/store/apps/details?id=in.cartpedal&page=OpenForPublicDetail&profileId=' +
          id,
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
    forwardlink = async (userid) => {
      const link = new firebase.links.DynamicLink(
        'https://play.google.com/store/apps/details?id=in.cartpedal&page=OpenForPublicDetail&profileId=' +
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
            fcmToken: this.state.fcmToken,
            PhoneNumber: this.state.PhoneNumber,
            userId: this.state.userNo,
            userAccessToken: this.state.userAccessToken,
            msgids: 'http://' + url,
          });
        });
    };
      navigateToSettings = () => {
        // const navigateAction = NavigationActions.navigate({ routeName: 'OpenForPublicDetail' });
        // this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(
          CommonActions.navigate({
            name: 'OpenForPublicDetail',
          })
        );
      }
      SendReportIssue() {
        console.log('working send report')
        let formData = new FormData()
        formData.append('user_id', this.state.userNo)
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

  render () {
    return (
      <SafeAreaView style={styles.container}>
       <Spinner
          visible={this.state.spinner}
          color='#F01738'
          // textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
         {/* <FavouriteTab
                  ref={(ref) => this.favouriteTab = ref}
                  style={{ position: 'absolute', end: 10 }}
                 
                /> */}
          <ScrollView>
            <View style={styles.hairline} />
 
            <FlatList
              style={{flex: 1}}
              data={this.state.RescentProduct}
              keyExtractor={item => item.personName}
              renderItem={({item,index}) => {
                // console.log('general data',item)
                return(
                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('OpenForPublicDetail',{id:item.id,name:item.name});
                  // this.navigateToSettings()
                }}>
                <View style={styles.itemBox} >
      <View style={styles.box}>
        <View style={styles.ProfileImageContainer}  >
        
            <Image
              source={item.avatar==null?(this.state.pickedImage):{uri:item.avatar}}
              style={styles.ProfileImageViewStyle}
            />    
        </View>
        <View style={styles.ProfileInfoContainer}>
          <Text style={styles.PersonNameStyle}>{item.name}</Text> 
          <View style={{marginLeft:resp(0),width:width*0.8}}>
                  {item.about ? (
                    <SeeMore
                      numberOfLines={4}
                      linkColor='red'
                      seeMoreText='read more'
                      seeLessText='read less'>
                      {item.about.substring(0,50)+".."}
                    </SeeMore>
                  ) : null}
                </View>
                
        </View>
        <View style={styles.ListMenuContainer}>
          <TouchableOpacity style={styles.messageButtonContainer}  onPress={() => {
            console.log('id of user',item.id);
            this.props.navigation.navigate('ChatDetailScreen',{userid:item.id, username:item.name,useravatar:item.avatar, groupexit:false,groupId:"0",msg_type:"0",userphone:item.mobile})
                      }}>
              <Image
                source={require('../images/message_icon.png')}
                style={styles.messageButtonStyle}></Image>
          </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.AddFavourite(item.id)}} style={styles.messageButtonContainer}>
              <Image
                source={item.favourite==1?this.state.redIcon:this.state.whiteIcon}
                style={[styles.heartButtonStyle,{width:item.favourite==1?resp(11):resp(18),height:item.favourite==1?resp(9):resp(18),marginTop:item.favourite==1?resp(4):resp(0)}]}></Image>
            </TouchableOpacity>
          <TouchableOpacity
           onPress={() => {
            this.props.navigation.navigate('OpenForPublicDetail',{id:item.id,name:item.name});
          }}>
            <View style={styles.ViewButtonContainer}>
              <Text style={styles.viewButtonStyle}>View All</Text>
            </View>
          </TouchableOpacity>
          <MenuIcon
            menutext='Menu'
            menustyle={{
              marginRight: 5,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop:3
            }}
            textStyle={{
              
              color: 'white',
            }}
            option1Click={() => {
              this.blockuser(item.id) 
            }}
            option2Click={() => {
              this.link(item.id)
              // Toast.show('CLicked Share Link', Toast.LONG)
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
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.columnView}>
          <View style={styles.ImageContainer} >
            <Image
              source={item.products[0].image?{uri:item.products[0].image}:this.state.pickedImage}
              style={styles.ImageContainer}></Image>
            <Text style={styles.itemNameStyle}>{item.products[0].name}</Text>
            <Text style={styles.itemPriceStyle}>
              {'\u20B9'}
              {item.products[0].price}
            </Text>
          </View> 
         {item.products[1]?(<View style={styles.ImageContainer} >
            <Image
             source={item.products[1].image?{uri:item.products[1].image}:this.state.pickedImage}
              style={styles.ImageContainer}></Image>
            <Text style={styles.itemNameStyle}>{item.products[1].name}</Text>
            <Text style={styles.itemPriceStyle}>
              {'\u20B9'}
              {item.products[1].price}
            </Text>
          </View>):null }     
        </View>
        <View style={styles.hairline} />
      </ScrollView>
      <View style={styles.hairline} />
    </View>
    </TouchableOpacity>
              )}
          }
              ListEmptyComponent={this.ListEmpty}
            />
          </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6F9FE',
  },
  PersonNameStyle: {
    marginTop: resp(10),
    width: resp(100),
    height: resp(20),
    color: '#000',
    fontWeight: 'bold',
  },
  ProfileDescription: {
    marginLeft: resp(-3),
    width: resp(100),
 
    height: resp(50),
    color: '#7F7F7F',
    fontSize: resp(12),
  },

  ProfileImageContainer: {
    // margin: resp(10),
    marginLeft:wp(5),
    marginTop:hp(10),
    flexDirection: 'column',
    flex: 0.2,
    backgroundColor:'white',
    width: wp(70),
    height: wp(70),
  },
  box: {
    marginTop: resp(5),
    width: wp(415),
    height: hp(75),
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: resp(2),
      width: resp(5),
    },
    elevation: 0,
  },
  itemBox: {
    height: hp(375),
    width:width,
    backgroundColor: 'white',
    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: resp(1),
      width: resp(5),
    },
    elevation: 0,
  },
  ProfileImageViewStyle: {
    marginTop: resp(10),

    width: wp(50),
    height: hp(50),
    borderRadius: resp(8),
  },
  RecentTextStyle: {
    fontSize: resp(14),
    marginTop: resp(30),
    marginLeft: resp(10),
    height: resp(50),
    color: '#8E8E8E',
  },
  hairline: {
    backgroundColor: '#C8C7CC80',
    height: 2,
    width: '100%',
  },
  ImageContainer: {
    // marginLeft:wp(5),
    marginTop: resp(-15),
    flexDirection: 'column',
    width: wp(170),
    height: hp(190),
    margin: wp(5),
    borderRadius: resp(5),
  },
 
  card: {
    marginHorizontal: 0,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 1,
  },
  spinnerTextStyle:{
    color:'#F01738'
  },
  ProfileInfoContainer: {
    margin: resp(0),
    marginTop: resp(15),
    flexDirection: 'column',
    flex: 0.6,
    backgroundColor:'white',
    width: resp(5),
    height: resp(70),
  },
  ListMenuContainer: {
    marginTop: resp(20),
    flexDirection: 'row',
    flex: 0.6,
    width: resp(0),
    height: resp(30),
  },
  viewButtonStyle: {
    color: '#000',
    marginRight: resp(-20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(4),
  },
  messageButtonContainer: {
    margin: resp(5),
    marginTop: resp(7),
    width: resp(18),
    height: resp(18),
    borderRadius: resp(50),
    backgroundColor: '#ebced7',
  },
  messageButtonStyle: {
    marginTop: resp(5),
    // color: '#F01738',
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
    marginTop:4
  },
  columnView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  itemNameStyle: {
    color: '#887F82',
    width:'100%',
    marginLeft: resp(7),
    fontSize: resp(14),
    marginLeft:resp(10),
  },
  heartButtonStyle: {
    borderColor: '#F01738',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPriceStyle: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: resp(10),
    fontSize: resp(14),
    
  },
});

export default GeneralTab;