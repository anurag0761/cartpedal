import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';

import moment from 'moment';
import Lightbox from 'react-native-lightbox';
import VideoPlayer from 'react-native-video-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {Icon} from 'native-base';
import Slider from 'react-native-slider';
import {downloadFile, DocumentDirectoryPath} from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ImageLoad from './ImageLoad';
import ImageModal from 'react-native-image-modal';

const audioRecorderPlayer = new AudioRecorderPlayer();

const initialize = (sending) => {
  if (sending) {
    return true;
  } else {
    return false;
  }
};

export const MessageComponent = ({
  message,
  selectedMode,
  forwardMessageIds,
  toggleSelectedMode,
  appendMessages,
  removeMessages,
  copyText,
  replyMessage,
}) => {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(initialize(message.sending));
  const [audio, setAudio] = useState({playing: false, duration: 0, current: 0});
  const [pause, setpause] = useState(false);
  const [audio1, setAudio1] = useState({
    playing: false,
    duration: 0,
    current: 0,
  });
  const [playerRecording, setPlayerRecording] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const onLoadStart = () => {
    setOpacity(1);
  };

  const onLoad = () => {
    setOpacity(0);
  };

  const onBuffer = ({isBuffering}) => {
    setOpacity(isBuffering ? 1 : 0);
  };

  const onStartPlay = async (uri) => {
    await audioRecorderPlayer.startPlayer(uri);
    setAudio({...audio, playing: true});

    audioRecorderPlayer.addPlayBackListener(async (e) => {
      setAudio((p) => ({
        playing: p.playing,
        current: e.current_position,
        duration: e.duration,
      }));
      if (e.current_position === e.duration) {
        setAudio((p) => ({
          duration: p.duration,
          current: p.current,
          playing: false,
        }));
        await audioRecorderPlayer.stopPlayer();
        await audioRecorderPlayer.removePlayBackListener();
      }
      return;
    });
  };
  const onStartPlay1 = async (uri) => {
    await audioRecorderPlayer.startPlayer(uri);
    setAudio1({...audio1, playing: true});

    audioRecorderPlayer.addPlayBackListener(async (e) => {
      setAudio1((p) => ({
        playing: p.playing,
        current: e.current_position,
        duration: e.duration,
      }));
      if (e.current_position === e.duration) {
        setAudio1((p) => ({
          duration: p.duration,
          current: p.current,
          playing: false,
        }));
        setPlayerRecording(0);
        await audioRecorderPlayer.stopPlayer();
        await audioRecorderPlayer.removePlayBackListener();
      }
      return;
    });
  };
  // const LeftActions = () => {
  //   const scale = dragX.interpolate({
  //     inputRange: [0, 100],
  //     outputRange: [0, 1],
  //     extrapolate: 'clamp'
  //   })
  //     return (
  //       <View
  //         style={{ flex: 1, backgroundColor: 'blue', justifyContent: 'center' }}>
  //         <Text
  //           style={{
  //             color: 'white',
  //             paddingHorizontal: 10,
  //             fontWeight: '600'
  //           }}>
  //           Left Action
  //         </Text>
  //       </View>
  //     )
  //    }
  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setAudio((p) => ({
      current: p.current,
      duration: p.duration,
      playing: false,
    }));
  };
  const onPausePlay1 = async () => {
    console.log('working');
    await audioRecorderPlayer.pausePlayer();
    setAudio1((p) => ({
      current: p.current,
      duration: p.duration,
      playing: false,
    }));
    setpause(true);
  };
  const onPlay = async (uri, playerId) => {
    console.log('player id', playerId);
    // No player are reading or it is the same player
    if (pause && playerRecording == playerId) return onStartPlay1(uri);

    // Another player is reading - stop it before starting the new one
    audioRecorderPlayer.removePlayBackListener();
    console.log('working');
    await audioRecorderPlayer.resumePlayer();
    await audioRecorderPlayer.stopPlayer();
    setAudio1((p) => ({
      current: 0,
      duration: 0,
      playing: false,
    }));
    // Start the new player
    onStartPlay1(uri);
  };

  const downloadAndOpenDocument = async (uri) => {
    const parts = uri.split('/');
    const fileName = parts[parts.length - 1];
    downloadFile({
      fromUrl: uri,
      toFile: `${DocumentDirectoryPath}/${fileName}`,
    }).promise.then((res) => {
      FileViewer.open(`${DocumentDirectoryPath}/${fileName}`, {
        showOpenWithDialog: true,
      });
    });
  };

  const convertToLink = (text) => {
    let result = null;
  };

  useEffect(() => {
    return async () => {
      await audioRecorderPlayer.stopPlayer();
      await audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  useEffect(() => {
    if (message.sending) {
      setOpacity(1);
      setSending(true);
    } else {
      setOpacity(0);
      setSending(false);
    }
  }, [message]);

  // const onStopPlay = async () => {
  //   this.audioRecorderPlayer.stopPlayer();
  //   this.audioRecorderPlayer.removePlayBackListener();
  //   setAudio({...audio, playing: false});
  // };

  let content = null;

  // console.log(message);

  const {msg_type, fattach} = message;
  //  if(msg_type==='info'){
  //    let date=moment().format("DD-MM-YYYY")
  //    {date==message.date?}
  //  }
  console.log(message);
  if (msg_type === 'accept') {
    if (message.tmsg !== '') {
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                borderWidth: message.reply_msg ? 5 : 0,
                borderColor: '#fff',
              }}>
              {message.reply_msg ? (
                <Text
                  style={{
                    margin: 10,
                    color: 'red',
                    fontSize: 15,
                  }}>
                  {message.reply_msg.rmsg}
                </Text>
              ) : (
                <Hyperlink
                  linkDefault={true}
                  linkStyle={{color: '#2980b9', fontSize: 20}}>
                  <Text
                    style={{
                      margin: 10,
                      color: 'black',
                      fontSize: 12,
                    }}>
                    {message.tmsg}
                  </Text>
                </Hyperlink>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 15,
                      marginRight: 5,
                      color: 'black',
                    }}>
                    {' '}
                    {message.tmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                marginRight: 10,
                marginTop: 5,
                alignSelf: 'flex-start',
              }}>
              {message.time}
            </Text>
            {/* <TouchableOpacity >
          <Text style={{
              color: '#1A73E8',
              fontSize: 12,
              marginLeft: '55%',
              alignSelf: 'flex-end',
            }}>Reply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    }
    if (message.fmsg !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            <View
              style={{
                borderWidth: message.reply_msg ? 5 : 0,
                borderColor: '#fff',
              }}>
              {message.reply_msg ? (
                <Text
                  style={{
                    margin: 10,
                    color: '#fff',
                    fontSize: 15,
                  }}>
                  {message.reply_msg.rmsg}
                </Text>
              ) : (
                <Hyperlink
                  linkDefault={true}
                  linkStyle={{color: '#2980b9', fontSize: 20}}>
                  <Text
                    style={{
                      margin: 10,
                      color: '#fff',
                      fontSize: 15,
                    }}>
                    {message.fmsg}
                  </Text>
                </Hyperlink>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 15,
                      marginRight: 5,
                      color: 'black',
                    }}>
                    {' '}
                    {message.fmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
              {/* {moment(message.time).format('hh:mm')} */}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }
  if (msg_type === 'ask_status') {
    if (message.tmsg !== '') {
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                borderWidth: message.reply_msg ? 5 : 0,
                borderColor: '#fff',
              }}>
              {message.reply_msg != '' ? (
                <Text
                  style={{
                    margin: 10,
                    color: 'red',
                    fontSize: 15,
                  }}>
                  {message.reply_msg.rmsg}
                </Text>
              ) : (
                <Text
                  style={{
                    margin: 10,
                    color: 'black',
                    fontSize: 12,
                  }}>
                  {message.tmsg}
                </Text>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 15,
                      marginRight: 5,
                      color: 'black',
                    }}>
                    {' '}
                    {message.tmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                marginRight: 10,
                marginTop: 5,
                alignSelf: 'flex-start',
              }}>
              {message.time}
            </Text>
            {/* <TouchableOpacity >
          <Text style={{
              color: '#1A73E8',
              fontSize: 12,
              marginLeft: '55%',
              alignSelf: 'flex-end',
            }}>Reply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    }
    if (message.fmsg !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            <View
              style={{
                borderWidth: message.reply_msg ? 5 : 0,
                borderColor: '#fff',
              }}>
              {message.reply_msg ? (
                <Text
                  style={{
                    margin: 10,
                    color: '#fff',
                    fontSize: 15,
                  }}>
                  {message.reply_msg.rmsg}
                </Text>
              ) : (
                <Text
                  style={{
                    margin: 10,
                    color: '#fff',
                    fontSize: 15,
                  }}>
                  {message.fmsg}
                </Text>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 15,
                      marginRight: 5,
                      color: 'black',
                    }}>
                    {' '}
                    {message.fmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
              {/* {moment(message.time).format('hh:mm')} */}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }
  if (msg_type === 'text') {
    if (message.tmsg !== '') {
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                borderWidth:
                  message.reply_msg && message.reply_msg.length > 0 ? 5 : 0,
                borderColor: '#fff',
              }}>
              {message.reply_msg != '' ? (
                message.reply_msg == 'text' ? (
                  <Text
                    style={{
                      margin: 10,
                      color: 'red',
                      fontSize: 15,
                    }}>
                    {message.reply_msg.rmsg}
                  </Text>
                ) : message.reply_msg.msg_type == 'contact' ? (
                  <View
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      marginRight: 10,
                      flexDirection: 'row',
                    }}>
                    <Icon
                      name="user"
                      type="Feather"
                      style={{
                        color: 'red',
                        fontSize: 18,
                        alignSelf: 'center',
                      }}
                    />

                    <Text
                      style={{marginBottom: 5, color: 'red', marginLeft: 5}}>
                      Contact
                    </Text>
                  </View>
                ) : message.reply_msg.msg_type == 'location' ? (
                  <View
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      marginRight: 10,
                      flexDirection: 'row',
                    }}>
                    <Icon
                      name="location"
                      type="Entypo"
                      style={{
                        color: 'red',
                        fontSize: 18,
                        alignSelf: 'center',
                      }}
                    />

                    <Text
                      style={{marginBottom: 5, color: 'red', marginLeft: 5}}>
                      Location
                    </Text>
                  </View>
                ) : message.reply_msg.rimage ? (
                  message.reply_msg.msg_type == 'image' ? (
                    <Image
                      source={{uri: message.reply_msg.rimage.attach}}
                      style={{width: 100, height: 80}}
                    />
                  ) : message.reply_msg.msg_type == 'audio' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="mic"
                        type="Feather"
                        style={{
                          color: 'red',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}
                      />
                      <Text style={{marginBottom: 5, color: 'red'}}>
                        Voice message
                      </Text>
                    </View>
                  ) : message.reply_msg.msg_type == 'video' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="video"
                        type="Feather"
                        style={{
                          color: 'red',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}
                      />
                      <Text style={{marginBottom: 5, color: 'red'}}>
                        Voice message
                      </Text>
                    </View>
                  ) : message.reply_msg.msg_type == 'file' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="file"
                        type="Feather"
                        style={{
                          color: 'red',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}
                      />
                      <Text
                        style={{marginBottom: 5, color: 'red', marginLeft: 5}}>
                        Document
                      </Text>
                    </View>
                  ) : null
                ) : null
              ) : (
                <Text
                  style={{
                    margin: 10,
                    color: 'black',
                    fontSize: 12,
                  }}>
                  {message.tmsg}
                </Text>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 15,
                      marginRight: 5,
                      color: 'black',
                    }}>
                    {' '}
                    {message.tmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                marginRight: 10,
                marginTop: 5,
                alignSelf: 'flex-start',
              }}>
              {message.time}
            </Text>
            {/* <TouchableOpacity >
          <Text style={{
              color: '#1A73E8',
              fontSize: 12,
              marginLeft: '55%',
              alignSelf: 'flex-end',
            }}>Reply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    }
    if (message.fmsg !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            <View
              style={{
                borderWidth:
                  message.reply_msg && message.reply_msg.length > 0 ? 5 : 0,
                borderColor: '#fff',
              }}>
              {message.reply_msg ? (
                message.reply_msg.msg_type == 'text' ? (
                  <Text
                    style={{
                      margin: 10,
                      color: '#fff',
                      fontSize: 15,
                    }}>
                    {message.reply_msg.rmsg}
                  </Text>
                ) : message.reply_msg.msg_type == 'contact' ? (
                  <View
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      marginRight: 10,
                      flexDirection: 'row',
                    }}>
                    <Icon
                      name="user"
                      type="Feather"
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        alignSelf: 'center',
                      }}
                    />

                    <Text
                      style={{marginBottom: 5, color: '#fff', marginLeft: 5}}>
                      Contact
                    </Text>
                  </View>
                ) : message.reply_msg.msg_type == 'location' ? (
                  <View
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      marginRight: 10,
                      flexDirection: 'row',
                    }}>
                    <Icon
                      name="location"
                      type="Entypo"
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        alignSelf: 'center',
                      }}
                    />

                    <Text
                      style={{marginBottom: 5, color: '#fff', marginLeft: 5}}>
                      Location
                    </Text>
                  </View>
                ) : message.reply_msg.rimage ? (
                  message.reply_msg.msg_type == 'image' ? (
                    <Image
                      source={{uri: message.reply_msg.rimage.attach}}
                      style={{width: 100, height: 80}}
                    />
                  ) : message.reply_msg.msg_type == 'audio' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="mic"
                        type="Feather"
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}
                      />
                      <Text style={{marginBottom: 5, color: '#fff'}}>
                        Voice message
                      </Text>
                    </View>
                  ) : message.reply_msg.msg_type == 'video' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="video"
                        type="Feather"
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          alignSelf: 'center',
                          marginLeft: 5,
                        }}
                      />
                      <Text
                        style={{marginBottom: 5, color: '#fff', marginLeft: 8}}>
                        Video
                      </Text>
                    </View>
                  ) : message.reply_msg.msg_type == 'file' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="file"
                        type="Feather"
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}
                      />
                      <Text
                        style={{marginBottom: 5, color: '#fff', marginLeft: 5}}>
                        Document
                      </Text>
                    </View>
                  ) : message.reply_msg.msg_type == 'location' ? (
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 5,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="location"
                        type="Feather"
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}
                      />
                      <Text
                        style={{marginBottom: 5, color: '#fff', marginLeft: 5}}>
                        Location
                      </Text>
                    </View>
                  ) : null
                ) : null
              ) : (
                <Hyperlink linkStyle={{color: '#2980b9', fontSize: 20}}>
                  <Text
                    style={{
                      margin: 10,
                      color: '#fff',
                      fontSize: 15,
                    }}>
                    {message.fmsg}
                  </Text>
                </Hyperlink>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 15,
                      marginRight: 5,
                      color: 'black',
                    }}>
                    {' '}
                    {message.fmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
              {/* {moment(message.time).format('hh:mm')} */}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }
  if (msg_type === 'link') {
    if (message.tmsg !== '') {
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            <View style={{borderWidth: 0, borderColor: '#fff'}}>
              <Hyperlink
                linkDefault
                linkStyle={{color: '#2980b9', fontSize: 20}}>
                <Text
                  style={{
                    margin: 10,
                    color: '#2B2B2B',
                    fontSize: 12,
                  }}>
                  {message.tmsg}
                </Text>
              </Hyperlink>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                marginRight: 10,
                marginTop: 5,
                alignSelf: 'flex-start',
              }}>
              {message.time}
            </Text>
            {/* <TouchableOpacity >
          <Text style={{
              color: '#1A73E8',
              fontSize: 12,
              marginLeft: '55%',
              alignSelf: 'flex-end',
            }}>Reply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    }
    if (message.fmsg !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}>
            <View style={{borderWidth: 0, borderColor: '#fff'}}>
              {message.reply_msg ? (
                <Text
                  style={{
                    margin: 10,
                    color: '#fff',
                    fontSize: 12,
                  }}>
                  {message.reply_msg.rmsg}
                </Text>
              ) : (
                <Hyperlink
                  linkDefault
                  linkStyle={{color: '#2980b9', fontSize: 20}}>
                  <Text
                    style={{
                      margin: 10,
                      color: '#fff',
                      fontSize: 12,
                    }}>
                    {message.fmsg}
                  </Text>
                </Hyperlink>
              )}
              {message.reply_msg ? (
                <View style={{backgroundColor: '#fff'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginTop: 8,
                      fontSize: 16,
                      color: 'black',
                    }}>
                    {' '}
                    {message.fmsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
              {/* {moment(message.time).format('hh:mm')} */}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  if (msg_type === 'contact') {
    if (message.tmsg !== '') {
      const contact = JSON.parse(JSON.parse(message.tmsg));
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              width: '80%',
              elevation: 5,
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                // elevation: 5,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>
              <Image
                source={
                  contact.hasThumbnail
                    ? {uri: contact.thumbnailPath}
                    : require('../images/default_user.png')
                }
                style={styles.Styleimage}
              />
              <View style={{paddingHorizontal: 16, alignSelf: 'flex-start'}}>
                <Text
                  style={{
                    color: '#2B2B2B',
                    fontSize: 16,
                  }}>
                  {contact.displayName}
                </Text>
                {contact.phoneNumbers &&
                  contact.phoneNumbers.map((i) => (
                    <Text
                      style={{
                        color: '#2B2B2B',
                        fontSize: 12,
                      }}>
                      {i.number}
                    </Text>
                  ))}
              </View>
            </View>
          </View>
          <Text
            style={{
              color: '#524D4D',
              fontSize: 10,
              marginRight: 10,
              marginTop: 5,
              alignSelf: 'flex-start',
            }}>
            {message.time}
            {/* {moment(message.time).format('hh:mm')} */}
          </Text>
        </View>
      );
    }
    if (message.fmsg !== '') {
      let contact = null;
      if (sending) {
        contact = JSON.parse(message.fmsg);
      } else {
        contact = JSON.parse(JSON.parse(message.fmsg));
      }

      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 8,
              elevation: 5,
              width: '80%',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <Image
              source={
                contact.hasThumbnail
                  ? {uri: contact.thumbnailPath}
                  : require('../images/default_user.png')
              }
              style={styles.Styleimage}
            />
            <View style={{paddingHorizontal: 16, alignSelf: 'flex-start'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                }}>
                {contact.displayName}
              </Text>
              {contact.phoneNumbers &&
                contact.phoneNumbers.map((i) => (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                    }}>
                    {i.number}
                  </Text>
                ))}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
              {/* {moment(message.time).format('hh:mm')} */}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  if (msg_type === 'media' || msg_type === 'image') {
    if (message.tattach !== null && message.tattach !== '') {
      content = (
        <View style={{alignSelf: 'flex-start', marginVertical: 10}}>
          <View
            style={{
              borderRadius: 8,
              elevation: 5,
              width: '70%',
              backgroundColor: '#fff',
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}

            <View
              style={{
                borderWidth: 5,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderColor: '#fff',
                borderBottomLeftRadius: message.tattach.caption !== '' ? 8 : 7,
                borderBottomRightRadius: message.tattach.caption !== '' ? 8 : 7,
              }}>
              <ImageModal
                style={{
                  height: 200,
                  borderRadius: 8,
                  width: 200,
                  alignSelf: 'center',
                }}
                imageBackgroundColor="transparent"
                loadingStyle={{size: 'large', color: 'gray'}}
                source={{uri: message.tattach.attach}}
              />
            </View>
            {message.tattach.caption !== '' ? (
              <View
                style={{
                  backgroundColor: '#fff',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}>
                <Text
                  style={{
                    marginLeft: 5,
                    marginTop: 8,
                    fontSize: 16,
                    color: 'black',
                    marginBottom: 5,
                  }}>
                  {message.tattach.caption}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={{
              color: '#524D4D',
              fontSize: 10,
              marginLeft: 10,
              marginTop: 5,
              alignSelf: 'flex-start',
            }}>
            {message.time}
          </Text>
        </View>
      );
    }
    if (message.fattach !== null && message.fattach !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}
          />
          <View
            style={{
              borderWidth: 5,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderColor: '#fff',
              borderBottomLeftRadius: message.fattach.caption !== '' ? 8 : 0,
            }}>
            <ImageModal
              loading={sending}
              style={{
                height: 200,
                borderRadius: 8,
                width: 200,
                alignSelf: 'center',
                // borderRadius:2,
                // borderColor:'white'
              }}
              imageBackgroundColor="transparent"
              loadingStyle={{size: 'large', color: 'gray'}}
              source={{uri: message.fattach.attach}}
            />
          </View>
          {message.fattach.caption !== '' ? (
            <View
              style={{
                backgroundColor: '#fff',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <Hyperlink
                linkDefault={true}
                linkStyle={{color: '#2980b9', fontSize: 20}}>
                <Text
                  style={{
                    marginLeft: 5,
                    marginTop: 8,
                    fontSize: 16,
                    color: 'black',
                    marginBottom: 5,
                  }}>
                  {message.fattach.caption}
                </Text>
              </Hyperlink>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  if (msg_type === 'video') {
    if (message.tattach !== null && message.tattach !== '') {
      content = (
        <View style={{alignSelf: 'flex-start', marginVertical: 10}}>
          <View
            style={{
              borderRadius: 8,
              elevation: 5,
              width: '70%',
              backgroundColor: '#fff',
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <View>
              <VideoPlayer
                video={{uri: message.fattach.attach}}
                videoHeight={800}
                videoWidth={800}
                resizeMode="cover"
                onBuffer={onBuffer}
                onLoadStart={onLoadStart}
                onLoad={onLoad}
                disableControlsAutoHide={true}
              />
              <ActivityIndicator
                animating
                size="large"
                color={'red'}
                style={[
                  {
                    zIndex: -5,
                    position: 'absolute',
                    top: 70,
                    left: 70,
                    right: 70,
                    height: 50,
                  },
                  {opacity},
                ]}
              />
            </View>
          </View>
          <Text
            style={{
              color: '#524D4D',
              fontSize: 10,
              marginLeft: 10,
              marginTop: 5,
              alignSelf: 'flex-start',
            }}>
            {message.time}
          </Text>
        </View>
      );
    }
    if (message.fattach !== null && message.fattach !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              borderRadius: 8,
              elevation: 5,
              width: '70%',
            }}
          />
          <View>
            <VideoPlayer
              video={{uri: message.fattach.attach}}
              videoHeight={800}
              videoWidth={800}
              resizeMode="cover"
              onBuffer={onBuffer}
              onLoadStart={onLoadStart}
              onLoad={onLoad}
              disableControlsAutoHide={true}
            />
            <ActivityIndicator
              animating
              size="large"
              color={'red'}
              style={[
                {
                  zIndex: sending ? 10 : -5,
                  position: 'absolute',
                  top: 70,
                  left: 70,
                  right: 70,
                  height: 50,
                },
                {opacity},
              ]}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  if (msg_type === 'audio') {
    if (message.tattach !== null && message.tattach !== '') {
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              width: '80%',
              elevation: 5,
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                // elevation: 5,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>
              <Icon
                onPress={() => {
                  if (audio1.playing) {
                    onPausePlay1();
                  } else {
                    setPlayerRecording(message.id);
                    onPlay(message.tattach.attach, message.id);
                  }
                }}
                name={audio1.playing ? 'pause' : 'play'}
                style={{color: 'grey'}}
              />
              <View
                style={{
                  paddingHorizontal: 16,
                  width: '70%',
                  alignSelf: 'flex-start',
                }}>
                <Slider
                  // disabled
                  value={
                    playerRecording == message.id
                      ? audio1.duration === 0
                        ? 0
                        : audio1.current / audio1.duration
                      : 0
                  }
                  thumbStyle={{width: 10, height: 10}}
                />
                <Text style={{fontSize: 12, color: 'black', marginTop: -12}}>
                  {playerRecording == message.id
                    ? audioRecorderPlayer.mmssss(audio1.current).slice(0, -3)
                    : '00:00'}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: '#524D4D',
              fontSize: 10,
              marginRight: 10,
              marginTop: 5,
              alignSelf: 'flex-start',
            }}>
            {message.time}
          </Text>
        </View>
      );
    }
    if (message.fattach !== null && message.fattach !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 8,
              elevation: 5,
              width: '80%',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            {sending ? (
              <ActivityIndicator animating size="large" color={'white'} />
            ) : (
              <Icon
                onPress={() => {
                  if (audio1.playing) {
                    onPausePlay1();
                  } else {
                    setPlayerRecording(message.id);

                    onPlay(message.fattach.attach, message.id);
                    // onStartPlay(message.fattach.attach);
                  }
                }}
                name={audio1.playing ? 'pause' : 'play'}
                style={{color: 'white'}}
              />
            )}

            <View
              style={{
                paddingHorizontal: 16,
                width: '70%',
                alignSelf: 'flex-start',
              }}>
              <Slider
                disabled
                value={
                  playerRecording == message.id
                    ? audio1.duration === 0
                      ? 0
                      : audio1.current / audio1.duration
                    : 0
                }
                minimumTrackTintColor="white"
                thumbStyle={{width: 10, height: 10, backgroundColor: 'white'}}
                onValueChange={(value) => this.setState({value})}
              />
              <Text style={{fontSize: 12, color: 'white', marginTop: -12}}>
                {playerRecording == message.id
                  ? audioRecorderPlayer.mmssss(audio1.current).slice(0, -3)
                  : '00:00'}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  if (msg_type === 'file') {
    if (message.tattach !== null && message.tattach !== '') {
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              width: '80%',
              elevation: 5,
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                downloadAndOpenDocument(message.tattach.attach);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                // elevation: 5,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>
              <Icon name="document" style={{color: '#2B2B2B'}} />
              <View
                style={{
                  paddingHorizontal: 16,
                  width: '70%',
                  alignSelf: 'flex-start',
                }}>
                <Text style={{color: '#2B2B2B'}}>
                  {
                    message.tattach.attach.split('/')[
                      message.tattach.attach.split('/').length - 1
                    ]
                  }
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: '#524D4D',
              fontSize: 10,
              marginRight: 10,
              marginTop: 5,
              alignSelf: 'flex-start',
            }}>
            {message.time}
          </Text>
        </View>
      );
    }
    if (message.fattach !== null && message.fattach !== '') {
      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <TouchableOpacity
            onPress={() => {
              downloadAndOpenDocument(message.fattach.attach);
            }}
            style={{
              backgroundColor: 'red',
              borderRadius: 8,
              elevation: 5,
              width: '80%',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            {sending ? (
              <ActivityIndicator animating size="large" color={'white'} />
            ) : (
              <Icon name="document" style={{color: 'white'}} />
            )}

            <View
              style={{
                paddingHorizontal: 16,
                width: '70%',
                alignSelf: 'flex-start',
              }}>
              <Text style={{color: 'white'}}>
                {
                  message.fattach.attach.split('/')[
                    message.fattach.attach.split('/').length - 1
                  ]
                }
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  if (msg_type === 'location') {
    if (message.tmsg !== '') {
      const {latitude, longitude} = JSON.parse(JSON.parse(message.tmsg));
      content = (
        <View
          style={{
            alignSelf: 'flex-start',
            marginVertical: 10,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              width: 205,
              height: 315,
            }}>
            {message.tname ? (
              <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                <Text style={{color: '#1EA81D', fontSize: 15}}>
                  {message.tname}
                </Text>
              </View>
            ) : null}
            <Lightbox
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}>
              <View
                style={{
                  borderRadius: 8,
                  elevation: 5,
                  width: open ? '100%' : 200,
                  height: open ? '100%' : 280,
                }}>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={{
                    flex: 1,
                    ...StyleSheet.absoluteFillObject,
                  }}
                  region={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  <Marker coordinate={{latitude, longitude}} />
                </MapView>
              </View>
            </Lightbox>
          </View>
          <Text
            style={{
              color: '#524D4D',
              fontSize: 10,
              marginRight: 10,
              marginTop: 5,
              alignSelf: 'flex-start',
            }}>
            {message.time}
          </Text>
        </View>
      );
    }
    if (message.fmsg !== '') {
      let location = null;
      if (sending) {
        location = JSON.parse(message.fmsg);
      } else {
        location = JSON.parse(JSON.parse(message.fmsg));
      }
      if (typeof location === 'string') {
        location = JSON.parse(location);
      }

      const {latitude, longitude} = location;

      content = (
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <Lightbox onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
            <View
              style={{
                borderRadius: 8,
                elevation: 5,
                width: open ? '100%' : 200,
                height: open ? '100%' : 280,
              }}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{
                  flex: 1,
                  ...StyleSheet.absoluteFillObject,
                }}
                region={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                <Marker coordinate={{latitude, longitude}} />
              </MapView>
            </View>
          </Lightbox>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: '#524D4D',
                fontSize: 10,
                paddingLeft: 8,
              }}>
              {message.time}
            </Text>
            {sending ? (
              <Icon
                type="MaterialCommunityIcons"
                name="clock-time-nine"
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="checkmark-done-sharp"
                style={{
                  fontSize: 16,
                  color: message.is_read === '1' ? '#34B7F1' : 'grey',
                }}
              />
            )}
          </View>
        </View>
      );
    }
  }

  const inList = useMemo(() => {
    return forwardMessageIds.indexOf(message.id) !== -1;
  }, [forwardMessageIds]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={
        inList
          ? {
              backgroundColor: 'rgba(0,0,0,0.2)',
            }
          : {}
      }
      onPress={() => {
        if (selectedMode) {
          if (!inList) {
            appendMessages(message.id);
            replyMessage({
              text: message,
            });
            if (message.msg_type === 'text') {
              copyText({
                id: message.id,
                text: message.fmsg !== '' ? message.fmsg : message.tmsg,
              });
            }
          } else {
            removeMessages(message.id);
          }
        }
      }}
      onLongPress={() => {
        if (!selectedMode) {
          toggleSelectedMode();
          appendMessages(message.id);
          replyMessage({
            text: message,
          });
          if (message.msg_type === 'text') {
            copyText({
              id: message.id,
              text: message.fmsg !== '' ? message.fmsg : message.tmsg,
            });
          }
        }
      }}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Styleimage: {
    alignSelf: 'flex-start',
    marginTop: 2,
    width: 60,
    height: 60,
    padding: 15,
  },
});
