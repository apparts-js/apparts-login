import React, { Component } from 'react';
import { connect } from 'apparts-redux';
import * as actions from '../actions/index';
import { StyleSheet, View, Button, Alert, Text } from 'react-native';
const Colors = require('apparts-config').get('color');
import { MyText, MyTextInput, MyLink, MyInput, MyFooter,
         MySubmit, MyScrollView } from 'apparts-react-native-components';
import { checkMail, checkPWLoose } from '../util.js';
import * as navigation from 'apparts-react-navigation';
import { Screen } from 'apparts-react-navigation';
import { get, basicAuth, handleApiError } from 'apparts-frontend-api';
import * as lang from '../lang';


const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    textAlign: 'left'
  },
  outerWrapper: {
    padding: 30,
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

const LoginView = ({ lang, onMailChange, onPwChange,
                     validMail, validPw,
                     validateMail, validatePw,
                     onSignup, login, disabled, mail, pw }) =>
      (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>
              {lang.login.h1}
            </MyText>
            <MyInput validate={validateMail}
                     valid={validMail}
                     placeholder={lang.account.mail}
                     keyboardType="email-address"
                     autoCapitalize={'none'}
                     onChangeText={onMailChange}
                     value={mail} />
            <MyInput validate={validatePw}
                     valid={validPw}
                     placeholder={lang.account.password}
                     secureTextEntry={true}
                     autoCapitalize={'none'}
                     onChangeText={onPwChange}
                     value={pw} />
            <MySubmit text={lang.controlls.continue}
                      onPress={login} disabled={disabled}/>
          </View>
          <MyFooter sepText={lang.simpleLanguage.or}>
            <MyLink
              onPress={onSignup}
              disabled={disabled}>
              {lang.login.signup}
            </MyLink>
          </MyFooter>
        </MyScrollView>
      );


class Login extends Screen {
  constructor(props){
    super(props);
    this.state = {
      validPw: true,
      validMail: true
    };
  }

  login(){
    const {pw, name, mail} = this.state;
    const lang = this.props.lang;
    const mailValid = this.validateMail(mail);
    const pwValid = this.validatePw(pw);
    if(mailValid && pwValid){
      this.setState({disabled: true});
      get(`user/a/token`, basicAuth(this.state.mail, this.state.pw))
        .then(x => {
          this.props.storeTokenAndId(this.state.mail, x.token, x.id);
          this.setState({disabled: false});
          return get(`user/${this.props.global.id}`);
        })
        .then(x => {
          this.props.storeName(x.name);
          this.resetTo('taskX.SelectGroup');
        })
        .catch(handleApiError(
          { 401: lang.login.authWrong },
          () => this.setState({disabled: false})));
    }
  }

  validateMail(x=""){
    const res = checkMail(x);
    this.setState({validMail: res});
    return res;
  }

  validatePw(value=""){
    const res = checkPWLoose(value);
    this.setState({validPw: res});
    return res;
  }

  render(){
    return (
      <LoginView
        validMail={this.state.validMail}
        validPw={this.state.validPw}
        validateMail={this.validateMail.bind(this)}
        validatePw={this.validatePw.bind(this)}
        onMailChange={mail => this.setState({mail})}
        onPwChange={pw => this.setState({pw})}
        mail={this.state.mail || ''}
        pw={this.state.pw || ''}
        lang={this.props.lang}
        login={this.login.bind(this)}
        global={this.props.global}
        disabled={this.state.disabled}
        onSignup={() => this.resetTo('Apparts.Signup')}/>
    );
  }
};

Login = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeName
  ])(Login);

navigation.registerScreen('Apparts.Login', {
  clazz: Login,
  title: (store) => lang[store.global.lang].login.h1,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { Login };
