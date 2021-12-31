import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import resp from 'rn-responsive-font'
import OTPTextView from 'react-native-otp-textinput';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../Component/ApiClient';
var mobileNumber, otp

console.disableYellowBox = true
class SignUPWithOtpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone_number: '',
      otp: '',
      baseUrl: `${BASE_URL}`,
      fcmToken:''
    }
  }
  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }
  componentDidMount() {
    const { navigation } = this.props
    mobileNumber = this.props.route.params.mobile;
    // mobileNumber = navigation.getParam('mobile', 'no-mobile')
    otp = this.props.route.params.otp;
    // otp = navigation.getParam('otp', 'no-otp')

    this.setState({ otp: otp })
    console.log(" in next screenfghj ", mobileNumber)

    AsyncStorage.getItem('@fcmtoken').then((token) => {
      console.log("Edit user id token=" +token);
      if (token) {
        this.setState({ fcmToken: JSON.parse(token) });
      }
    });

  }
  resendopt=()=>{
      let formData = new FormData()
      formData.append('mobile', '+91' +mobileNumber)
      console.log('form data==' + formData)
  
      var otpUrl = this.state.baseUrl + 'api-user/send-otp'
      console.log('url:' + otpUrl)
      fetch(otpUrl, {
        method: 'Post',
        headers: {
          'Content-Type': 'multipart/form-data',
          device_id: '1234',
          device_token: '1111',
          device_type: 'android',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          this.hideLoading();
          if (responseData.code == '200') {
            this.setState({otp:responseData.data.otp});
            // this.props.navigation.navigate('SignUPWithOtpScreen', {
            //   mobile: responseData.data.mobile,
            //   otp: responseData.data.otp,
            // })
          } else {
  
            // alert(JSON.stringify(responseData.data))
          }
  
          console.log('response object:', responseData)
        })
        .catch(error => {
          this.hideLoading();
          console.error(error)
        })
  
        .done()
    }
  
  CheckTextInput = () => {


    if (this.state.otpInput === '') {

      alert('Please Enter OTP');

    }
    else if (this.state.otpInput != this.state.otp) {
      alert('Please Enter Valid OTP');
    }

    else {
      this.props.navigation.navigate('SignUPScreen', { mobile: mobileNumber })
    }

  };

  render() {

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container2}>
            <Text style={styles.HeadingText}>Verifying your mobile number</Text>

            <Text style={styles.forgotDescription}>
              We have sent an otp on your mobile number{' '}
            </Text>
            <Text style={styles.forgotDescription2}>{mobileNumber}</Text>
            <Text style={styles.forgotDescription2}>{'OTP:' +this.state.otp}</Text>
            {/* <OTPTextView
              ref={e => (this.input1 = e)}
              containerStyle={styles.textInputContainer}
              handleTextChange={otp => this.setState({ otpInput: otp })}
              textInputStyle={styles.roundedTextInput}
               inputCount={4}
              inputCellLength={2}
              keyboardType='numeric'
              color={'white'}
              tintColor='#FB6C6A'
              offTintColor='#BBBCBE'
              textInputStyle=''
            /> */}
                    <OTPTextView
                    handleTextChange={otp => this.setState({ otpInput: otp })}
                    containerStyle={styles.textInputContainer}
                    textInputStyle={styles.roundedTextInput}
                    inputCount={4}
                    color={'white'}
                    tintColor='#FB6C6A'
                    offTintColor='#BBBCBE'
                    inputCellLength={1}
                  />

            <View style={styles.horizontal}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('PhoneScreen')
                }}>
                <Text style={styles.EditPhoneStyle}>Edit Phone Number</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.resendopt}>
                <Text style={styles.ResendOtpStyle}>Resend Otp?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButtonStyle}
              activeOpacity={0.2}
              onPress={() => {
                this.CheckTextInput()
              }}>

              <Text style={styles.buttonWhiteTextStyle}>Verify</Text>
            </TouchableOpacity>
            {this.state.loading && (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#ffff" />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F01738',
  },
  container2: {
    alignContent: 'center',
    marginTop: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F01738',
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
  buttonWhiteTextStyle: {
    textAlign: 'center',
    fontSize: resp(16),
    color: '#F01738',
    alignContent: 'center',
  },
  textInputContainer: {
    marginTop: 50,
    marginBottom: 20,
    color: 'white',
  },
  roundedTextInput: {
    borderRadius: 8,
    borderWidth: 2,
  },

  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: resp(10),
  },
  EditPhoneStyle: {
    width: resp(150),
    height: resp(30),
    color: '#FFFFFF',
  },
  ResendOtpStyle: {
    width: resp(100),
    height: resp(30),
    color: '#FFFFFF',
  },

  HeadingText: {
    color: 'white',
    width: resp(355),
    fontSize: resp(30),
    fontWeight: 'bold',
    textAlign: 'left',
  },

  forgotDescription: {
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'left',
    width: resp(350),
    opacity: 0.5,
  },
  forgotDescription2: {
    color: '#FFFFFF',
    textAlign: 'left',
    width: resp(350),
    opacity: 0.5,
  },
  loginButtonStyle: {
    marginTop: 30,
    width: resp(350),
    height: resp(50),
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
})

export default SignUPWithOtpScreen