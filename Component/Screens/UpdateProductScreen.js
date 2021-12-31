import React from 'react';
import { Dimensions, FlatList, Image,Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppConst from '../Component/AppConst';
import AppImageSlider from '../Component/AppImageSlider';
import resp from 'rn-responsive-font';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from "native-base";
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import {BASE_URL} from '../Component/ApiClient';
//import * as ApiClient from '../Component/ApiClient';
  
import _ from 'lodash';


//import RNPickerSelect from 'react-native-picker-select';
const screenWidth = Dimensions.get('screen').width;

const optionValue = [
  {label: 'Item1', value: 'Item1'},
  {label: 'Item2', value: 'Item2'},
  {label: 'Item3', value: 'Item3'},
];

export default class UpdateProductScreen extends React.Component {
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
      price: '',
      Unit: '',
      isProfileModalVisible:false,
      bunch: '',
      isModalVisible: false,
      Details_1: '',
      Details_2: '',
      imageList: [],
      Description: '',
      productId:'',
      peopleCount:'',
      product_item:'',
      sharedPeople:'',
      showPicker:false,
      newImageArr:[],
      peoplecontact:'',
      fcmtoken:'',
      language:'',
      defaultCategory:'',
      Unitid:'',
      defaultUnit:'',
      editImg:'',
      baseUrl: `${BASE_URL}`,
      Share:'',
      CategoryList: [],
      ProductUnit:[],
      selected1: 'key1',
            languages: [],
            results: {
                items: []
            }
    }
    let param = this.props.route.params;
    if (param && param.images) {
      this.state.imageList=param.images;
      this.state.product_item=param.product_item;
      console.log('images',this.props.route.params.images);
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('@fcmtoken').then(token => {
      if (token) {
        let editImageArr=[]
        let itemsImage=this.props.route.params.product_item;
        itemsImage.images.map(item=>{
          editImageArr.push(item.file_url);
        })
        this.setState({editImg:editImageArr});
        this.setState({fcmtoken: JSON.parse(token)})
        console.log('device fcm token ====' + this.state.fcmtoken);
        let countPeople=this.props.route.params.peopleListCount;
        this.setState({peopleCount:countPeople});
        console.log('count people',countPeople);
        let sharedPeople=this.props.route.params.sharedContactsName;
        this.setState({sharedPeople:sharedPeople});
        let peopleCOntact=this.props.route.params.peopleContact;
        let peopleSingle=peopleCOntact.join(',');
        this.setState({peoplecontact:peopleSingle});
        console.log('people contacts',peopleCOntact);
        console.log('shared people',JSON.stringify(sharedPeople));
      }
    });
    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
        this.setState({ userId: userId });
        console.log(" Edit user id ====" + this.state.userId);
        this.setState({productId:this.props.route.params.product_item.product_id});
        let item=this.props.route.params.product_item
        this.setState({Category:item.categoryid,defaultCategory:item.category,Name:item.name,price:item.price.toString(),Unitid:item.unitid,Unit:item.unit,defaultUnit:item.unit,bunch:item.bunch,Details_1:item.detailone,
          Details_2:item.detailtwo,Description:item.description,Share:item.share});
          console.log('item',item);
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

  removeShareUser=(contactNumber,identity)=>{
    let formData = new FormData()
      console.log(identity);
    formData.append('user_id', this.state.userId);
    formData.append('product_id',this.state.productId);
    formData.append('contact', contactNumber);
    console.log('form data==' + JSON.stringify(formData))

    var CartList = this.state.baseUrl + 'api-product/cart-list'
    var EditProfileUrl = `${BASE_URL}api-product/remove-share-user`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token:this.state.fcmtoken,
        device_type: 'android',
        // Authorization: 'Bearer' + this.state.access_token,  
        Authorization: JSON.parse(this.state.access_token),

      }),
      body: formData,
    })

      .then(response => response.json())
      .then(responseData => {
        //   this.hideLoading();
        if (responseData.code == '200') {
        //  Toast.show(responseData.message);
        let item=this.state.sharedPeople;
        let filterData=item.filter(items=>items.mobile!==contactNumber);
        this.setState({sharedPeople:filterData});
        if(identity=='publicuser'){
        this.setState({peopleCount:0});
        }
        console.log('filter data',filterData);
       console.log('response of reomve contact',JSON.stringify(responseData));
        } else {
          console.log(responseData.data);
        }

        //console.log('Edit profile response object:', responseData)
        console.log('contact list response object:', JSON.stringify(responseData))
        // console.log('access_token ', this.state.access_token)
        //   console.log('User Phone Number==' + formData.phone_number)
      })
      .catch(error => {
        //  this.hideLoading();
        console.error(error)
      })
      .done()
  }

  showLoading() {
    this.setState({ loading: true });
  }
  closeProfileModal= ()=> {
    this.setState({isProfileModalVisible: false})
  }

  hideLoading() {
    this.setState({ loading: false });
  }
  CheckTextInput = () => {


    if (this.state.Category === '') {
      //Check for the Name TextInput
      alert('Please Enter Category ');

    }
    else if (this.state.Name === '') {
      alert('Please Enter Name');
    }
    else if (this.state.Price === ' ') {
      alert('Please Enter Price');
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
      this.showLoading();
      this.AddProductCall();


    }
  };

  ProductCategoryCall() {
    let formData = new FormData()

    console.log('form data==' + formData)
   
    var urlProduct = `${BASE_URL}api-product/product-category-list`
    console.log('urlProduct :' + urlProduct)
    fetch(urlProduct, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token:this.state.fcmtoken,
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
       //   Toast.show(responseData.message);
          this.setState({ CategoryList: responseData.data })
          //  this.SaveLoginUserData(responseData);

          console.log('response object actagegg:', responseData)

        } else {
          // alert(responseData.data);
          console.log(responseData.data)

        }
      })
      .catch(error => {
        //  this.hideLoading();
        console.error(error)
      })

      .done()


  }
  openCamara() {
    this.setState({ isProfileModalVisible: !this.state.isProfileModalVisible})
   // this.imageSelectDialog.openCamera()
   ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
    includeBase64:true
  }).then(image => {
    let newImage=this.state.newImageArr;
    let imagePervious=this.state.imageList;
    // response.map((item)=>{
     let objImage={
       path:image.path,
       type:image.mime,
       data:image.data,
       fileName:image.modificationDate
     }
     let newObj={
      file_url:image.path
     }
     newImage.push(objImage);
     imagePervious.unshift(newObj);
     this.setState({imageList:imagePervious});
     this.setState({newImageArr:newImage});
    console.log('pickedImage===',image);
  });
  }
  openImageGallery() {
    this.setState({ isProfileModalVisible: !this.state.isProfileModalVisible })
  //  this.imageSelectDialog.openGallery()
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
    includeBase64:true
  }).then(image => {
    let newImage=this.state.newImageArr;
    let imagePervious=this.state.imageList
    // response.map((item)=>{
     let objImage={
       path:image.path,
       type:image.mime,
       data:image.data,
       fileName:image.modificationDate
     }
     let newObj={
      file_url:image.path
     }
     newImage.push(objImage);
     imagePervious.unshift(newObj);
     this.setState({imageList:imagePervious});
     this.setState({newImageArr:newImage});
    // this.onImagePick(image)
    console.log('image pic===',this.state.imageList);
  });
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
          this.setState({ ProductUnit: responseData.data })
          //  this.SaveLoginUserData(responseData);

          console.log('response object actagegg:', responseData)

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

   AddProductCall() {
     console.log(JSON.stringify({
      user_id:this.state.userId,product_id:this.state.productId,name:this.state.Name,upload:this.state.newImageArr,imageids:'',category:this.state.Category,unit:this.state.Unitid,price:this.state.price,description:this.state.Description,bunch:this.state.bunch,
      detailone:this.state.Details_1,detailtwo:this.state.Details_2
    }));
    var otpUrl = `${BASE_URL}api-product/edit-product`
    console.log('Add product Url:' + otpUrl)
     fetch(`${BASE_URL}api-product/edit-product`,{
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
        device_id:'1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization:JSON.parse(this.state.access_token),
      },
      body:JSON.stringify({
        user_id:this.state.userId,product_id:this.state.productId,name:this.state.Name,upload:this.state.newImageArr,imageids:'',category:this.state.Category,unit:this.state.Unitid,price:this.state.price,description:this.state.Description,bunch:this.state.bunch,
        detailone:this.state.Details_1,detailtwo:this.state.Details_2
      }),
    }).then(response => response.json())
      .then(responseData => {
        this.hideLoading();
        if (responseData.code == '200') { 
          // this.props.navigation.navigate('StoryViewScreen')
          console.log('response object:', JSON.stringify(responseData))
          Toast.show(responseData.message);
          this.props.navigation.navigate('ProfileScreen',{onGoBack: () => this.ProductListCall()});   
          // this.SaveProductListData(response)
        } else {
          console.log(responseData.data);
          // alert(responseData.data.password)
        }
        console.log('response object:', JSON.stringify(responseData))
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
  deleteProduct=()=>{
    this.showLoading();
    var urlProductUnit = `${BASE_URL}api-product/delete-product?user_id=${this.state.userId}&product_id=${this.state.productId}`
    console.log('urlProduct :' + urlProductUnit)
    fetch(urlProductUnit, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token:  this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
      // body: JSON.stringify({
      //   user_id:this.state.userId
      // }),
    })
      .then(response => response.json())
      .then(responseData => {
        this.hideLoading();
        if (responseData.code == '200') {
          Toast.show(responseData.message);
          this.props.navigation.navigate('ProfileScreen');
          console.log('response object actagegg:', responseData)
        } else {
          this.hideLoading();
          // alert(responseData.data);
          console.log(responseData.data)
        }
        })
      .catch(error => {
         this.hideLoading();
        console.error(error)
      })

      .done()

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
 
  openDeleteModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
  }
  AddMoreShare=()=>{
    let formData = new FormData()
  
    formData.append('user_id', this.state.userId);
    formData.append('product_id',this.state.productId);
    formData.append('contacts', contactNumber);
    console.log('form data==' + JSON.stringify(formData))

    // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var EditProfileUrl = `${BASE_URL}api-product/edit-product-share`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token:this.state.fcmtoken,
        device_type: 'android',
        // Authorization: 'Bearer' + this.state.access_token,  
        Authorization: JSON.parse(this.state.access_token),

      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.code == '200') {
        let item=this.state.sharedPeople;
        let filterData=item.filter(items=>items.mobile!==contactNumber);
        this.setState({sharedPeople:filterData});
        console.log('filter data',filterData);
       console.log('response of reomve contact',JSON.stringify(responseData));
        } else {
          alert
        }
        console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
        console.error(error)
      })
      .done()
  }
  closeModal() {
    this.setState({ isModalVisible: false });
  }
  renderInnerImageList(item, index, separators) {
    console.log('render Item',item);
    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
        <Image style={styles.imageView} source={{uri:item.file_url}} />
      </TouchableOpacity>
    )
  }
  _handleMultiInput = (name) => {
    return (text) => {
        this.setState({ [name]: text })
    }
}
customButton=()=>{
  this.setState({isProfileModalVisible:false})
  console.log('covers',JSON.stringify(this.state.editImg))
  console.log('imagewith id',JSON.stringify(this.props.route.params.product_item))
  this.props.navigation.navigate('EditImageUpdateProduct',{covers:this.state.editImg,imageWithID:this.props.route.params.product_item});
}

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
          
        {/* <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          
        <Image style={styles.imageView} source={{uri:this.state.imageList}} />
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{position: 'absolute',start : 20,top: 30,backgroundColor:'red'}}>
            <Image  source={require('../images/back_blck_icon.png')} style={styles.backIcon}/>
        </TouchableOpacity> */}
         <TouchableOpacity style={styles.editImageBox} onPress={() => this.props.navigation.goBack()}>
        <Image style={styles.editImage} source={require('../images/back_blck_icon.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editImageBox1} onPress={()=>{this.setState({isProfileModalVisible:true})}}>
        <Image style={styles.editImage1} source={require('../images/edit_product.png')} />
      </TouchableOpacity>

          <AppImageSlider
            sliderImages={this.state.imageList}
            rendorImages={(item, index) => this.renderInnerImageList(item, index)}
          />
        </View>
        <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isModalVisible}
              onRequestClose={() => this.closeModal()}
            >

              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { this.closeModal() }}>
                    <Image
                      source={require('../images/modal_close.png')}
                      style={styles.CloseButtonStyle}
                    />
                  </TouchableOpacity>

                  <View style={styles.DeleteContainer}>
                    <Image
                      source={require('../images/modal_delete.png')}
                      style={styles.DeleteButtonStyle}
                    />
                    <Text style={styles.DeleteStutsStyle}>Delete Product</Text>
                  </View>
                  <Text style={styles.DeleteStutsDiscraptionStyle}>Are you sure you want to remove this Product?</Text>

                  <View style={styles.ButtonContainer}>
                    <View style={styles.EmptyButtonCOntainer}></View>
                    <TouchableOpacity style={styles.YesButtonContainer}
                      onPress={this.deleteProduct}>
                      <Text style={styles.YesTextStyle}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.NoButtonContainer}
                      onPress={() => this.setState({ isModalVisible: false })}>
                      <Text style={styles.NoTextStyle}>NO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

        <View style={styles.container2}>
          <ScrollView
            showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => {
                this.CheckTextInput()
                // this.props.navigation.navigate('StoryViewScreen')
              }}>
                <Text style={[styles.saveCancelButton, { borderBottomColor: 'green', color: 'green' }]}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                    this.openDeleteModal()
     
                  }}>
                <Text style={[styles.saveCancelButton, { borderBottomColor: 'red', color: 'red', marginStart: 20 }]}>Delete</Text>
              </TouchableOpacity>
            </View>
             
            <View style={styles.inputTextView}>
            <Picker 
            // placeholder={this.state.Category}
  selectedValue={this.state.Category}
  style={{height: 50, width: screenWidth-55}}
  onValueChange={(itemValue, itemIndex) => {
    console.log('item value',itemValue);
    if(itemValue != "0")
    {this.setState({Category: itemValue});
  }
    else alert('Please select new category');
  }  
  }>
    <Picker.Item color="grey" label={this.state.defaultCategory}  value={"0"}  />
    {this.state.CategoryList.map((item,index) =>{
      console.log('items',item);
   return ( 
    <Picker.Item  label={item.title} value={item.id} key={index} />
   ) 
    }
)}
</Picker>
            </View>
             {/* <TextInput
               style={styles.input1TextView}
              placeholder={AppConst.inputPH_select_cat}
              value={this.state.Category}
              onChangeText={this._handleMultiInput('Category')}
              editable={true}
            /> */}

         
            <TextInput
              style={styles.input1TextView}
              placeholder={AppConst.inputPH_enter_name}
              value={this.state.Name}
              onChangeText={this._handleMultiInput('Name')}
              editable={true}
            />
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_price}
              value={this.state.price}
              keyboardType={'numeric'}
              onChangeText={this._handleMultiInput('price')}
              // value={this.state.product_item.price}
              editable={true}
            />
        <View style={styles.inputTextView}>
            <Picker 
            
  selectedValue={this.state.Unitid}
  style={{height: 50, width: screenWidth-55}}
  
  onValueChange={(itemValue, itemIndex) => {
    if(itemValue != "0")this.setState({Unit: itemValue,Unitid:itemValue})
    else alert('Please select correct unit');
  }  
  }>
   <Picker.Item color="grey" label={this.state.defaultUnit}  value={"0"}  />
    {this.state.ProductUnit.map((item,index) =>{
      console.log('items',item);
   return ( 
    <Picker.Item label={item.title} value={item.id} key={index} />
   ) 
    }
)}
</Picker>
</View>
             
             {/* <TextInput
              style={styles.inputTextView}
              placeholder="unit"
              value={this.state.Unit}
              keyboardType={'numeric'}
              onChangeText={this._handleMultiInput('Unit')}
              editable={true}

            /> */}
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_bunch}
              value={this.state.bunch}
              onChangeText={this._handleMultiInput('bunch')}
              editable={true}

            />
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_detail}
              value={this.state.Details_1}
              maxLength={50}
              onChangeText={this._handleMultiInput('Details_1')}
              editable={true}
            />

            <TextInput
              style={styles.inputTextView}
              placeholder={'Details 2'}
             multiline={true}
             numberOfLines={4}
             maxLength={50}
             onChangeText={this._handleMultiInput('Details_2')}
              value={this.state.Details_2}
              editable={true}
            />
            <Text style={styles.DescriptionStyle}>Description </Text>
            <TextInput
              style={styles.DescriptionInputTextView}
              placeholder={'(Maximum 150 characters)'}
              multiline={true}
              value={this.state.Description}
              onChangeText={this._handleMultiInput('Description')}
              editable={true}
            />
             <Text style={styles.DescriptionStyle}>Shared With</Text>
             <TouchableOpacity style={styles.openButtonContainer}
                  onPress={() => {
                    AsyncStorage.setItem('@product_id',JSON.stringify(this.state.productId)).then(succ=>{
                      this.props.navigation.navigate('AddMoreShare',{share:this.state.Share})
                    })  
                    //  Toast.show('CLicked Share Link', Toast.LONG)
                  }}>
                        <Image
                    source={require('../images/add_Icon.png')}
                    style={styles.AddIconStyle}
                  />
                  <Text style={styles.openButtonStyle}>Add More</Text>

                </TouchableOpacity>
                <View style={styles.ShareContainer}>
                <View style={styles.ShareButtonContainer}>  
                  <Text style={styles.ShareTextStyle}>{this.state.peopleCount} Public</Text>
                  {this.state.peopleCount!==0?(<TouchableOpacity onPress={() => {
                    this.removeShareUser(this.state.peoplecontact,'publicuser')
                    //  Toast.show('CLicked Share Link', Toast.LONG)
                  }}>
                  <Image
                    source={require('../images/close_button.png')}
                    style={styles.AddIconStyle}
                  />
                  </TouchableOpacity>):null}
                </View>
                <FlatList
              style={{marginBottom:10,flex:1}}
              data={this.state.sharedPeople}
              // renderItem={({ item }) => <Item item={item} />}
              keyExtractor={(item,index) => index}
              numColumns={2}
              ListEmptyComponent={this.ListEmpty}
              renderItem={({item}) => {
                console.log('shared item data',item);
                let name=item.name;
                if(name.length>8){
                 name= name.substring(0,8)
                }
                return(<View style={styles.ShareButtonContainer}
                  >
                   
                <Text style={styles.ShareTextStyle}>{name}</Text>
                <TouchableOpacity  onPress={() => {
                    this.removeShareUser(item.mobile,'appuser')
                    //  Toast.show('CLicked Share Link', Toast.LONG)
                  }}>
                  <Image
                    source={require('../images/close_button.png')}
                    style={styles.AddIconStyle}
                  />
                </TouchableOpacity >
                </View>)
              }
            }
            />

                </View>
                {/* <Text style={styles.MoreTextStyle}>More</Text> */}
          </ScrollView>
        </View>
        <Modal
              animationType='slide'
              transparent={true}
              visible={this.state.isProfileModalVisible}
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
                      this.openImageGallery();
                    }}>
                  <Text style={styles.OptionsProfileModalStyle}> Gallery</Text>
                  </TouchableOpacity>
                  
                 <TouchableOpacity
                  onPress={() => {
                      this.openCamara();
                    }}>
                 <Text style={styles.Options2ProfileModalStyle}> Camera</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                 onPress={() => {
                      this.customButton();
                    }}>
                 <Text style={styles.Options2ProfileModalStyle}>Edit Image</Text>
                   </TouchableOpacity>
                
                  
                 
                </View>
              </View>
            </Modal>
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
  TitleProfileModalStyle: {
    alignContent:'flex-start',
    fontWeight: 'bold',
    color: '#000',
    
    width: resp(207),
    fontSize: resp(16),
  },
  OptionsProfileModalStyle: {
    alignContent:'flex-start',
   marginTop:resp(30),
    color: '#000',
    
    width: resp(207),
    fontSize: resp(16),
  },
  Options2ProfileModalStyle: {
    alignContent:'flex-start',
   marginTop:resp(5),
    color: '#000',
    
    width: resp(207),
    fontSize: resp(16),
  },
  DescriptionStyle:{
    marginTop:resp(20),
    fontSize:resp(16),
    color:"#2B2B2B",
},
  ShareTextStyle: {
    color: '#2B2B2B',
    marginLeft: resp(5),
    width:'auto'
  },
  saveCancelButton: {
    fontSize: 17,
    borderBottomWidth: 1,
  },
  backIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    backgroundColor:'#fff'
  },
  editImageBox:{
    top: 10,
    width: 40,
    height: 40,
    backgroundColor:'#fff',
    borderRadius:150,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
    zIndex:1
  },
  editImage:{
width:20,
height:20
  },
  editImageBox1:{
    top: 10,
    width: 40,
    height: 40,
    backgroundColor:'#fff',
    borderRadius:150,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 60,
    zIndex:1
  },
  editImage1:{
width:40,
height:40
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
    color:'black',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 5,
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
    }
    },
  DescriptionInputTextView: {
    fontSize: 17,
    color:'black',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    flexDirection:'row',
    marginTop: 5,
    marginBottom:resp(25),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    width: 300,
    height: 250,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  CloseButtonStyle: {
    marginRight: resp(20),
    alignSelf: 'flex-end',
  },
  DeleteContainer: {
    marginTop: resp(10),
    margin: resp(20),
    flexDirection: 'row',

  },
  DeleteButtonStyle: {
    alignSelf: 'flex-start',
  },
  DeleteStutsStyle: {
    fontWeight: 'bold',
    fontSize: resp(20),
    marginLeft: resp(10),
    marginBottom: 10,
    color: '#2B2B2B'
  },
  DeleteStutsDiscraptionStyle: {
    marginLeft: resp(55),
    marginTop: resp(-20),
    color: '#7F7F7F',
    width: resp(207),
    fontSize: resp(14),
  },
  ButtonContainer: {
    height: resp(50),
    marginTop: resp(20),
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

  },
  EmptyButtonCOntainer: {
    flex: 0.2,

  },
  YesButtonContainer: {
    flex: 0.4,
    marginHorizontal: resp(10),
    marginLeft: resp(-10),
    width: resp(95),
    height: resp(40),
    backgroundColor: '#06BE7E',
    borderRadius: resp(40)
  },
  NoButtonContainer: {
    flex: 0.4,
    marginRight: resp(20),
    width: resp(95),
    height: resp(40),
    backgroundColor: '#3C404333',
    borderRadius: resp(40)
  },
  YesTextStyle: {
    marginTop: resp(10),
    alignSelf: 'center',
    fontSize: resp(15),
    color: '#FFFFFF'
  },
  NoTextStyle: {
    marginTop: resp(10),
    alignSelf: 'center',
    fontSize: resp(15),
    color: '#7F7F7F'
  },
  input1TextView:{
    fontSize: 17,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 1,
    color:'black'
  },
  container2: {
    flex: 1,
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
    width: resp(100),
    height: resp(24),
    borderColor: "#06BE7E",
    borderWidth: resp(2),
    borderRadius: resp(20),
    backgroundColor: '#e6f7f2',
  },
  AddIconStyle: {
    margin: resp(5),
    // position:'absolute',
    justifyContent:'flex-end'
    
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
    width: '100%',
    height: '100%',

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
    marginBottom:10,
    flexDirection: 'row',
    flexWrap:'wrap',
    width: resp(105),
    height: resp(26),
    borderColor: "#DDDDDD",
    borderWidth: resp(2),
    borderRadius: resp(20),
    backgroundColor: '#7F7F7F1A',
  },
});
