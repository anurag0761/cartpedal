import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import resp from 'rn-responsive-font'
console.disableYellowBox = true
import {BASE_URL} from '../Component/ApiClient';
class ChangePassword extends Component {
  constructor(props) {
    super(props)
    // this.forgetCall = this.forgetCall.bind(this)
    this.state = {
        New_password: '',
      Confirm_password:'',
      userAccessToken:'',
      fcmToken:'',
      userId:'',
      baseUrl: `${BASE_URL}`,
    }
  }
  showLoading() {
    this.setState({ loading: true });
  }
componentDidMount(){
  AsyncStorage.getItem('@fcmtoken').then((token) => {
    console.log("Edit user id token=" +token);
    if (token) {
      this.setState({ fcmToken:JSON.parse(token) });
    }
  });
  AsyncStorage.getItem('@user_id').then(userId => {
    if (userId) {
      this.setState({userId: userId})
      console.log('Edit user id Dhasbord ====' + this.state.userId)
     
    }
  });
  AsyncStorage.getItem('@access_token').then((accessToken) => {
    if (accessToken) {
      this.setState({ userAccessToken: accessToken });
      console.log("Edit access token ====" + accessToken);
    }
  })
   
}
  hideLoading() {
    this.setState({ loading: false });
  }
  checkPassword=()=>{
      if(this.state.New_password===this.state.Confirm_password){
          alert('Both password are correct');
      }else{
          alert('Confirm Password is worng');
      }
  }
  CheckTextInput = () => {
     if (this.state.New_password === '') {
      alert('Please Enter New Password')
    }
    else if (this.state.Confirm_password==='') {
        alert('Please Enter Confirm Password')
      }
      else if (!this.state.Confirm_password.length>6) {
        alert('Enter atleast 6 digit Password')
        console.log('old pass',this.state.New_password);
        console.log('confirm passwprd',this.state.Confirm_password)
        console.log('old length',this.state.Confirm_password.length)
      }
     else {
        // this.checkPassword()
        this.ChangePassword()
    //   this.forgetCall();
    //   this.showLoading();

    }
  }
  ChangePassword() {
    let formData = new FormData()
    formData.append('user_id', this.state.userId)
    formData.append('oldpass',this.state.New_password)
    formData.append('pass',this.state.Confirm_password)
    formData.append('cpass',this.state.Confirm_password)
    console.log('form data==' + JSON.stringify(formData))
   // var otpUrl= 'http://cartpadle.atmanirbhartaekpahel.com/frontend/web/api-user/send-otp'
    
    var otpUrl = this.state.baseUrl + 'api-user/change-password'
    console.log('url:' + otpUrl)
    fetch(otpUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token:'1111',
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        this.hideLoading(); 

        if (responseData.code == '200') {
          this.props.navigation.navigate('LoginScreen')
             console.log(JSON.stringify(responseData));
        } 
        else {
            alert(responseData.message);
          console.log(responseData)
        }
        
       
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })

      .done()
  }

  render() {
    return (
<ScrollView style={{flex:1,backgroundColor:'#fff'}}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>

          <View style={{ flex: .34, backgroundColor: '#F01738', flexDirection: 'row' }}>

            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../images/back_white.png')}
                style={styles.MenuHomeIconStyle}
              />
            </TouchableOpacity>

          </View>

          <View style={{ flex: .33, backgroundColor: '#F01738' }}>

          </View>

          <View style={{ flex: .33, backgroundColor: '#F01738' }}>


          </View>


        </View>


        <View style={styles.logoContainer}>
          <Image
          source={require('../images/logo_cart_paddle.png')}
           // source={require('../images/Logo_icon2.png')}
            style={styles.ImageView}
          />
          <Text style={styles.CartTextStyle}>Cartpedal</Text>
        </View>
       
        <View style={styles.container3}>
        <ScrollView>
          <View style={styles.PhoneBox}>
          <View >
            <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold'}}>Change Password</Text>
            </View>
            <Text style={styles.UserName}>Old Password</Text>
            <View style={styles.inputView}>
              <View style={{ flexDirection: 'row', marginLeft: 15 }}></View>

              <TextInput
                placeholder=''
                placeholderTextColor='#000'
                underlineColorAndroid='transparent'
                style={styles.input}
                onChangeText={New_password => this.setState({ New_password })}
              />
            </View>
            <Text style={styles.UserName1}>New Password</Text>
            <View style={styles.inputView}>
              <View style={{ flexDirection: 'row', marginLeft: 15 }}></View>

              <TextInput
                placeholder=''
                placeholderTextColor='#000'
                underlineColorAndroid='transparent'
                style={styles.input}
                onChangeText={Confirm_password => this.setState({ Confirm_password })}
              />
            </View>
            <TouchableOpacity
              style={styles.loginButtonStyle}
              activeOpacity={0.2}
              onPress={() => {
                this.CheckTextInput()
              }}>
              <Text style={styles.buttonWhiteTextStyle}>Submit</Text>
            </TouchableOpacity>
            {this.state.loading && (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#F01738" />
              </View>
            )}
          </View>
          </ScrollView>
        </View>
        
      </View>
</ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#F01738',
  },


  CartTextStyle: {
    width: resp(204),
    height: resp(44),
    marginLeft: resp(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: resp(5),
    fontSize: resp(37),
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container3: {
    flex: .6,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  PhoneBox: {
    margin: resp(40),
  },
  logoContainer: {
    flex: .2,
    marginBottom: resp(60),
  },

  headerContainer: {
    flexDirection: 'row',
    flex: .2,
    backgroundColor: 'white',
  },
  MenuHomeIconStyle: {
    marginLeft: resp(10),
    marginTop: resp(20),
    height: resp(30),
    width: resp(26),
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonWhiteTextStyle: {
    textAlign: 'center',
    fontSize: resp(16),
    color: 'white',
    alignContent: 'center',
  },
  ImageView: {
    height: resp(97.73),
    width: resp(93.75),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  UserName: {
    color: 'black',
    width: resp(340),
    fontSize: resp(14),
    textAlign: 'left',
    opacity: 0.5,
    marginTop:resp(25)
  },
  UserName1: {
    color: 'black',
    width: resp(340),
    fontSize: resp(14),
    textAlign: 'left',
    opacity: 0.5,
    marginTop:resp(10)
  },

  input: {
    color: 'black',
    height: 50,
    padding: 5,
    textAlign: 'left',
  },

  inputView: {
    width: '90%',
    marginBottom: 15,
    width: resp(350),
    borderColor: '#F01738',
    borderBottomWidth: 1,
  },
  loginButtonStyle: {
    marginTop: 10,
    width: resp(350),
    height: resp(50),
    padding: 10,
    backgroundColor: '#F01738',
    borderRadius: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
})

export default ChangePassword
