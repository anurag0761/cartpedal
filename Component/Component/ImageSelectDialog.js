
import React, { Component } from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Menu, { MenuItem } from 'react-native-material-menu';
import firebase from 'react-native-firebase';

export default class ImageSelectDialog extends Component {
  constructor(props) {
      super();
      this.state = { 
        
        
      };

      
}
 
showMenu = () => {
  this._menu.show();
};
hideMenu = () => {
  this._menu.hide();
};



componentWillUnmount()
{
console.log('props',JSON.stringify(this.props))
}

openCamera()
{
  this.hideMenu()
  const options={}
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
    includeBase64:true
  }).then(image => {
    this.onImagePick(image)
    console.log('picimage===',image);
  }).catch(error=>{
    alert('eror',error)
  });
  // ImagePicker.launchCamera(options, (response) => 
  // {
  //   this.onImagePick(response)
  // });
}
openCameraCoverPhoto()
{
  this.hideMenu()
  const options={}
  ImagePicker.openCamera({
    width: 420,
    height: 220,
    cropping: true,
    includeBase64:true
  }).then(image => {
    this.onImagePick(image)
    console.log('picimage===',image);
  });
  // ImagePicker.launchCamera(options, (response) => 
  // {
  //   this.onImagePick(response)
  // });
}
openGalleryCoverPhoto()
{
  this.hideMenu()
  const options={}
  ImagePicker.openPicker({
    width: 420,
    height: 220,
    cropping: true,
    includeBase64:true
  }).then(image => {
    this.onImagePick(image)
    console.log('pickimage==',image);
  }).catch(error=>{
    // firebase.crashlytics().recordError(error);
    });
  // ImagePicker.launchImageLibrary(options, (response) => { 
  //   this.onImagePick(response)
  // });
}

openGallery()
{
  this.hideMenu()
  const options={}
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
    includeBase64:true
  }).then(image => {
    this.onImagePick(image)
    console.log('pickimage==',image);
  }).catch(error=>{
    // firebase.crashlytics().recordError(error); 
   });
  // ImagePicker.launchImageLibrary(options, (response) => { 
  //   this.onImagePick(response)
  // });
}


onImagePick(response)
{
  // console.log('Response = ', response);
  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    const source = { uri: response.uri };
 
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    this.props.onImagePick(response)
    this.setState({
      avatarSource: source,
    });
  }
}

render() {
  const textStyle ={fontSize:17,borderBottomColor:"#e3e3e3",borderBottomWidth:1,paddingBottom:3}
    return(
      <Menu
        ref={(ref) => this._menu = ref }>
        <MenuItem onPress={() => {this.openCamera()}}>{'Camera'}</MenuItem>
        <MenuItem onPress={() => {this.openGallery()}}>{'Gallery'}</MenuItem>
        <MenuItem onPress={() => {
          this.hideMenu()
           this.props.navigation.navigate('ProductListScreen',{screenPer:'ImageHome'})}}>{'Product Master'}</MenuItem>
      </Menu>
    );
 }

}
