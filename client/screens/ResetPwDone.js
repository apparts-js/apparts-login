import React, { Component } from 'react';
import { connect } from 'apparts-redux';
import * as actions from '../actions/index';
import { StyleSheet, Platform, View, Button, Alert, Text } from 'react-native';
const Colors = require('apparts-config').get('color');
const LoginConf = require('apparts-config').get('login');
import { MyText, MyTextInput, MyLink, MyInput, MyFooter,
         MySubmit, MyScrollView } from 'apparts-react-native-components';
import * as navigation from 'apparts-react-navigation';
import { Screen } from 'apparts-react-navigation';
import { post, basicAuth, handleApiError } from 'apparts-frontend-api';
import * as lang from '../lang';


const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    textAlign: 'left',
    paddingBottom: 25
  },
  outerWrapper: {
    padding: 30,
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

class ResetPwDoneView extends Component {
  render() {
    const { lang, onLogin, disabled } = this.props;
    return (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>
              {lang.resetPw.h1}
            </MyText>
            <MyText>
              {lang.resetPw.done}
            </MyText>
            <MySubmit text={lang.controlls.ok}
                      onPress={onLogin} disabled={disabled}/>
          </View>
        </MyScrollView>
    );
  }
}


class ResetPwDone extends Screen {
  render(){
    return (
      <ResetPwDoneView
        lang={this.props.lang["apparts-login"]}
        onLogin={() => this.resetTo('Apparts.Login')}/>
    );
  }
};

ResetPwDone = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeName
  ])(ResetPwDone);

navigation.registerScreen('Apparts.ResetPwDone', {
  clazz: ResetPwDone,
  title: (store) => lang[store.global.lang]["apparts-login"].resetPw.h1,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { ResetPwDone };
