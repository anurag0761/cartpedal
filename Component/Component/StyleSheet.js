import React, { StyleSheet,Dimensions } from 'react-native';
import Colors from '../Component/Colors';

const window = Dimensions.get('window');

export  default StyleSheet.create({
    cardView : {
       paddingTop:5,marginStart:10,marginEnd:10,marginBottom:5,backgroundColor:'white',padding:10,elevation:3
    },
    appHeader : {
      width:window.width,
      height : 60,
      flexDirection: 'row',
      padding:10,
      elevation:4
      
      // width: (window.width - 60),
      // height : 60,
      // marginStart : 30,
      // flexDirection: 'row',
      // padding:8,
      // margin :10,
      // borderRadius : 12
    },
      
  });
