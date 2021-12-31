/**
* This is the Search file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity } from "react-native";
import {backIcon,logo}  from '../Component/Images';
import Colors  from '../Component/Colors';
import AppConst from '../Component/AppConst'
import Swiper from 'react-native-swiper'

export default class AppImageSlider extends Component {
  constructor(props) {
      super(props);

      this.state = {
        
        
      };

}
  
  
componentWillMount()
{

}


  render() {
      const imagesView = [];
      for(let i=0; i< this.props.sliderImages.length; i++)
      {
        imagesView.push(
            this.props.rendorImages(this.props.sliderImages[i],i)
        )
      }
    return(
        <Swiper style={styles.wrapper} showsButtons={true }>
            {imagesView}
        </Swiper>
    );
  }
}

const styles = StyleSheet.create({
    wrapper: {
      color:'white',
      backgroundColor:'#fff'
    },
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB'
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
  })