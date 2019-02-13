import React, { Component } from 'react';
import { connect } from 'apparts-redux';
import * as actions from '../actions/index';
import { StyleSheet, Platform, View, Button, Alert, Text } from 'react-native';
const Colors = require('apparts-config').get('color');
const LoginConf = require('apparts-config').get('login');
import { MyText, MyTextInput, MyLink, MyInput, MyFooter,
         MySubmit, MyScrollView } from 'apparts-react-native-components';
import { checkPW } from '../util.js';
import * as navigation from 'apparts-react-navigation';
import { Screen } from 'apparts-react-navigation';
import { put, basicAuth, handleApiError } from 'apparts-frontend-api';
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

class ResetPwView extends Component {
  render() {
    const { lang, pw, validPw, validatePw, onChangePw,
            onLogin, resetPw, disabled } = this.props;
    return (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>
              {lang.resetPw.h1}
            </MyText>
            <MyText style={{ marginLeft: 5 }}>
              {lang.resetPw.instructions}
            </MyText>
            <MyInput valid={validPw}
                     validate={validatePw}
                     placeholder={lang.account.password}
                     secureTextEntry={true}
                     autoCapitalize={'none'}
                     value={pw}
                     error={lang.account.passwordError}
                     next={resetPw}
                     onChangeText={onChangePw}/>
            <MySubmit text={lang.controlls.continue}
                      onPress={resetPw} disabled={disabled}/>
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

class NoTokenView extends Component {
  render() {
    const { lang, onLogin, disabled } = this.props;
    return (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>
              {lang.resetPw.h1}
            </MyText>
            <MyText>
              {lang.resetPw.noToken}
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


class ResetPw extends Screen {
  constructor(props){
    super(props);
    this.state = {
      validPw: true
    };
  }

  resetPw(){
    const {pw} = this.state;
    const pwValid = this.validatePw(pw);
    if(pwValid){
      this.setState({disabled: true});
      put(`user/1`, { newpassword: pw }, basicAuth(this.props.navProps.mail,
                                      this.props.navProps.token))
        .then(x => {
          this.resetTo('Apparts.ResetPwDone');
        })
        .catch(x => {
          handleApiError({}, () => this.setState({disabled: false}))(x);
        });
    }
  }

  validatePw(value=""){
    const res = checkPW(value);
    this.setState({validPw: res});
    return res;
  }

  render(){
    if(this.props.navProps && this.props.navProps.token
        && this.props.navProps.mail) {
      return (
        <ResetPwView
          validPw={this.state.validPw}
          validatePw={this.validatePw.bind(this)}
          onChangePw={pw => this.setState({ pw })}
          resetPw={this.resetPw.bind(this)}
          lang={this.props.lang["apparts-login"]}
          global={this.props.global}
          disabled={this.state.disabled}
          onLogin={() => this.resetTo('Apparts.Login')}/>
      );
    } else {
      return (<NoTokenView lang={this.props.lang["apparts-login"]}
                           onLogin={() => this.resetTo('Apparts.Login')}/>);
    }
  }
};

ResetPw = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeName
  ])(ResetPw);

navigation.registerScreen('Apparts.ResetPw', {
  clazz: ResetPw,
  title: (store) => lang[store.global.lang]["apparts-login"].resetPw.h1,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { ResetPw };
