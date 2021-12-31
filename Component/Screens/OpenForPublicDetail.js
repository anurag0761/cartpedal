import React, { Component, useState } from 'react'
console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Share
} from 'react-native'
import resp from 'rn-responsive-font'
import CustomMenuIcon from './CustomMenuIcon'
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-simple-toast'
import Spinner from 'react-native-loading-spinner-overlay';
import SeeMore from 'react-native-see-more-inline';
// import { NavigationActions, withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import {BASE_URL} from '../Component/ApiClient';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;



class OpenForPublicDetail extends Component {
  constructor(props) {
    super(props)
    this.UserProfileCall = this.UserProfileCall.bind(this),
    this.AddFavourite = this.AddFavourite.bind(this);
    this.state = {
      isModalVisible: false,
      ProfileData:'',
      spinner:'',
      about:'',
      favourite:'',
      fcmToken:'',
      block_id:'',
      wholeData:'',
      userAccessToken:'',
      redIcon:require('../images/Heart_icon.png'),
      whiteIcon:require('../images/dislike.png'),
      pickedImage:require('../images/default_user.png'),
      avatar:'',
      baseUrl: `${BASE_URL}`,
    }
  }

  showLoading() {
    this.setState({ spinner: true });
  }

  hideLoading() {
    this.setState({ spinner: false });
  }

  async componentDidMount() {
   this.showLoading();
     console.log("working ID");
     AsyncStorage.getItem('@fcmtoken').then((token) => {
      console.log("Edit user id token=" +token);
      if (token) {
        this.setState({ fcmToken: token });
       
      }
    });
     AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        this.setState({ userAccessToken: accessToken });
        console.log("Edit access token ====" + accessToken);
        //this.RecentUpdateCall();
      }
    });
    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
          this.setState({ userNo: userId });
          console.log(" id from login  user id ====" + userId);
          this.UserProfileCall();
      }else{
        console.log("else is executed");
        this.hideLoading();
      }
  });
  

}
AddFavourite(){
  this.showLoading();
  let id=this.state.userNo;
  let block_id=this.state.block_id;
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
      device_token: '1111',
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
      //  this.props.navigation.navigate('StoryViewScreen')
       // Toast.show(responseData.message);
        this.setState({NoData:false},()=>{
          this.UserProfileCall();
         // this.RecentShareCall();
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


UserProfileCall() {
  let formData = new FormData()

  formData.append('user_id', + this.state.userNo);
  console.log('user id in from Data',this.state.userNo);
  console.log('props id in params',this.props.route.params.id);
   
  formData.append('profile_id',this.props.route.params.id)
  console.log('form data==' + formData)

  var userProfile = this.state.baseUrl + 'api-user/user-profile'
  console.log('UserProfile Url:' + userProfile)
  fetch(userProfile, {
    method: 'Post',
    headers: {
      'Content-Type': 'multipart/form-data',
      device_id: '1234',
      device_token: '1111',
      device_type: 'android',
      Authorization: JSON.parse(this.state.userAccessToken)
    },
    body: formData,
  })
    .then(response => response.json())
    .then(responseData => {
     this.hideLoading();
      if (responseData.code == '200') {
      //  Toast.show(responseData.message);
      if(responseData.data[0].products!==undefined&&responseData.data[0].products.length>0){
        console.log('if executed',responseData.data[0].products);
        this.setState({ProfileData:responseData.data[0].products});
        this.setState({wholeData:responseData.data[0]});
    }else{
      console.log('else executed');
      this.setState({NoData:true});
        this.setState({ProfileData:''});
    }
        this.setState({block_id:responseData.data[0].id});
        this.setState({favourite:responseData.data[0].favourite})
        console.log('fevtert========',responseData.data[0].favourite);
      
       
        this.setState({about:responseData.data[0].about});
        if(responseData.data[0].avatar==null){
          this.setState({avatar:''})
        }else{
          this.setState({avatar:responseData.data[0].avatar});
        }
      } else {
        // alert(responseData.data);
        console.log(responseData.message)
      }
       console.log('response profile data:', JSON.stringify(responseData));
    })
    .catch(error => {
     this.hideLoading();
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
link =async(id,name="OpenForPublicDetail")=>{
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
forwardlink =async(userid,name="OpenForPublicDetail")=>{
  const link = new firebase.links.DynamicLink(
    `https://play.google.com/store/apps/details?id=in.cartpedal&page=${name}&profileId=`+
      userid,
    'cartpedal.page.link',
  ).android
    .setPackageName('com.cart.android')
    .ios.setBundleId('com.cart.ios');

firebase.links()
 .createDynamicLink(link)
 .then((url) => {
   console.log('the url',url);
  //  this.sendMessage(url,userid);
  AsyncStorage.getItem('@Phonecontacts').then((NumberFormat=>{
    if(NumberFormat){
      let numID=JSON.parse(NumberFormat)
    //   this.setState({PhoneNumber:numID})
this.props.navigation.navigate('ForwardLinkScreen', {
  fcmToken: this.state.fcmToken,
  PhoneNumber: numID,
  userId: this.state.userNo,
  userAccessToken: this.state.userAccessToken,
  msgids: 'http://' + url,
});
}
}));
 });
}
  actionOnRow(item) {
    console.log('Selected Item :', item)
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  render() {
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
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../images/back_blck_icon.png')}
                style={styles.backButtonStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.TitleContainer}>
            <Image
              source={require('../images/logo_cart_paddle.png')}
              style={styles.LogoIconStyle}
            />
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.TitleStyle}>Cartpedal</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.SearchContainer}>
          
          </View>
        </View>

        <View style={styles.MainContentBox}>
          <ScrollView>
            <View style={styles.ProfileContainer}>
              <View style={styles.RiyaImageContainer}>
                <TouchableOpacity >
                  <Image
                 
                 source={this.state.avatar==''?(this.state.pickedImage):{uri:this.state.avatar}}
                    style={styles.RiyaImageViewStyle}
                  />
                  <Image
                    source={require('../images/status_add_largeicon.png')}
                    style={styles.StatusAddLargeStyle}></Image>
                </TouchableOpacity>
                </View>
              <View style={styles.ProfileInfoContainer}>
              <Text style={styles.PersonNameStyle}>{this.props.route.params.name}</Text>
             
              <View style={styles.PersonInfoContainer}>
              <View style={{width:width*0.7}}>
              {this.state.about? (<SeeMore style={styles.PersonDescriptionStyle} numberOfLines={4}  linkColor="red" seeMoreText="read more" seeLessText="read less">
                        {this.state.about}
                  </SeeMore>):null}
                  </View>  
              </View>
              </View>
              <TouchableOpacity onPress={this.AddFavourite} style={styles.messageButtonContainer}>
              <Image
                source={this.state.favourite==1?this.state.redIcon:this.state.whiteIcon}
                style={[styles.heartButtonStyle,{width:this.state.favourite==1?resp(11):resp(18),height:this.state.favourite==1?resp(9):resp(18),marginTop:this.state.favourite==1?resp(5):resp(0)}]}></Image>
            </TouchableOpacity>
            </View> 
            <View style={styles.horizontalLine}>
              <View style={styles.hairline} />
            </View>
            <FlatList
              style={{ flex: 1 }}
              data={this.state.ProfileData}
              //renderItem={({ item }) => <Item item={item} />}
              keyExtractor={item => item.ProdcutName}
              numColumns={2}
              renderItem={({ item }) =>(
                <TouchableOpacity style={styles.listItem}
                onPress={() => {
                  this.props.navigation.navigate('ProductDetailScreen',{whole_data:item,seller_id:this.state.wholeData.id,imageURL:item.image,name:this.props.route.params.name})
                }}>
                <Image source={item.image[0]?{uri:item.image[0].image}:this.state.pickedImage} style={styles.image} />
                {item.image[1]?( <View style={styles.MultipleOptionContainer}>
                  <Image
                    source={require('../images/multipleImageIcon.png')}
                    style={styles.MultipleIconStyle}></Image>
                </View>):null}
                <View>
                  <Text style={styles.itemNameStyle}>{item.name}</Text>
                </View>
          
                <View style={styles.box}>
                  <View style={styles.priceContainer}>
                    <View style={styles.itemPriceContainer}>
                    {item.price!=0?( <Text style={styles.itemPriceStyle}>
                        {'\u20B9'} {item.price}
                      </Text>):<TouchableOpacity style={{backgroundColor:'#F01738',width:resp(90),height:30,marginTop:3,marginBottom:5}}><Text style={{color:'#fff',textAlign:'center'}}>Ask For Rate</Text></TouchableOpacity>}
                    </View>
                    </View>
                    <TouchableOpacity style={styles.eyeButtonContainer}  onPress={() => {
                   this.props.navigation.navigate('ProductDetailScreen',{whole_data:item,seller_id:this.state.wholeData.id,imageURL:item.image,name:this.props.route.params.name})
                }}>
                      <Image source={require('../images/shopping-cart-Icon.png')} style={styles.ShopingCartStyle}></Image>
          
                     
                    </TouchableOpacity>
          
                    <CustomMenuIcon
          menutext='Menu'
          menustyle={{
          marginRight: 5,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          }}
          textStyle={{
          color: 'white',
          }}
          option1Click={() => {
            this.link(item.id)
          
          }}
          option2Click={() => {
            this.forwardlink(item.id)
          
          }}
          />
                 
                </View>
              </TouchableOpacity>
              )
    }
            />
          </ScrollView>

        </View>
        <View style={styles.TabBox}>
          <View style={styles.tabStyle}>
            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('DashBoardScreen')
              }}>
              <Image
                source={require('../images/home_inactive_icon.png')}
                style={styles.StyleHomeTab}
              />

              <Text style={styles.bottomInactiveTextStyle}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButtonStyle}
              onPress={() => {
                this.props.navigation.navigate('OpenForPublicScreen')
              }}>
              <Image
                source={require('../images/group_active_icon.png')}
                style={styles.StyleOpenForPublicTab}
              />
              <Text style={styles.bottomActiveTextStyle}>
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
    flexDirection: 'column',
    backgroundColor: 'white',
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
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 20,
  },
 
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: resp(20),
    textAlign: 'center',
  },
 
 
 
  heartButtonStyle: {
    marginTop: resp(30),
    color: '#F01738',
    width: resp(12),
    height: resp(10.47),
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },

  MainContentBox: {
    flex: 1,
    flexDirection: 'column',
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
  messageButtonContainer:{
    marginTop:resp(15),
  },
  tabButtonStyle: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  StyleSettingTab: {
    marginTop: 9,
    width: 30,
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
  spinnerTextStyle:{
    color:'#F01738'
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
 
  RiyaImageContainer: {
    marginBottom: resp(30),
    margin: resp(10),
    flexDirection: 'row',
    flex: 0.2,
    width: resp(90),
    height: resp(90),
   
  },
  ProfileContainer:{
    flexDirection: 'row',
    width: '100%',
  },
  RiyaImageViewStyle: {
    
  
    width: resp(90),
    height: resp(90),
    borderRadius: resp(10),
    borderWidth: 2,
    borderColor: '#fff',
  },
  StatusAddLargeStyle: {
 
    marginLeft: resp(65),
    width: resp(25),
    height: resp(25),
    position: 'absolute', //Here is the trick
    bottom: 0,
  },

 
  ProfileInfoContainer: {
      flex:0.75,
    flexDirection: 'column',
    width: '100%',
    marginLeft:resp(15),
    marginTop:resp(18),
    height: resp(30),
    color: '#fff',
  },
  PersonInfoContainer: {
     marginTop:resp(5),
    flexDirection: 'row',
    width: resp(260),    
    height: resp(66),
  },

  PersonNameStyle: {
    fontSize: resp(16),
    width: resp(200),
    color: '#2B2B2B',
    fontWeight: 'bold',
  },

  PersonDescriptionStyle: {
    fontSize: resp(12),
    width: resp(250),
    height: resp(44),
    color: '#7F7F7F',
  }, 
  horizontalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: resp(2),
  },
  hairline: {
    backgroundColor: '#C8C7CC80',
    height: 5,
    width: '100%',
  },
 

  ImageViewStyle: {
    margin: resp(8),
    width: resp(55),
    height: resp(55),
    borderWidth: 2,
    borderColor: '#F01738',
  },
 
 
  image: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 0,
    borderRadius: 10,
    width: resp(180),
    height: resp(196),
  },
  listItem: {
    marginTop: resp(15),
    width: '50%',
    flexDirection: 'column',
    margin: resp(0),
    backgroundColor: 'white',
    borderRadius: 10,
  },
  MultipleOptionContainer: {
    marginLeft: 20,
    position: 'absolute',
    bottom: 50,
    width: 14,
    height: 14,
    borderRadius: resp(20),
    backgroundColor: '#fff',
  },
  MultipleIconStyle: {
    marginLeft: 20,
    width: resp(13.85),
    height: resp(13.85),
    position: 'absolute', //Here is the trick
    bottom: 0,
    right: 1,
  },
  itemNameStyle: {
    color: '#887F82',
    marginLeft: resp(18),
    fontSize: resp(14),
  },
  itemPriceStyle: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: resp(7),
    fontSize: resp(14),
  },
  itemPriceContainer: {
    flex: 0.6,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  box: {
    width: resp(200),
    height: resp(25),
    marginLeft: resp(17),
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: 'black',

  },
  priceContainer: {
    flex: 0.8,
    marginLeft:resp(-5),
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  eyeButtonContainer: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
   marginBottom:resp(2),
    width: resp(15),
    height: resp(20),
    borderRadius: resp(50),
    backgroundColor: '#ebced7',
  },
  ShopingCartStyle: {
    marginTop: resp(0),
    width: 10,
    height: 11,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTextStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: resp(30),
    height: resp(24),
    backgroundColor: '#fff',
  },
})
export default OpenForPublicDetail;