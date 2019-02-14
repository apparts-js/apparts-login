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

class PwForgottenDoneView extends Component {
  render() {
    const { lang, onLogin, disabled } = this.props;
    return (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>
              {lang.pwForgotten.h1}
            </MyText>
            <MyText>
              {lang.pwForgotten.done}
            </MyText>
          </View>
          <MyFooter sepText={lang.simpleLanguage.or}>
            <MyLink
              onPress={onLogin}
              disabled={disabled}>
              {lang.signup.login}
            </MyLink>
          </MyFooter>
        </MyScrollView>
    );
  }
}


class PwForgottenDone extends Screen {


  render(){
    return (
      <PwForgottenDoneView
        lang={this.props.lang["apparts-login"]}
        onLogin={() => this.resetTo('Apparts.Login')}/>
    );
  }
};

PwForgottenDone = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeName
  ])(PwForgottenDone);

navigation.registerScreen('Apparts.PwForgottenDone', {
  clazz: PwForgottenDone,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { PwForgottenDone };
