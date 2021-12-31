import React, {Component} from 'react'
console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import resp from 'rn-responsive-font'
import {SliderBox} from 'react-native-image-slider-box'
import ImageModal from 'react-native-image-modal';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
class ProductDetailImageFullView extends Component{
    constructor (props) {
        super(props)
        this.state = {
            images:this.props.route.params.images ,
        }
        console.log(this.props.route.params.images);
    }
    render () {
        return (
          <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.CloseButtonContainerStyles}
          onPress={() => {
            // this.props.navigation.navigate('EditProductHarshit')
            this.props.navigation.goBack();
          }}>
          <Image
                source={require('../images/red_close_icon.png')}
                style={styles.CloseButtonViewStyles}
              />
          </TouchableOpacity>
            <View style={styles.ImageContainer}>
            <ImageModal
                imageBackgroundColor="transparent"
                source={
                  this.props.route.params.images
                    ? {uri: this.props.route.params.images}
                    : require('../images/default_user.png')
                }
                style={{width:width, height: resp(500)}}
              />
             {/* <SliderBox
                images={this.state.images}
                style={styles.sliderImageStyle}></SliderBox> */}
                </View>
          </SafeAreaView>
        )
      }
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      },
      CloseButtonContainerStyles: {
          marginTop:resp(30),
          marginRight:resp(50),
        flex: 0.1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        
      },
      CloseButtonViewStyles:{
        marginRight:resp(20),
            width:resp(36.1),
            height:resp(36.1),
      },
      ImageContainer:{
          flex:0.75
      },
      sliderImageStyle: {
          marginTop:resp(50),
          alignContent:'center',
          alignItems:'center',
          alignSelf:'center',
          width:'99%',
          height: resp(500),
      },
})
export default ProductDetailImageFullView
