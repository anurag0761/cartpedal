import React, { Component } from 'react';
import { SafeAreaView, Dimensions, View, Text, FlatList,Alert, Modal, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity, YellowBox } from 'react-native'
import AppConst from '../Component/AppConst';
import AppHeader from '../Component/AppHeader';
import AppImageSlider from '../Component/AppImageSlider';
import { backIcon, logo, closeIcon, tickIcon, addIcon, editIcon, submitIcon, addIconPink, imagePlaceholder } from '../Component/Images';
import ImageSelectDialogs from '../Component/ImageSelectDialogs';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'
import resp from 'rn-responsive-font';
const MAX_IMAGE_SIZE = 5;
const MAX_INNER_IMAGE_SIZE = 5;
const screenWidth = Dimensions.get('screen').width;

export default class ProductMasterSaveScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageList: [],
      showImageSelectDialog: false,
      selectedImageIndex: -1,
      isInnerImageSelect: false,
      isProductEdit: false,
      userId: '',
      userAccessToken: '',
      spinner: '',
      showTick: null,
      fcmToken: '',
    }
  }

  componentDidMount() {
    // this.showLoading();
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      console.log("Edit user id token=" + token);
      if (token) {
        this.setState({ fcmToken: token });
        if(this.props.route.params){
          if(this.props.route.params.imageUri){
            let item=this.props.route.params.imageUri
            this.state.imageList.push(item)
          }
        }
      }
    });
    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
        this.setState({ userId: userId });
        console.log(" Edit user id ====" + this.state.userId);
        // this.ProductListCall()
      }
    });
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        this.setState({ userAccessToken: accessToken });
        console.log("Edit access token ====" + this.state.userAccessToken);
        //this.RecentUpdateCall();
        // this.NotSharedProduct();

      }

    });
  }
  showLoading() {
    this.setState({ spinner: true });
  }
  hideLoading() {
    this.setState({ spinner: false });
  }
  onImagePick(response) {
    const source = response;
    let imgOjc = {
      path: response.path,
      type: response.mime,
      data: response.data,
      fileName: response.modificationDate
    }

    if (!this.state.isInnerImageSelect) {
      let newImageArray = [];

      newImageArray.push(imgOjc);
      this.state.imageList.push(newImageArray)
      console.log('image list-----', this.state.imageList)
      if (this.state.imageList.length == 0) {
        this.setState({ selectedImageIndex: 0 })
      }
      else {
        this.setState({ selectedImageIndex: this.state.selectedImageIndex + 1 })
        console.log('image selceter-----', this.state.selectedImageIndex)
      }
    }
    else {
      this.state.imageList[this.state.selectedImageIndex].push(source);
    }
    this.setState({ isInnerImageSelect: false, showImageSelectDialog: false })
  }
  openImagePickerOption() {
    this.setState({ showImageSelectDialog: !this.state.showImageSelectDialog, isInnerImageSelect: false })
    this.imageSelectDialog.showMenu()
  }
  onImageSelect(index) {
    console.log('index number ', index);
    this.setState({ selectedImageIndex: index })
    this.setState({ showTick: index })
  }
  onInnerImageSelect() {
    this.setState({ showImageSelectDialog: !this.state.showImageSelectDialog, isInnerImageSelect: true })
    this.innerImageSelectDialog.showMenu()
  }

  removeInnerImage(index) {
    if (this.state.imageList[this.state.selectedImageIndex].length == 1) {
      this.removeImageFromList(this.state.selectedImageIndex)
      console.log('imageselecter====', this.state.selectedImageIndex)
    }
    else {
      this.state.imageList[this.state.selectedImageIndex].splice(index, 1);
    }
    this.setState({ imageList: this.state.imageList });
  }

  removeImageFromList(index) {
    this.state.imageList.splice(index, 1)
    this.setState({ selectedImageIndex: this.state.selectedImageIndex - 1 })
  }
  onTickShow = () => {
    this.setState({ showTick: !this.state.showTick })
  }
  renderImageList(item, index, separators) {
    console.log('selected', this.state.showTick);
    console.log('index inside', index);
    return (
      <TouchableOpacity key={index} activeOpacity={1} onLongPress={() => this.onImageSelect(index)} style={[styles.imageListContainView, index == MAX_IMAGE_SIZE - 1 && { marginEnd: 10 }]}>
        <Image style={styles.imageView} source={{ uri: this.state.imageList[index][0].path }} />
        <TouchableOpacity
          onPress={() => { this.removeImageFromList(index) }}
          style={[styles.imageOptionIcon, { position: 'absolute', top: 5, start: 5 }]}
        >
          <Image style={styles.imageOptionIcon} source={closeIcon} />
        </TouchableOpacity>

        {this.state.showTick == index ? (<TouchableOpacity
          style={[styles.imageOptionIcon, { position: 'absolute', top: 5, end: 5 }]}
        >
          <Image style={styles.imageOptionIcon} source={tickIcon} />
        </TouchableOpacity>) : null}

        {(item.length < MAX_INNER_IMAGE_SIZE) ?
          <TouchableOpacity
            style={[styles.imageOptionIcon, { height: 30, width: 30, position: 'absolute', bottom: 3, end: 3 }]}
            onPress={() => { this.onInnerImageSelect() }}
          >
            <Image style={[styles.imageOptionIcon, { height: 28, width: 28 }]} source={addIcon} />
          </TouchableOpacity> : null}
      </TouchableOpacity>
    )

  }

  renderInnerImageList(item, index, separators) {
    //    console.log('render Inner Images',item);
    return (
      <TouchableOpacity key={index} activeOpacity={1} style={[styles.imageListContainView, index == MAX_IMAGE_SIZE - 1 && { marginEnd: 10 }]}>
        <Image style={styles.innerImageView} source={{ uri: item.path }} />
        <TouchableOpacity
          onPress={() => { this.removeInnerImage(index) }}
          style={[styles.imageOptionIcon, { position: 'absolute', top: 5, start: 5 }]}
        >
          <Image style={styles.imageOptionIcon} source={closeIcon} />
        </TouchableOpacity>

      </TouchableOpacity>)
  }

  rendorImageSlider(item, index) {
    console.log('big silder', this.state.imageList[this.state.selectedImageIndex][index].path);
    return (
      <View key={index} style={styles.imageSliderBig}>
        <View style={{ flex: 1 }}>
          <Image style={{ flex: 1 }} source={{ uri: this.state.imageList[this.state.selectedImageIndex][index].path }} />
        </View>
      </View>
    )
  }

  onEditProduct() {
    if (this.state.showTick != null) {
      console.log('edit product', this.state.imageList[this.state.selectedImageIndex]);
      AsyncStorage.setItem('@imageData', JSON.stringify(this.state.imageList[this.state.selectedImageIndex])).then(succ => {
        this.props.navigation.navigate('EditProductScreen',{productMaster:'ProductImage'});
      });
    } else {
      alert("Please select one product to edit");
      console.log('imageselecterd===', this.state.imageList[this.state.selectedImageIndex])
    }
  }
  shareProduct = () => {

    AsyncStorage.getItem('@productMasterSave').then((id) => {
      if (id) {
        this.props.navigation.navigate('ShareWithScreen');
      } else {
        alert('Please upload the product');
      }
    });
  }
  createTwoButtonAlert = () =>{
    AsyncStorage.getItem('@productMasterSave').then((id) => {
        if (id) {
    Alert.alert(
      "Product Saved",
      "Product is saved Successfully",
      [
        { text: "OK", onPress: () => {this.props.navigation.goBack()} }
      ],
      { cancelable: false }
    );
} else {
    alert('Please upload the product');
  }
});
  }

  render() {
    console.log("render() --------------->")
    console.log("this.state.imageList.length" + this.state.imageList.length)
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Spinner
          visible={this.state.spinner}
          color='#F01738'
        />
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
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
          <View style={styles.SearchContainer}></View>
        </View>


        <View style={[styles.container]}>
          <View style={{ flex: 1 }}>
            {(this.state.selectedImageIndex >= 0) ?
              <AppImageSlider
                sliderImages={this.state.imageList[this.state.selectedImageIndex]}
                // sliderImages={this.state.imageList}
                rendorImages={(item, index) => this.rendorImageSlider(item, index)}
              /> :
              <View style={{ flex: 1 }}>
                <Image source={imagePlaceholder} style={[styles.imagePlaceholder]} />
              </View>}
          </View>

          <View style={[styles.imageSliderSmall]}>
            <ScrollView horizontal={true}>
              <FlatList
                horizontal={true}
                data={this.state.imageList}
                numColumns={1}
                renderItem={({ item, index, separators }) => (
                  this.renderImageList(item, index, separators)
                )}
              />


              {(this.state.imageList.length < MAX_IMAGE_SIZE) ?
                <View style={{ alignSelf: 'center' }}>
                  <TouchableOpacity style={[styles.addImageButton]} activeOpacity={1} onPress={() => this.openImagePickerOption()}>
                    <Image source={addIconPink} style={styles.addImageButtonText} />
                  </TouchableOpacity>
                  <ImageSelectDialogs
                    ref={(ref) => this.imageSelectDialog = ref}
                    style={{ position: 'absolute', }}
                    navigation={this.props.navigation}
                    onImagePick={(response) => { this.onImagePick(response) }}
                  />
                </View>
                : null}

            </ScrollView>
          </View>

          <View style={{ flexDirection: 'row', }}>
            {(this.state.selectedImageIndex >= 0) ?
              <TouchableOpacity
                style={{ alignSelf: 'flex-start', marginStart: 5 }}
                onPress={() => { this.onEditProduct() }}
              >
                <Image source={editIcon} style={styles.editIcon} />
              </TouchableOpacity> : null}
            <View style={{ flex: 1 }} />
           {this.state.imageList.length>0? (<TouchableOpacity
              onPress={() => {
                this.createTwoButtonAlert()
                // this.shareProduct()
              }}
              style={{ alignSelf: 'flex-end',backgroundColor:'#F11739',width:45,height:45,marginRight:12,borderRadius:5 }}>
              {/* <Image source={submitIcon} style={styles.submitIcon} /> */} 
              <View style={{justifyContent:'center',alignItems:'center'}}>
              <Icon name="floppy" size={35} color={"#fff"}  />
              </View>
            </TouchableOpacity>):null}
          </View>

          <View style={[styles.imageSliderSmall]}>
            <ScrollView
              horizontal={true}
            >
              <ImageSelectDialogs
                ref={(ref) => this.innerImageSelectDialog = ref}
                navigation={this.props.navigation}
                style={{ position: 'absolute', }}
                onImagePick={(response) => { this.onImagePick(response) }}
              />
              <FlatList
                horizontal={true}
                data={this.state.imageList[this.state.selectedImageIndex]}
                numColumns={1}
                renderItem={({ item, index, separators }) => (
                  this.renderInnerImageList(item, index, separators)
                )}
              />




            </ScrollView>
          </View>
        </View>
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
  centerRow: {
    flexDirection: 'row', flex: 1, justifyContent: 'center'
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
  SearchIconStyle: {
    margin: 5,
    marginRight: 20,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  header: {
    width: '100%',
    height: 50,
    padding: 10,
    flexDirection: 'row'
  },
  headerLogo: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  headerTitle: {
    fontSize: 20
  },
  backIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain'
  },
  imageSliderBig: {
    flex: 1,
    backgroundColor: '#e3e3e3'
  },
  imageSliderSmall: {
    justifyContent: 'center',
    marginTop: 5,
    minHeight: (screenWidth / 4)
  },
  imagePlaceholder: {
    width: screenWidth,
    height: 500,
    backgroundColor: '#fff',
    resizeMode: 'cover'
  },
  addImageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (screenWidth / 4) - 50,
    height: (screenWidth / 4) - 50,
    backgroundColor: 'pink',
    marginStart: 5,
    alignSelf: 'center',
    borderRadius: 5
  },
  addImageButtonText: {
    width: ((screenWidth / 4) - 25) / 3,
    height: ((screenWidth / 4) - 25) / 3,
  },
  imageListContainView: {
    borderRadius: 5, marginStart: 10,
    marginBottom: 15
  },
  imageView: {
    borderRadius: 5,
    width: (screenWidth / 4) - 10,
    height: (screenWidth / 4) + 10,
    backgroundColor: 'red'
  },
  innerImageView:
  {
    borderRadius: 5,
    width: (screenWidth / 4),
    height: (screenWidth / 4),
    backgroundColor: 'red'
  },
  imageOptionIcon: {
    height: 20, width: 20,
    resizeMode: 'contain'
  },
  editIcon: {
    height: 60, width: 60, resizeMode: 'contain'
  },
  submitIcon: {
    height: 55, width: 55, resizeMode: 'contain'
  }

});