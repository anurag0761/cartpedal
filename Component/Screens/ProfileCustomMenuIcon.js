//This is an example code for the popup menu//
import React, { Component, StyleSheet } from 'react';
//import react in our code.
import { View, Text,Image, TouchableOpacity  } from 'react-native';
//import all the components we are going to use.
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
//import menu and menu item

class ProfileCustomMenuIcon extends Component {
  constructor(props){
    super(props);
    this.state={
      addCover:''
    }
  }
  componentDidMount(){
    
    console.log('profile ',this.props.setData);
    this.setState({addCover:this.props.setData})
  }
  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
  };
  option2Click = () => {
    this._menu.hide();
    this.props.option2Click();
  };
  option3Click = () => {
    this._menu.hide();
    this.props.option3Click();
  };
  option4Click = () => {
    this._menu.hide();
    this.props.option4Click();
  };
  render() {
    return (
      <View style={this.props.menustyle}>
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity onPress={this.showMenu}>
             <Image
             source={{uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/menu_icon.png'}} 
              
               style={{width: 20, height: 20,marginLeft:4,marginTop:4}} >

                    </Image>
            </TouchableOpacity>
          }>
         <MenuItem onPress={this.option1Click}>View Cover Photo</MenuItem>
         <MenuItem onPress={this.option3Click}>Edit Cover Photo</MenuItem>
         {/* {this.state.addCover?(<MenuItem onPress={this.option3Click}>Add Cover Photo</MenuItem>):(<MenuItem onPress={this.option3Click}>Edit Cover Photo</MenuItem>)}  */}
          
          
      
        </Menu>
      </View>
    );
  }
}

export default ProfileCustomMenuIcon;