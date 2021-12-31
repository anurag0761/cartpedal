

import React, { Component } from 'react'

console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  Dimensions
} from 'react-native'
import resp from 'rn-responsive-font'
import CustomMenuIcon from './CustomMenuIcon'
import Toast from 'react-native-simple-toast'
import MenuIcon from './MenuIcon'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage'
import SeeMore from 'react-native-see-more-inline';
import firebase from 'react-native-firebase'
import {BASE_URL} from '../Component/ApiClient';
import { hp, wp } from '../Component/hightWidthRatio'
let width=Dimensions.get('window').width;
class CartPlaceScreen extends Component {
  constructor(props) {
    super(props)
    console.log('props id', JSON.stringify(this.props));
    //this.favouriteProduct = this.favouriteProduct.bind(this),
      this.CartListCall = this.CartListCall.bind(this),
      this.PlaceOderCall = this.PlaceOderCall.bind(this),
      this.AddFavourite = this.AddFavourite.bind(this);
      this.state = {
        NoData: '',
        spinner: '',
        ButtomTab:false,
        block_id:'',
        quantity: '0',
        total_price: '0',
        userAccessToken: '',
        userNo: '',
        block_id:'',
        itemOfProduct:'',
        currentQuantity:'',
        totalPrice:'',
        favourite:'',
        totalDataLength:'',
        CartListProduct: '',
        fcmToken:'',
        pickedImage:require('../images/default_user.png'),
        avatar:'',
        redIcon:require('../images/Heart_icon.png'),
        whiteIcon:require('../images/dislike.png'),
        baseUrl: `${BASE_URL}`,
        
      }
  }


  showLoading() {
    this.setState({ spinner: true });
  }

  hideLoading() {
    this.setState({ spinner: false });
  }

  GotoNextScreen(item) {

    this.props.navigation.navigate('CartViewScreen');
    console.log('Selected Item :', item)
  }
  PlaceODerCallMethode() {
    this.PlaceOderCall();

  }
  actionOnRow(item) {
    console.log('Selected Item :', item)
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
  link =async(id,name="CartScreen")=>{
    const link = new firebase.links.DynamicLink(
      `https://play.google.com/store/apps/details?id=in.cartpedal&page=${name}&profileId=${id}&cartValue=1`,
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
forwardlink =async(userid,name="CartScreen")=>{
  const link = new firebase.links.DynamicLink(
    `https://play.google.com/store/apps/details?id=in.cartpedal&page=${name}&profileId=${userid}&cartValue=1`,
    'cartpedal.page.link',
  ).android
    .setPackageName('com.cart.android')
    .ios.setBundleId('com.cart.ios');

  firebase
    .links()
    .createDynamicLink(link)
    .then((url) => {
      console.log('the url', url);
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

  async componentDidMount() {
    // this.focusListener = this.props.navigation.addListener('focus', () => {
      this.showLoading();
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        this.setState({ userAccessToken: accessToken });
        console.log("Edit access token ====" + accessToken);
        //this.RecentUpdateCall();
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
        this.setState({ userNo: userId });
        console.log(" id from login  user id ====" + userId);       
        this.CartListCall();
      } else {
        console.log("else is executed");
        this.hideLoading();
      }
    });
  // });
    //   AsyncStorage.getItem('@user_id').then((userId) => {
    //     if (userId) {
    //         this.setState( { userId: userId });
    //         console.log("Edit user id Dhasbord ====" + this.state.userId);
    //        // this.CartListCall();
    //     }
    // });
  }
  BottomTab=()=>{
    return(
      <View style={styles.container}>

          <Text>{this.state.ButtomTab==false ?'' : null}</Text>
         
        </View>
   
    )
  }

 
  ListEmpty = () => {
    return (
      <View style={{justifyContent:'center',alignItems:'center'}}>
      <Text style={{ marginTop:120
   }}>{this.state.NoData?'No Record':null} </Text>
  </View>
    );
  };
  // favouriteProduct(item) {
  //   console.log('item of fav',item);
  //   let formData = new FormData()

  //   formData.append('user_id', this.state.userNo)
  //   formData.append('block_id', item.id)
  //   formData.append('type', 1)
  //   console.log('form data==' + JSON.stringify(formData))


  //   // var CartList = this.state.baseUrl + 'api-product/cart-list'
  //   var favouriteProductUrl = "${BASE_URL}frontend/web/api-product/cart-list"
  //   console.log('BlockUser Url:' + favouriteProductUrl)
  //   fetch(favouriteProductUrl, {
  //     method: 'Post',
  //     headers: new Headers({
  //       'Content-Type': 'multipart/form-data',
  //       device_id: '1111',
  //       device_token: '1111',
  //       device_type: 'android',
  //       Authorization: JSON.parse(this.state.userAccessToken),
  //       // Authorization: 'Bearer xriPJWJGsQT-dUgP4qH11EMM357_kEaan7zJ4Vty'

  //     }),
  //     body: formData,
  //   })

  //     .then(response => response.json())
  //     .then(responseData => {
  //       this.hideLoading();
  //       if (responseData.code == '200') {
  //         console.log('fevtert========',responseData.data[0].favourite);
  //           this.setState({favourite:responseData.data[0].favourite})
  //         //  this.props.navigation.navigate('StoryViewScreen')
  //         Toast.show(responseData.message);
  //         this.setState({ CartListProduct: responseData.data })
  //         console.log('executed if the cart');
  //         // this.SaveProductListData(responseData)

  //       } else {
  //         // alert(responseData.data);
  //         // alert(responseData.data.password)
  //         console.log('executed the cart');
  //         this.setState({ NoData: true });

  //       }

  //       // console.log('response object:', responseData)
  //       console.log('favouriteProduct', JSON.stringify(responseData))
  //       // console.log('access_token ', this.state.access_token)
  //       //   console.log('User Phone Number==' + formData.phone_number)
  //     })
  //     .catch(error => {
  //       this.hideLoading();
  //       console.error(error)
  //     })

  //     .done()

  // }

  
  CartListCall() {
    let userno,fcmtoken,accesstokenid;
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        accesstokenid=accessToken;
        console.log("Edit access token ====" + accessToken);
        AsyncStorage.getItem('@fcmtoken').then((token) => {
          if (token) {  
            fcmtoken=token
            AsyncStorage.getItem('@user_id').then((userId) => {
              if (userId) {
                userno=userId
        //this.RecentUpdateCall();
    let formData = new FormData()

    formData.append('user_id', userno)
    formData.append('type', 0)
    console.log('form data==' + JSON.stringify(formData))

    // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var CartList = `${BASE_URL}api-product/cart-list`
    console.log('Add product Url:' + CartList)
    fetch(CartList, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(accesstokenid),
        // Authorization: 'Bearer xriPJWJGsQT-dUgP4qH11EMM357_kEaan7zJ4Vty'

      }),
      body: formData,
    })

      .then(response => response.json())
      .then(responseData => {
      
        if (responseData.code == '200') {
         
          //  this.props.navigation.navigate('StoryViewScreen')
          //  Toast.show(responseData.message);
          if(responseData.data!==undefined&&responseData.data.length>0){
            console.log('if executed');
            this.setState({ButtomTab:true})
            this.setState({CartListProduct:responseData.data});
            this.setState({block_id:responseData.data[0].id});
            this.setState({itemOfProduct:responseData.data[0].products[0].id})
            this.setState({currentQuantity:responseData.data[0].products[0].quantity})
            this.setState({totalPrice:responseData.data[0].products[0].price})
            console.log("value",responseData.data[0].id);
            console.log('fevtert========',responseData.data[0].favourite);
            this.setState({favourite:responseData.data[0].favourite})
           
            this.SaveUserName(responseData)
           
            if(responseData.data[0].avatar==null){
          this.setState({avatar:''})
          this.hideLoading();
        }else{
          // this.setState({avatar:responseData.data[0].avatar});
          this.hideLoading();
        }
        }else{
          console.log('else executed');
          this.setState({NoData:true});
            this.setState({CartListProduct:''});
            this.hideLoading();
        } 
        
          console.log('total lenght',responseData.data.length);
          this.setState({totalDataLength:responseData.data.length});
         
          // this.SaveProductListData(responseData)
          this.addQuantity(responseData.data);

        } else {
          // alert(responseData.data);
          this.hideLoading();
          this.setState({ NoData: true });
          // alert(responseData.data.password)
        }
      
        console.log('response cartList object:', responseData)
        console.log('User user ID==', JSON.stringify(responseData))
        // console.log('product ID===',responseData.data[0].products[0].id)
        // console.log('Qunnity ===',responseData.data[0].products[0].quantity)
        // console.log('price product ===',responseData.data[0].products[0].price)
          // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })
      .done();
    }
  });
}
    });
  }
});

  }

  async SaveUserName(responseData){
    await AsyncStorage.setItem('@user_profileName', JSON.stringify(responseData.data[0].username));
    console.log('userNameCartPalace==', JSON.stringify(responseData.data[0].username))
  
  }
 singleProductPlaceOrder = (seller_id,productID,quantity,price) => {

    let formData = new FormData();
    formData.append('user_id', JSON.parse(this.state.userNo));
    formData.append('seller_id', seller_id);
    formData.append('type',0)
    // formData.append('product_id',productID)
    // formData.append('quantity', quantity)
    // formData.append('price',price)
    console.log('form data==' + JSON.stringify(formData));

    var PalceOderUrl = this.state.baseUrl + "api-product/place-order"
    // var PalceOderUrl = "https://www.cartpedal.com/frontend/web/api-product/place-order"
    console.log('placeOder:' + PalceOderUrl)
    fetch(PalceOderUrl, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '11111',
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
        if (responseData.code == '200 ') {
          //  this.props.navigation.navigate('StoryViewScreen')
          console.log('seller_id',seller_id);
          console.log('cart list product',this.state.CartListProduct);
          let newArr=this.state.CartListProduct.filter(word=>word.id!==seller_id);
          this.setState({CartListProduct:newArr});
          console.log('new Array',newArr);
          this.addQuantity(newArr);
         // Toast.show("Order is placed successfully");
        }
        else if (responseData.done == '500') {
        //  Toast.show(responseData.message)
        }

        else {
          // alert(responseData.data);
          // alert(responseData.data.password)

        }

        console.log('response object:', responseData)
        console.log('User user ID==', JSON.stringify(responseData))
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })

      .done()

  }
  addQuantity = (data) => {
    if(this.state.NoData==false){
    console.log("the data", data);
    let cart_quantity = 0;
    let total_price = 0;
    data.map(item => {
      console.log(item.cartitem);
      cart_quantity = cart_quantity + item.cartitem;
      total_price = total_price + item.cartvalue;
    });
    console.log("the value of quantity" + cart_quantity);
    this.setState({ quantity: cart_quantity });
    this.setState({ total_price: total_price });
  }
  }
  PlaceOderCall() {
    console.log('cart list product',this.state.CartListProduct);
    console.log('items', this.state.CartListProduct.length);
    if(this.state.CartListProduct.length>0){
    let indexValue;
    let itemID = [];
    let productID=[];
    this.state.CartListProduct.forEach((item, index) => {
      console.log('place order',item)
      item.products.map((itemIDs)=>{
        console.log('product ID',itemIDs.id)
        productID.push(itemIDs.id);
      })
      itemID.push(item.id);
    });
    let seller_id = itemID.join(',');
    let products=productID.join(',');
    console.log('products id',products);
    console.log(itemID.join(','));
    let formData = new FormData();
    formData.append('user_id', this.state.userNo)
    formData.append('seller_id',parseInt(seller_id));
    formData.append('type',0)
    formData.append('product_id',parseInt(products))
    formData.append('quantity', this.state.currentQuantity)
    formData.append('price',  this.state.totalPrice)
    console.log('form data==' + JSON.stringify(formData))

    var PalceOderUrl = this.state.baseUrl + "api-product/place-order"
    // var PalceOderUrl = "https://www.cartpedal.com/frontend/web/api-product/place-order"
    console.log('placeOder:' + PalceOderUrl)
    fetch(PalceOderUrl, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '11111',
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
        if (responseData.code == '200 ') {
          //  this.props.navigation.navigate('StoryViewScreen')
        //  Toast.show(responseData.message);
          this.setState({CartListProduct:''});
          this.setState({quantity:'0'});
          this.setState({total_price:'0'});
          this.setState({ NoData: true });
          // this.setState({CartListProduct:responseData.data})
          // this.SaveProductListData(responseData)

        }
        else if (responseData.done == '500') {
         // Toast.show(responseData.message)
        }

        else {
          // alert(responseData.data);
          // alert(responseData.data.password)

        }

        console.log('response object:', responseData)
        console.log('User user ID==', JSON.stringify(responseData))
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })
      .done();
    }else{
      alert('No Product Available to place an order');
    }
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
        device_token: this.state.fcmtoken,
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
        //  Toast.show(responseData.message);
          // this.RecentShareCall();
          this.CartListCall();
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
  async SaveLoginUserData(responseData) {
    await AsyncStorage.setItem('@user_id', responseData.data.userid.toString());
    // await AsyncStorage.setItem('@access_token', responseData.data.access_token.toString());
  }
  _renderItem=({item})=>{
    console.log('item of cart item',item);
    return(
    <TouchableOpacity style={styles.itemBox}  onPress={() => {
      console.log('user data from api', item);
      this.props.navigation.navigate('CartViewScreen',{ id: item.id, name: item.name,cartProduct:item } )
    }}>
         <View>
      <View style={styles.box}>
        <View style={styles.ProfileImageContainer}>
          <TouchableOpacity>
            <Image
                source={item.avatar==null?(this.state.pickedImage):{uri:item.avatar}}
              style={styles.ProfileImageViewStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.ProfileInfoContainer}>
          <Text style={styles.PersonNameStyle}>{item.name}</Text>
          {/* <Text style={styles.ProfileDescription}>{item.about}</Text> */}
          <View style={{width:resp(500)}}>
          {item.about? (<SeeMore style={styles.ProfileDescription} numberOfLines={2}  linkColor="red" seeMoreText="read more" seeLessText="read less">
          {item.about.substring(0,55)+"..."}
                  </SeeMore>):null}
                  </View>
        </View>
        <View style={styles.ListMenuContainer}>
          <TouchableOpacity  style={styles.messageButtonContainer}  onPress={() => {
            console.log('id of user',item.id);
            this.props.navigation.navigate('ChatDetailScreen',{userid:item.id, username:item.name,useravatar:item.avatar,groupexit:false,groupId:"0",msg_type:"0",userphone:item.mobile})
                      }}>
              <Image
                source={require('../images/message_icon.png')}
                style={styles.messageButtonStyle}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.AddFavourite} style={styles.messageButtonContainer}>
              <Image
                source={item.favourite==1?this.state.redIcon:this.state.whiteIcon}
                style={[styles.heartButtonStyle,{width:item.favourite==1?resp(11):resp(18),height:item.favourite==1?resp(9):resp(18),marginTop:item.favourite==1?resp(4):resp(0)}]}></Image>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('user data from api', item);
              this.props.navigation.navigate('CartViewScreen',{ id: item.id, name: item.name,cartProduct:item } )
            }}>
            
            <View style={styles.ViewButtonContainer}>
              <Text style={styles.viewButtonStyle}>View All</Text>
            </View>
          </TouchableOpacity>

          <MenuIcon
            //Menu Text
            menutext='Menu'
           
            //Menu View Style
            menustyle={{
              marginRight: 5,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
            //Menu Text Style
            textStyle={{
              color: 'white',
            }}
            //Click functions for the menu items
            option1Click={() => {
              Toast.show('CLicked Block', Toast.LONG)
            }}
            option2Click={() => {
              this.link(item.id)
              // Toast.show('CLicked Share Link', Toast.LONG)
            }}
            option3Click={() => {
              this.forwardlink(item.id)
              // Toast.show('CLicked Forward Link', Toast.LONG)
            }}
          />
        </View>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.columnView}>
          <View style={styles.ImageContainer}>
            <Image
              source={{ uri: item.products[0].image }}
              style={{width:95,height:133,borderRadius: resp(5),}}></Image>
              {/* <View style={{justifyContent:'center',alignItems:'center'}}> */}
            <Text style={styles.itemNameStyle}>{item.products[0].name}</Text>
            <Text style={styles.itemPriceStyle}>
              {'\u20B9'}
              {item.products[0].price}
            </Text>
            {/* </View> */}
          </View>
          {item.products[1]?( <View style={styles.ImageContainer1}>
            <Image
              source={{ uri: item.products[1].image }}
              style={{width:95,height:133,borderRadius: resp(5),}}></Image>
            <Text style={styles.itemNameStyle}>{item.products[1].name}</Text>
            <Text style={styles.itemPriceStyle}>
              {'\u20B9'}
              {item.products[1].price}
            </Text>
          </View>):null}
          {item.products[2]?( <View style={styles.ImageContainer1}>
            <Image
              source={{ uri: item.products[2].image }}
              style={{width:95,height:133,borderRadius: resp(5)}}></Image>
            <Text style={styles.itemNameStyle}>{item.products[2].name}</Text>
            <Text style={styles.itemPriceStyle}>
              {'\u20B9'}
              {item.products[2].price}
            </Text>
          </View>):null}
          {item.products[3]?( <View style={styles.ImageContainer1}>
            <Image
              source={{ uri: item.products[3].image }}
              style={{width:95,height:133,borderRadius: resp(5),}}></Image>
            <Text style={styles.itemNameStyle}>{item.products[3].name}</Text>
            <Text style={styles.itemPriceStyle}>
              {'\u20B9'}
              {item.products[3].price}
            </Text>
          </View>):null}
        </View>


      </ScrollView>
      <View style={styles.ItemCountContainer}>
        <View style={styles.CartValueContainer}>
          <View style={styles.CartItemContainer}>
            <Text style={styles.CartItemTextStyle}>Cart Item</Text>
            <Text style={styles.CartValueTextStyle}>{item.cartitem}</Text>
          </View>
          <View style={styles.CartItemContainer}>
            <Text style={styles.CartItemTextStyle}>Cart Value</Text>
            <Text style={styles.CartValueTextStyle}>{item.cartvalue}</Text>
          </View>
        </View>
        <View style={styles.PlacedHolderButtonContainer}>
          <TouchableOpacity style={styles.PlacedButtonStyle} onPress={() => { this.singleProductPlaceOrder(item.id,item.products[0].id,item.cartitem,item.products[0].cartprice) }}>
            <Text style={styles.PlaceHolderTextStyle}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.hairline} />
      </View>
    </TouchableOpacity>
  )}
  


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          color='#F01738'
          // textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        <View style={styles.MainContentBox}>

          <View style={styles.hairline} />

          <FlatList
            style={{ flex: .85 }}
            data={this.state.CartListProduct}
            // renderItem={({ item }) => <ParsonProfile item={item} />}
            keyExtractor={(item, personName) => item.personName}
            renderItem={this._renderItem}
            ListEmptyComponent={this.ListEmpty}
            
          />
          {this.state.ButtomTab==true?(
          <View style={styles.BottomContainer}>
            <View style={styles.BottomQuanitityContainer}>
              <Text style={styles.OderTextStyle}>Total Cart Quantity</Text>
              <Text style={styles.OderTextNumberStyle}>{this.state.quantity}</Text>
            </View>
            <View style={styles.BottomValueContainer}>
              <Text style={styles.OderValueTextStyle}>Total Cart Value</Text>
              <Text style={styles.OderValueTextNumberStyle}>{'\u20B9'} {this.state.total_price}</Text>
            </View>
            <TouchableOpacity style={styles.BottomPlaceHolderContainer}
              onPress={() => {
                this.PlaceODerCallMethode();
              }}>
              {/* Toast.show('CLicked Forward Link', Toast.LONG)}} >*/}




              <Text style={styles.PlaceHolderTextStyle2}>Place Order</Text>

            </TouchableOpacity>
          </View>):null}
          

          
        </View>
          
        

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // width:width,
    backgroundColor: '#fff',
  },
  Profile2Container: {
    color: '#fff',
    flexDirection: 'row',
  },
  ProfileContainer: {
    height: resp(414),
    color: 'red',
    flexDirection: 'row',
  },

  PersonNameStyle: {
    marginTop: resp(10),
    width: resp(80),
    height: resp(20),
    color: '#000',
    fontWeight: 'bold',
  },
  ProfileDescription: {

    width: resp(260),
    height: resp(20),
    color: '#7F7F7F',

    fontSize: resp(12),
  },
  Profile2ImageContainer: {
    margin: resp(10),
    flexDirection: 'column',
    flex: 0.2,
    width: resp(70),
    height: resp(70),
  },
  ProfileImageContainer: {
    // margin: resp(10),
    marginTop:hp(10),
    marginRight:wp(10),
    flexDirection: 'column',
    flex: 0.2,
    
    width: resp(70),
    height: resp(70),
  },
  box: {
    marginTop: resp(5),
    width: resp(415),
    height: resp(75),
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height:resp(2),
      width: resp(5),
    },
    elevation: 0,
  },
  ItemCountContainer: {
    
    marginTop: resp(2),
    width: wp(415),
    height: hp(75),
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: resp(2),
      width: resp(5),
    },
    elevation: 0,
  },
  CartItemContainer: {
    flex: 0.8,
    // height: resp(22),
    // width: resp(9000),
    margin: resp(5),
    flexDirection: 'row',

  },
  PlacedButtonStyle: {
    alignSelf:'flex-end',
    height: resp(40),
    width: resp(130),
    marginTop: resp(25),
    backgroundColor: '#FFCF33',


  },
  spinnerTextStyle: {
    color: '#F01738'
  },
  PlaceHolderTextStyle: {
    marginTop: resp(10),
    alignSelf: 'center',

    height: resp(18),
    fontWeight: 'bold',
    fontSize: 15,
    color: "#2B2B2B",

  },
  PlaceHolderTextStyle2: {
    alignSelf: 'center',
    height: resp(18),
    fontWeight: 'bold',
    fontSize: resp(15),
    color: "#2B2B2B",

  },
  CartItemTextStyle: {
    width: resp(80),
    height: resp(18),

    fontSize: resp(15),
    color: "#2B2B2B"
  },
  CartValueTextStyle: {
    marginLeft: resp(20),
    fontWeight: 'bold',
    fontSize: resp(15),
    color: "#2B2B2B",

  },

  CartValueContainer: {
    margin: resp(5),
    marginLeft:resp(15),
    width: resp(150),
    height: resp(70),
    flex: 0.5,
    flexDirection: 'column',
    shadowColor: 'black',
    backgroundColor:'white',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  PlacedHolderButtonContainer: {
    marginBottom: resp(20),
    margin: resp(5),
    width: wp(150),
    height: hp(65),
    flex: 0.4,
    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  itemBox: {
    flex:1,
    height: hp(400),
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

  Profile2ImageViewStyle: {
    margin: resp(10),
    width: resp(70),
    height: resp(70),
    borderRadius: resp(10),
  },
  ProfileImageViewStyle: {
    margin: resp(10),
    width: resp(50),
    height: resp(50),
    borderRadius: resp(8),
  },
  MenuIconStyle: {
    marginTop: resp(4),
    width: resp(3.44),
    height: resp(15.33),
  },
  horizontalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: resp(2),
  },
  ColumView: {
    flexDirection: 'column',
  },

  RecentViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: resp(2),
    height: resp(35),
    backgroundColor: '#F1F0F2',
    width: '100%',
  },
  RecentTextStyle: {
    fontSize: resp(14),
    marginTop: resp(30),
    marginLeft: resp(10),
    height: resp(50),
    color: '#8E8E8E',
  },
  margintop: {
    marginTop: '10',
  },
  ImageViewStyle: {
    margin: resp(8),
    width: resp(55),
    height: resp(55),
    borderWidth: resp(2),
    borderColor: '#F01738',
  },
  hairline: {
    backgroundColor: '#C8C7CC80',
    height: resp(2),
    width: '100%',
  },
  headerBox: {
    width: '100%',
    flex: 0.1,
    color: 'black',
  },
  MainContentBox: {
    flex: 1,
  },
  rowGray: {
    color: 'black',
    width: '100%',
    height: resp(50),
  },
  TabBox: {
    flex: 0.1,
    color: '#000',
  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: resp(10),
    backgroundColor: 'white',
  },
  backButtonStyle: {
    margin: resp(10),
    height: resp(20),
    width: resp(20),
  },
  LogoIconStyle: {
    margin: resp(5),
    height: resp(30),
    width: resp(30),
  },
  SearchIconStyle: {
    margin: resp(5),
    marginRight: resp(20),
    height: resp(25),
    width: resp(25),
    alignSelf: 'flex-end',
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
    elevation: resp(20),
  },

  bottomActiveTextStyle: {
    color: '#FB3954',
    fontSize: resp(10),
    marginTop: 0,
    marginLeft: resp(10),
    textAlign: 'center',
  },
  ImageContainer: {
    flexDirection: 'column',
    width: resp(95),
    marginTop:resp(10),
    height: resp(200),
    marginLeft: resp(5),
    marginRight:resp(5),
    borderRadius: resp(10),
  },
  ImageContainer1: {
    flexDirection: 'column',
    width: resp(95),
    marginTop:resp(10),
    height: resp(200),
    // marginLeft: resp(5),
    marginRight:resp(5),
    borderRadius: resp(10),
  },
  bottomInactiveTextStyleChart: {
    color: '#887F82',
    fontSize: resp(10),
    marginTop: resp(3),
    marginLeft: resp(8),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  bottomInactiveTextStyle: {
    color: '#887F82',
    fontSize: resp(10),
    marginTop: resp(3),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
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
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', //Here is the trick
    bottom: resp(20),
  },

  StatusAddLargeStyle: {
    marginTop: resp(-20),
    marginLeft: resp(60),
    width: resp(30),
    height: resp(30),

    position: 'absolute', //Here is the trick
    bottom: 0,
  },
  Profile2InfoContainer: {
    color: '#fff',
    margin: resp(10),
    marginTop: resp(20),
    flexDirection: 'column',
    flex: 0.6,
    width: resp(70),
   
    height: resp(70),
  },
  ProfileInfoContainer: {
    margin: resp(),
    marginTop: resp(10),
    flexDirection: 'column',
    flex: 0.7,
    marginLeft:resp(10),
    width: resp(70),
    height: resp(70),
  },

  RiyaMenuContainer: {
    margin: resp(15),
    marginTop: resp(20),
    flexDirection: 'row',
    flex: 0.2,
    width: resp(80),
    height: resp(70),
  },
  ListMenuContainer: {
    marginTop: resp(20),
    flexDirection: 'row',
    flex: 0.8,
    
    width: resp(0),
    height: resp(40),
    
  },
  openButtonStyle: {
    color: '#06BE7E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(10),
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
    width: resp(60),
    height: resp(24),
    borderRadius: resp(20),
    backgroundColor: '#e6f7f2',
  },
  messageButtonContainer: {
    margin: resp(5),
    marginTop: resp(1),
    width: resp(18),
    height: resp(18),
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
  heartButtonStyle: {
    marginTop: resp(4),
    color: '#F01738',
    width: resp(10),
    height: resp(8),
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
  bottomVideoTextStyle: {
    color: '#887F82',
    fontSize: resp(8),
    marginRight: resp(10),
    marginTop: resp(3),
    textAlign: 'center',
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
  bottomNotificationTextStyle: {
    color: '#887F82',
    fontSize: resp(8),
    marginLeft: resp(10),
    marginTop: resp(3),
    textAlign: 'center',
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
    bottom: 0,
  },
  columnView: {
    flexDirection: 'row',
    width: '100%',
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
    fontSize: resp(12),
   alignSelf:'flex-start'

  },
  itemPriceStyle: {
    color: '#000',
    fontWeight: 'bold',
    alignSelf:'flex-start',
    fontSize: resp(12),
    alignItems: 'center',
    height:resp(20),
    marginBottom:8


  },
  BottomContainer: {

    flex: .14,
    width: '100%',
    flexDirection: 'row',
    margin: resp(2),

  },
  BottomQuanitityContainer: {
    flex: 0.33,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  BottomValueContainer: {
    flex: 0.33,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#F01738'
  },
  BottomPlaceHolderContainer: {
    flex: 0.33,
    justifyContent: 'center',
    backgroundColor: '#FFCF33'
  },
  OderTextStyle: {
    color: '#7F7F7F',
    marginLeft: resp(7),
    fontSize: resp(12),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  OderTextNumberStyle: {
    color: '#F01738',
    marginLeft: resp(7),
    fontSize: resp(16),
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  OderValueTextStyle: {
    color: '#FFFFFF',
    marginLeft: resp(7),
    fontSize: resp(12),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  OderValueTextNumberStyle: {
    color: '#FFFFFF',
    marginLeft: resp(7),
    fontSize: resp(20),
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
})
export default CartPlaceScreen
// export default withNavigation(CartPlaceScreen)
