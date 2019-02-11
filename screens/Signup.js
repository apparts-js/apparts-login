import React, { Component } from 'react';
import { connect } from 'apparts-redux';
import * as actions from '../actions/index';
import { StyleSheet, View, Button, Alert } from 'react-native';
const Colors = require('apparts-config').get('color');
import { MyText, MyTextInput, MyLink, MyInput, MySubmit,
         MyScrollView, MyFooter} from 'apparts-react-native-components';
import { checkMail, checkPW } from '../util.js';
import * as navigation from 'apparts-react-navigation';
import { Screen } from 'apparts-react-navigation';
import { get, post, basicAuth, handleApiError } from 'apparts-frontend-api';
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

const Signup = ({ lang, name, mail, pw,
                  validMail, validName, validPw,
                  validateMail, validateName, validatePw,
                  onChangeMail, onChangeName, onChangePw,
                  submit, disabled, onLogin }) =>
      (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>{lang.signup.h1}</MyText>
            <MyInput valid={validMail}
                     validate={validateMail}
                     placeholder={lang.account.mail}
                     keyboardType="email-address"
                     autoCapitalize={'none'}
                     value={mail}
                     error={lang.account.mailError}
                     onChangeText={onChangeMail}/>
            <MyInput valid={validName}
                     validate={validateName}
                     placeholder={lang.account.name}
                     autoCorrect={false}
                     value={name}
                     error={lang.account.nameError}
                     onChangeText={onChangeName}/>
            <MyInput valid={validPw}
                     validate={validatePw}
                     placeholder={lang.account.password}
                     secureTextEntry={true}
                     autoCapitalize={'none'}
                     value={pw}
                     error={lang.account.passwordError}
                     onChangeText={onChangePw}/>
            <MySubmit text={lang.controlls.continue}
                      onPress={submit}
                      disabled={disabled}/>
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

class SignupWrapper extends Screen {
  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      validMail: true,
      validName: true,
      validPw: true
    };
  }

  submit(){
    const {pw, name, mail} = this.state;
    const lang = this.props.lang;
    const mailValid = this.validateMail(mail);
    const nameValid = this.validateName(name);
    const pwValid = this.validatePw(pw);

    if(mailValid && nameValid && pwValid){
      this.setState({disabled: true});
      post('user', {email: mail, password: pw, name: name}, false)
        .then(x => {
          this.props.storeEmail(mail);
          this.props.storeName(name);
          return get('user/aa/token', basicAuth(mail, pw));
        })
        .then(x => {
          this.props.storeTokenAndId(mail, x.token, x.id);
          navigation.resetTo('AfterLogin');
        })
        .catch(handleApiError(
          { '400.user exists': lang.signup.userExists,
            '400.Fieldmissmatch ( body: {"email":"expected email"})':
            lang.signup.mailInvalid},
          () => this.setState({disabled: false})));
    }
  }

  validateMail(x=""){
    const res = checkMail(x);
    this.setState({validMail: res});
    return res;
  }

  validateName(value=""){
    const res = value.length > 2;
    this.setState({validName: res});
    return res;
  }

  validatePw(value=""){
    const res = checkPW(value);
    this.setState({validPw: res});
    return res;
  }

  render(){
    let lang = this.props.lang;
    let state = this.state;
    return (
      <Signup
        lang={lang}
        validMail={state.validMail}
        validName={state.validName}
        validPw={state.validPw}
        validateMail={this.validateMail.bind(this)}
        validateName={this.validateName.bind(this)}
        validatePw={this.validatePw.bind(this)}
        onChangeMail={mail => this.setState({ mail })}
        onChangeName={name => this.setState({ name })}
        onChangePw={pw => this.setState({ pw })}
        onLogin={() => navigation.resetTo(this.props.componentId, 'Apparts.Login')}
        submit={this.submit.bind(this)}
        disabled={state.disabled}
        mail={state.mail || ''}
        name={state.name || ''}
        pw={state.pw || ''}
        />);
  }
};

SignupWrapper = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeEmail,
    actions.storeName
  ])(SignupWrapper);

navigation.registerScreen('Apparts.Signup', {
  clazz: SignupWrapper,
  title: (store) => lang[store.global.lang].signup.h1,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { SignupWrapper as Signup };
