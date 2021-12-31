import React, {Component} from 'react';
import {SafeAreaView,Dimensions, View,Text,FlatList,Modal, StyleSheet, StatusBar,Image, ScrollView, TouchableOpacity, YellowBox} from 'react-native'
import AppConst from '../Component/AppConst';
import AppHeader from '../Component/AppHeader';
import AppImageSlider from '../Component/AppImageSlider';
import {backIcon,logo,closeIcon,tickIcon,addIcon,editIcon,submitIcon, addIconPink, imagePlaceholder} from '../Component/Images';
// import ImageSelectDialog from '../Component/ImageSelectDialog';
import Menu, { MenuItem } from 'react-native-material-menu';
import ImagePicker from "react-native-image-picker";
import AsyncStorage from '@react-native-community/async-storage';


const MAX_IMAGE_SIZE = 5;
const MAX_INNER_IMAGE_SIZE =5;
const screenWidth = Dimensions.get('screen').width;

export default class HomeScreen extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imageList : [],
            avatarSource:'',
            showImageSelectDialog : false,
            selectedImageIndex : -1,
            isInnerImageSelect : false,
            isProductEdit : false             
        }
    }

  onSelectedImage(response)
  {
    const source =  response;
    console.log('response',source);

      if(!this.state.isInnerImageSelect)
      {
        let newImageArray = [];
        newImageArray.push(source);
        this.state.imageList.push(newImageArray)
            
          if(this.state.imageList.length == 0)
          {
              this.setState({selectedImageIndex : 0})
          }
          else
          {
            this.setState({selectedImageIndex : this.state.selectedImageIndex+1})
          }    
      }
      else
      {
        this.state.imageList[this.state.selectedImageIndex].push(source);
      }
     this.setState({isInnerImageSelect : false, showImageSelectDialog : false})
  }
  openCamera()
{
  this.hideMenu()
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.launchCamera(options, (response) => 
  {
    
    this.onImagePick(response)
  });
}

openGallery()
{
  this.hideMenu()
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  // ImagePicker.openPicker({
  //   multiple: true
  // }).then(images => {
  //   this.onSelectedImage(images);
  //   console.log('crop picker',images);
  // });
  ImagePicker.launchImageLibrary(options, (response) => {
    console.log('gallery respone',response);
    this.onImagePick(response)
  });
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
    // this.props.onImagePick(response)
    this.onSelectedImage(response);
    // this.se
    this.setState({
      avatarSource: source,
    });
  }
}

  openImagePickerOption()
  {
      this.setState({showImageSelectDialog : !this.state.showImageSelectDialog, isInnerImageSelect: false });
      this.showMenu();
   }
   showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };

  onImageSelect(index)
  {
      this.setState({selectedImageIndex : index})
  }
  onInnerImageSelect()
  {
    this.setState({showImageSelectDialog : !this.state.showImageSelectDialog, isInnerImageSelect: true })
    this.showMenu()
   }

  removeInnerImage(index)
  {
    if(this.state.imageList[this.state.selectedImageIndex].length == 1)
    {
        this.removeImageFromList(this.state.selectedImageIndex)
    }
    else
    {
        this.state.imageList[this.state.selectedImageIndex].splice(index,1);
    }
    this.setState({imageList : this.state.imageList});
  }

  removeImageFromList(index)
  {
    this.state.imageList.splice(index,1)
    this.setState({selectedImageIndex : this.state.selectedImageIndex-1});
  }
  
  renderImageList(item, index, separators)
  {
    // console.log("image",this.state.imageList);
    // console.log("index",this.state.imageList[index][0].uri);
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => this.onImageSelect(index)} style={[styles.imageListContainView, index == MAX_IMAGE_SIZE-1 && {marginEnd:10}]}>
                <Image style={styles.imageView} source={this.state.avatarSource}/>
                {/* <Text>hello23</Text> */}
                <TouchableOpacity
                    onPress={() => {this.removeImageFromList(index)}}
                    style={[styles.imageOptionIcon,{position:'absolute', top:5,start:5}]}
                >
                    <Image style={styles.imageOptionIcon} source={closeIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.imageOptionIcon,{position:'absolute', top:5,end:5}]}
                >
                    <Image style={styles.imageOptionIcon} source={tickIcon} />
                </TouchableOpacity>

                {(item.length < MAX_INNER_IMAGE_SIZE)?
                <TouchableOpacity
                    style={[styles.imageOptionIcon,{height:30,width:30, position:'absolute', bottom:3,end:3}]}
                    onPress={() => {this.onInnerImageSelect()}}
                >
                    <Image style={[styles.imageOptionIcon,{height:28,width:28}]} source={addIcon} />
                </TouchableOpacity>:null}

            </TouchableOpacity>
        )

   }
   
   renderInnerImageList(item, index, separators)
   {
    return(
        <TouchableOpacity activeOpacity={1} style={[styles.imageListContainView, index == MAX_IMAGE_SIZE-1 && {marginEnd:10}]}>
            <Image style={styles.innerImageView} source={{uri:this.state.imageList[this.state.selectedImageIndex][index].uri}}/>
            {/* <Text>hello89</Text> */}
            <TouchableOpacity
                onPress={() => {this.removeInnerImage(index)}}
                style={[styles.imageOptionIcon,{position:'absolute', top:5,start:5}]}
            >
                <Image style={styles.imageOptionIcon} source={closeIcon} />
            </TouchableOpacity>

        </TouchableOpacity>)
   }
   rendorImageSlider(item, index)
   {
     console.log('large image data',this.state.imageList[this.state.selectedImageIndex][index]);
       return (
        <View style={styles.imageSliderBig}>
            <View style={{flex:1}}>
           
                    <Image style={{flex:1}} source={{uri: this.state.imageList[this.state.selectedImageIndex][index].uri}}/>
            </View>
        </View>       
       )
   }
   onEditProduct()
   {
     console.log(this.state.imageList[this.state.selectedImageIndex]);
     AsyncStorage.setItem('@imageData',JSON.stringify(this.state.imageList[this.state.selectedImageIndex]))
    this.props.navigation.navigate('EditProductScreen');
   }
  
  render() {
      // console.log("render() --------------->")
      // console.log(this.state.imageList);
    return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <View style={[styles.header, this.props.headerStyle ?this.props.headerStyle:{} ]}>
        <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
          <Image source={backIcon} style={styles.backIcon}/>
          </TouchableOpacity>

            <View style={styles.centerRow}>
                <Image source={logo} style={styles.headerLogo}/>
                <Text style={styles.headerTitle}>{AppConst.AppName}</Text>
            </View>
           <View style={{flexDirection:'row',position:'absolute',end:0,alignSelf:'center'}}>
           {(this.props.rigthMenu)?
           this.props.rigthMenu:null}
           </View> 
        </View>
        <View style={[styles.container]}>
          <View style={{flex:1}}>
            {(this.state.selectedImageIndex>=0 )?
            <AppImageSlider
                sliderImages={this.state.imageList[this.state.selectedImageIndex]}
                rendorImages={(item, index) => this.rendorImageSlider(item, index)}
            />: 
            <View style={{flex:1 }}>
              <Image source={imagePlaceholder} style={[styles.imagePlaceholder]} />  
            </View>}
            </View>

            <View style={[styles.imageSliderSmall]}>
            <ScrollView horizontal={true}>
                    <FlatList
                        horizontal={true}
                        data={this.state.imageList}
                        numColumns={1}
                        renderItem={({item, index, separators}) => (
                            this.renderImageList(item,index,separators)
                        )}
                    />
                    {(this.state.imageList.length < MAX_IMAGE_SIZE)?
                        <View style={{alignSelf:'center'}}>
                            <TouchableOpacity style={[styles.addImageButton]} activeOpacity={1} onPress={() => this.openImagePickerOption()}>
                                        <Image source={addIconPink} style={styles.addImageButtonText}/>
                                        {/* <Text>Hi</Text> */}
                            </TouchableOpacity>
                            {/* <ImageSelectDialog
                                ref={(ref) => this.imageSelectDialog = ref}
                                style={{position:'absolute', end:10}}
                                onImagePick={(response) => {this.onImagePick(response)}}   
                            /> */}
                            <Menu
        ref={(ref) => this._menu = ref }>
        <MenuItem onPress={() => {this.openCamera()}}>{'Camera'}</MenuItem>
        <MenuItem onPress={() => {this.openGallery()}}>{'Gallery'}</MenuItem>
        <MenuItem onPress={() => {}}>{'Product Master'}</MenuItem>
      </Menu>
                        </View>
                    :null}

            </ScrollView>
            </View>

            <View style={{flexDirection:'row',}}>
                {(this.state.selectedImageIndex >= 0)?
                <TouchableOpacity
                            style={{alignSelf:'flex-start',marginStart:5}} 
                            onPress={() => {this.onEditProduct()}}   
                        >
                        <Image source={editIcon} style={styles.editIcon}/>
               </TouchableOpacity>:null}
                    <View style={{flex:1}} />
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('ShareWithScreen')
                }}
                style={{alignSelf:'flex-end',marginEnd:20}}>
                <Image source={submitIcon} style={styles.submitIcon} />

            </TouchableOpacity>
            </View>

            <View style={[styles.imageSliderSmall]}>
            <ScrollView
                horizontal={true}
             >
                    <FlatList
                        horizontal={true}
                        data={this.state.imageList[this.state.selectedImageIndex]}
                        numColumns={1}
                       
                    />
                     <Menu
         ref={(ref) => this._menu = ref }> 
        <MenuItem onPress={() => {this.openCamera()}}>{'Camera'}</MenuItem>
        <MenuItem onPress={() => {this.openGallery()}}>{'Gallery'}</MenuItem>
        <MenuItem onPress={() => {}}>{'Product Master'}</MenuItem>
      </Menu>
                    {/* <ImageSelectDialog
                        ref={(ref) => this.innerImageSelectDialog = ref}
                        style={{position:'absolute', end:10}}
                        onImagePick={(response) => {this.onImagePick(response)}}   
                    /> */}

                 
            </ScrollView>
            </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer : {
    flex : 1,
    backgroundColor : '#fff'
  },
  container:{
    flex:1,
  },
  centerRow : {
    flexDirection :'row',flex:1,justifyContent:'center'
  },
  header : {
    width : '100%',
    height : 50,
    padding:10,
    flexDirection :'row'
  },
  headerLogo:{
    height : 30,
    width : 30,
    resizeMode:'contain'
  },
  headerTitle : {
    fontSize:20
  },
  backIcon : {
      height : 25,
      width : 25,
      resizeMode:'contain'
   },
   imageSliderBig : {
    flex:1,   
    backgroundColor : '#e3e3e3' 
   },
   imageSliderSmall : {
    justifyContent : 'center',
    marginTop : 5,
    minHeight : (screenWidth/4)
   },
   imagePlaceholder:{
    width:screenWidth,
    height :500,
    backgroundColor:'red',
    resizeMode:'cover'
   },
   addImageButton : {
    justifyContent:'center',
    alignItems:'center',
    width : (screenWidth/4) -10,
    height : (screenWidth/4) -10,
    backgroundColor : 'pink',
    marginStart :5,
    alignSelf:'center',
    borderRadius :5
   },
   addImageButtonText : {
    width : ((screenWidth/4) -10)/3,
    height : ((screenWidth/4) -10)/3,
    textAlign :'center'
   },
   imageListContainView : {
    borderRadius : 5,marginStart:10
   },
   imageView : {
    borderRadius : 5,
    width : (screenWidth/4) -10,
    height : (screenWidth/4) +10,
    backgroundColor: 'red'
  },
  innerImageView :
  {
    borderRadius : 5,
    width : (screenWidth/4) ,
    height : (screenWidth/4),
    backgroundColor: 'red'
  },
  imageOptionIcon : {
      height: 20,width :20,
      resizeMode : 'contain'
  },
  editIcon : {
    height:60,width:60,resizeMode:'contain'
  },
  submitIcon: {
    height:55,width:55,resizeMode:'contain'
  }

});
