import React from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppConst from '../Component/AppConst';
import AppImageSlider from '../Component/AppImageSlider';
import resp from 'rn-responsive-font';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
//import * as ApiClient from '../Component/ApiClient';
import { Picker } from "native-base";

import {BASE_URL} from '../Component/ApiClient';
//import RNPickerSelect from 'react-native-picker-select';
const screenWidth = Dimensions.get('screen').width;
const placeholder = {
  label: 'Please you category',
  value: null,
  color: '#9EA0A4',
};


export default class EditProductScreen extends React.Component {
  constructor(props) {
    super(props);
    this.ProductCategoryCall = this.ProductCategoryCall.bind(this),
      this.ProductUnitCall = this.ProductUnitCall.bind(this),
      this.AddProductCall = this.AddProductCall.bind(this);
    this.state = {
      userId: '',
      Category: '',
      access_token: '',
      Name: '',
      language: '',
      totalPrice:'',
      price: 0,
      Unit: '',
      bunch: '',
      picker: '',
      bunchTrue:'',
      Details_1: '',
      Details_2: '',
      imageItem: '',
      Description: '',
      baseUrl:`${BASE_URL}`,
      CategoryList: [],
      ProductUnit: [],
       productid:[],
      selected1: 'key1',
      fcmToken:'',
      languages: [],
      results: {
        items: []
      }
    }
 
  }
  componentDidMount() {
   
    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
        this.setState({ userId: userId });
        console.log(" Edit user id ====" + this.state.userId);
        // console.log('props',JSON.stringify(this.props));
     
      }
    });
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      console.log("Edit user id token=" +token);
      if (token) {
        this.setState({ fcmToken: token });
      }
    });
    AsyncStorage.getItem('@imageData').then((imageData)=>{
      if(imageData){
        this.setState({imageItem:JSON.parse(imageData)});
        // console.log('image data from back',imageData);
      }
    });
    AsyncStorage.getItem('@product_id').then((id) => {
      if (id) {
        console.log('in edit product id',id);
        this.setState({productid:JSON.parse(id)});
        // this.props.navigation.navigate('ShareWithScreen');
      }else{
        console.log('product id',id);
      }
    });
    AsyncStorage.getItem('@access_token').then((access_token) => {
      if (access_token) {
        this.setState({ access_token: access_token });
        console.log(" Edit acces token ====" + this.state.access_token);
        this.ProductCategoryCall();
        this.ProductUnitCall();
      }
    });
  }


  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }
  CheckTextInput = () => {
    if (this.state.language === '') {
      //Check for the Name TextInput
      alert('Please Select Category ');

    }
    else if (this.state.Name === '') {
      alert('Please Enter Name');
    }
    else if (this.state.Price === ' ') {
      alert('Please Enter Price');
    }
    else if (this.state.Unit === '') {
      alert('Please Select Unit');
    }
    // else if (this.state.Details_1 === '') {
    //   alert('Please Enter Details_1');
    // }
    // else if (this.state.Details_2 === '') {
    //   alert('Please Enter Details_2');
    // }
    // else if (this.state.Description === '') {
    //   alert('Please Enter Description');
    // }
    else {
      console.log('add product');
      this.AddProductCall();


    }
  };

  ProductCategoryCall() {
    let formData = new FormData()

    // console.log('form data==' + formData)

    let urlProduct = `${BASE_URL}api-product/product-category-list`
    console.log('urlProduct :' + urlProduct)
    fetch(urlProduct, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
      // body: JSON.stringify({
      //   user_id:this.state.userId
      // }),
    })
      .then(response => response.json())
      .then(responseData => {
        // this.hideLoading();
        if (responseData.code == '200') {
          // this.LoginOrNot();
          //this.props.navigation.navigate('DashBoardScreen')
          // this.props.navigation.navigate('EditProductScreen')
         // Toast.show(responseData.message);
          this.setState({ CategoryList: responseData.data })
          //  this.SaveLoginUserData(responseData);

          // console.log('response object actagegg:', responseData)

        } else {
          console.log(responseData.data)
        }
    })
      .catch(error => {
        //  this.hideLoading();
        console.error(error)
      })
      .done()
  }
  ProductUnitCall() {
    let formData = new FormData()
    //console.log('form data==' + formData)
    // var urlProduct = 'https://www.cartpedal.com/frontend/web/api-product/product-list'
    var urlProductUnit = `${BASE_URL}api-product/product-unit`
    console.log('urlProduct :' + urlProductUnit)
    fetch(urlProductUnit, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
    })
      .then(response => response.json())
      .then(responseData => {
        // this.hideLoading();
        if (responseData.code == '200') {
          // this.LoginOrNot();
          //this.props.navigation.navigate('DashBoardScreen')
          // this.props.navigation.navigate('EditProductScreen')
          // Toast.show(responseData.message);
          this.setState({ ProductUnit: responseData.data })
          //  this.SaveLoginUserData(responseData);
          // console.log('response object actagegg:', responseData)
        } else {
          // alert(responseData.data);
          console.log(responseData.data)
        }
        // console.log('User user ID==' + responseData.data.userid)
        // console.log('access_token ',responseData.data.access_token)
      })
      .catch(error => {
        //  this.hideLoading();
        console.error(error)
      })
      .done()

  }

  AddProductCall=()=> {
    this.showLoading();
    let finalPrice;
    let price=this.state.price;
    let totalPrice=this.state.totalPrice;
    if(totalPrice!==''&&this.state.Unit==7) finalPrice=totalPrice;
    else finalPrice=price;
    // console.log('price',price);
    // console.log('total price',totalPrice);
    // console.log('final price',finalPrice);
    // console.log(JSON.stringify({
    //   user_id:this.state.userId,name:this.state.Name,upload:this.state.imageItem,category:this.state.language,unit:this.state.Unit ,price:finalPrice,description:this.state.Description,bunch:this.state.bunch,
    //   detailone:this.state.Details_1,detailtwo:this.state.Details_2
    // }));
    var otpUrl = `${BASE_URL}api-product/add-product`
    console.log('Add product Url:' + otpUrl)
     fetch(`${BASE_URL}api-product/add-product`, {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization:JSON.parse(this.state.access_token),
      },
      body:JSON.stringify({
        user_id:this.state.userId,name:this.state.Name,upload:this.state.imageItem,category:this.state.language,unit:this.state.Unit ,price:finalPrice,description:this.state.Description,bunch:this.state.bunch,
        detailone:this.state.Details_1,detailtwo:this.state.Details_2
      }),
    }).then(response => response.json())
      .then(responseData => {
        this.hideLoading();
        if (responseData.code == '200') {
          // this.props.navigation.navigate('StoryViewScreen')
          console.log(' add product response object:', responseData)
         Toast.show(responseData.message);
         console.log('hh',this.state.productid);
         let productID=this.state.productid;
         productID.push(responseData.data.id);
         if(this.props.route.params){
          if(this.props.route.params.productMaster=="ProductImage"){
            AsyncStorage.setItem('@productMasterSave',JSON.stringify(responseData.data.id)).then(suc=>{
              this.props.navigation.goBack()
            })
          }else{
            AsyncStorage.setItem('@product_id',JSON.stringify(productID)).then(succ=>{
              this.props.navigation.goBack()
             });
          }
        }else{
          AsyncStorage.setItem('@product_id',JSON.stringify(productID)).then(succ=>{
            this.props.navigation.goBack()
           });
        }
        
          // this.SaveProductListData(response)

        } else {
          console.log(responseData.data);
          // alert(responseData.data.password)
        }
        console.log('response object:', responseData)
        // console.log('User user ID==', this.state.userId)
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
        this.hideLoading();
        console.error('error message', error)
      })

      .done()
  }
  pricefunc=(text)=>{
    console.log('text',text);
    this.setState({ price: text })
    this.setState({totalPrice:text})
  }
    
  bunchFunc=(text)=>{
    // console.log('index',index);
    let price=this.state.price;
    let newPrice=price*text;
    console.log('price',price);
    console.log('new price',newPrice);
    // this.setState({price:newPrice});
    this.setState({totalPrice:newPrice})
    this.setState({ bunch: text });
  }
  async SaveProductListData(responseData) {
    // await AsyncStorage.setItem('@user_id', responseData.data.userid.toString());
    // await AsyncStorage.setItem('@access_token', responseData.data.access_token.toString());
    await AsyncStorage.setItem('@name', responseData.data.name.toString());
    await AsyncStorage.setItem('@category', responseData.data.category.toString());
    await AsyncStorage.setItem('@unit', responseData.data.unit.toString());
    await AsyncStorage.setItem('@price', responseData.data.price.toString());
    await AsyncStorage.setItem('@description', responseData.data.description.toString());
    await AsyncStorage.setItem('@bunch', responseData.data.bunch.toString());
    await AsyncStorage.setItem('@detailone', responseData.data.detailone.toString());
    await AsyncStorage.setItem('@detailtwo', responseData.data.detailtwo.toString());
  }
  renderInnerImageList(item, index, separators) {
    // console.log('render Item',item);
    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
        <Image style={styles.imageView} source={{ uri: item.path }} />
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <View style={[styles.container, { backgroundColor: '#e3e3e3' }]}>

          <AppImageSlider
            sliderImages={this.state.imageItem}
            rendorImages={(item, index) => this.renderInnerImageList(item, index)}

          />
        </View>

        <View style={styles.container2}>
          <ScrollView
            showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => {
                this.CheckTextInput()
                // this.AddProductCall();
                // this.props.navigation.navigate('StoryViewScreen')
              }}>
                <Text style={[styles.saveCancelButton, { borderBottomColor: 'green', color: 'green' }]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ImageHome');
              }}>
                <Text style={[styles.saveCancelButton, { borderBottomColor: 'red', color: 'red', marginStart: 20 }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputTextView}>
            <Picker 
            placeholder={placeholder}
  selectedValue={this.state.language}
  style={{height: 50, width: screenWidth-55}}
  onValueChange={(itemValue, itemIndex) => {
    if(itemValue != "0")this.setState({language: itemValue})
    else alert('Please select correct category');
  }  
  }>
    <Picker.Item label="Please select category" value="0" />
    {this.state.CategoryList.map((item,index) =>{
      // console.log('items',item);
   return ( 
    <Picker.Item label={item.title} value={item.id} key={index} />
   ) 
    }
)}
</Picker>
            </View>
            <TextInput
              style={styles.input1TextView}
              placeholder={AppConst.inputPH_enter_name}
              onChangeText={(text) => this.setState({ Name: text })}
            />
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_price}
              maxLength={5}
              keyboardType="numeric"
              onChangeText={(price) => {this.setState({price})}}
              value={this.state.price}
            />
            {/* <DropDownPicker
              style={{
                alignItems: 'flex-start'
                , justifyContent: 'flex-start'
              }}
              items={this.state.ProductUnit.map(item => ({ label:item.title, value:item.title }))}
              placeholder={'Product Unit'}
              containerStyle={{ height: 50, width: 350 }}

              style={styles.inputTextView}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
           
              // onChangeItem={item => this.setState({
              //   ProductUnit: item.value
              // },
              //   console.log(item.value)
              // )
              // }
            /> */}
<View style={styles.inputTextView}>
            <Picker 
            placeholder={placeholder}
  selectedValue={this.state.Unit}
  style={{height: 50, width: screenWidth-55}}
  
  onValueChange={(itemValue, itemIndex) => {
    if(itemValue != "0"){
      console.log('item value',itemValue)
      this.setState({bunchTrue:itemValue})
      this.setState({Unit: itemValue})
  }
    else alert('Please select correct unit');
  }  
  }>
    <Picker.Item label="Please select Unit" value="0"  />
    {this.state.ProductUnit.map((item,index) =>{
      // console.log('items',item);
   return ( 
    <Picker.Item label={item.title} value={item.id} key={index} />
   ) 
    }
)}
</Picker>
</View>
            {/* <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_unit}
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ Unit: text })}

            /> */}
            {this.state.bunchTrue==7?(<TextInput
              style={styles.inputTextView}
              keyboardType={"numeric"}
              placeholder={AppConst.inputPH_bunch}
              value={this.state.bunch}
              onChangeText={(text) => {this.bunchFunc(text)}}

            />):null}
            {this.state.bunchTrue==7?(<Text
              style={styles.TextView}>
              Total Price {this.state.totalPrice}
              </Text>):null}

            
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_detail}
              onChangeText={(text) => this.setState({ Details_1: text })}
            />

            <TextInput
              style={styles.inputTextView}
              placeholder={'Details 2'}
              onChangeText={(text) => this.setState({ Details_2: text })}
            />
            <Text style={styles.DescriptionStyle}>Description </Text>
            <TextInput
              style={styles.inputTextView}
              multiline={true}
              placeholder={'(Maximum 450 characters)'}
              onChangeText={(text) => this.setState({ Description: text })}
            />

          </ScrollView>
        </View>
        {/* <TouchableOpacity   onPress={() => this.props.navigation.goBack()} style={{ position: 'absolute', start: 20, top: 30, }}>
          <Image source={backIconWhite} style={styles.backIcon} />
        </TouchableOpacity> */}

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
  },
  ShareTextStyle: {
    color: '#2B2B2B',
    marginLeft: resp(15),
  },
  saveCancelButton: {
    fontSize: 17,
    borderBottomWidth: 1,
  },
  backIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },

  imageView: {
    borderRadius: 5,
    width: screenWidth,
    height: screenWidth,
  },
  DescriptionStyle: {
    marginTop: resp(20),
    fontSize: resp(16),
    color: "#2B2B2B",
  },
  DescriptionStyle2: {
    width: resp(335),
    marginTop: resp(5),
    fontSize: resp(13),
    color: "#000000",
  },
  inputTextView: {
    fontSize: 17,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 10
  },
  TextView:{
    fontSize: 16,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginLeft:2,
    height:40,
    marginTop:15
  },
  input1TextView: {
    fontSize: 17,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 1
  },
  container2: {
    flex: 1,
    marginBottom:resp(20),
    backgroundColor: 'white',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    marginTop: -50,
    paddingTop: 30,
    paddingStart: 30,
    paddingEnd: 30,
    height: resp(-50)
  },
  openButtonContainer: {
    marginTop: resp(10),
    flexDirection: 'row',
    width: resp(92),
    height: resp(24),
    borderColor: "#06BE7E",
    borderWidth: resp(2),
    borderRadius: resp(20),
    backgroundColor: '#e6f7f2',
  },
  AddIconStyle: {
    margin: resp(5)
  },
  openButtonStyle: {
    color: '#06BE7E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(0),
  },
  ShareContainer: {
    flexDirection: 'row',
    marginTop: resp(10),
    width: '90%',
    height: 50,

  },
  MoreTextStyle: {
    fontWeight: 'bold',
    marginLeft: resp(10),
    fontSize: resp(16),
    color: "#06BE7E",
  },

  ShareButtonContainer: {
    marginTop: resp(10),
    marginHorizontal: (5),
    flexDirection: 'row',
    width: resp(105),
    height: resp(26),
    borderColor: "#DDDDDD",
    borderWidth: resp(2),
    borderRadius: resp(20),
    backgroundColor: '#7F7F7F1A',
  },
});
