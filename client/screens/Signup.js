import React, { Component } from 'react';
import { connect } from 'apparts-redux';
import * as actions from '../actions/index';
import { StyleSheet, View, Button, Alert, Text } from 'react-native';
const Colors = require('apparts-config').get('color');
const LoginConf = require('apparts-config').get('login');
const LangConf = require('apparts-config').get('lang');
import { MyText, MyTextInput, MyLink, MyInput, MySubmit, MyCountrySelect,
         MyScrollView, MyFooter} from 'apparts-react-native-components';
import { checkMail, checkPW, checkName } from '../util.js';
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

class Signup extends Component {
  render() {
    const { lang, language, name, mail, pw,
            validMail, validName, validPw, mailTaken, nameTaken,
            validateMail, validateName, validatePw,
            onChangeMail, onChangeName, onChangePw,
            submit, disabled, onLogin, onPwForgotten } = this.props;
    let mailError = !mailTaken ? lang.account.mailError : {
      ...lang.signup.userExists,
      onPress: onPwForgotten
    };
    let nameError = !nameTaken ? lang.account.nameError : {
      ...lang.signup.nicknameTaken,
      onPress: onPwForgotten
    };

    return (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>{lang.signup.h1}</MyText>
            <MyCountrySelect
              {...language}
              style={{ position: 'absolute', top: 33, right: 25 }}/>
            <MyInput valid={validMail && !mailTaken }
                     validate={validateMail}
                     placeholder={lang.account.mail}
                     keyboardType="email-address"
                     autoCapitalize={'none'}
                     value={mail}
                     error={mailError}
                     next={() => this._input2}
                     onChangeText={onChangeMail}/>
            <MyInput valid={validName}
                     validate={validateName}
                     placeholder={lang.account.name}
                     autoCorrect={false}
                     value={name}
                     error={nameError}
                     next={() => this._input3}
                     ref={input => this._input2 = input}
                     onChangeText={onChangeName}/>
            <MyInput valid={validPw}
                     validate={validatePw}
                     placeholder={lang.account.password}
                     secureTextEntry={true}
                     autoCapitalize={'none'}
                     value={pw}
                     error={lang.account.passwordError}
                     next={submit}
                     ref={input => this._input3 = input}
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
  }
};

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
          this.props.storeTokenAndId(mail, x.token, x.id);
          navigation.resetTo(LoginConf.screenAfterSignup);
        })
        .catch(x => {
          if(x.status === 400){
            x.json()
              .then(({ error, message }) => {
                if(error === "Username taken"){
                  this.setState({ disabled: false, mailTaken: true });
                } else if(error === "Nickname taken"){
                  this.setState({ disabled: false, nameTaken: true });
                } else if(error === "Fieldmissmatch"
                          && message && message.email === "expected email") {
                  this.setState({ disabled: false, validMail: false });
                } else if(error === "Fieldmissmatch"
                          && message && message.password === "expected password") {
                  this.setState({ disabled: false, validPw: false });
                } else {
                  handleApiError({}, () => this.setState({disabled: false}));
                }
              })
              .catch(() => {
                handleApiError({}, () => this.setState({disabled: false}));
              });
          } else {
            handleApiError({}, () => this.setState({disabled: false}));
          }
        });
    }
  }

  validateMail(x=""){
    const res = checkMail(x);
    this.setState({validMail: res, mailTaken: false});
    return res;
  }

  validateName(value=""){
    const res = checkName(value);
    this.setState({validName: res });
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
        lang={lang["apparts-login"]}
        validMail={state.validMail}
        validName={state.validName}
        validPw={state.validPw}
        mailTaken={state.mailTaken}
        nameTaken={state.nameTaken}
        validateMail={this.validateMail.bind(this)}
        validateName={this.validateName.bind(this)}
        validatePw={this.validatePw.bind(this)}
        onChangeMail={mail => this.setState({ mail })}
        onChangeName={name => this.setState({ name })}
        onChangePw={pw => this.setState({ pw })}
        onLogin={() => this.resetTo('Apparts.Login')}
        onPwForgotten={() => this.push('Apparts.PwForgotten')}
        submit={this.submit.bind(this)}
        disabled={state.disabled}
        mail={state.mail || ''}
        name={state.name || ''}
        pw={state.pw || ''}
        language={{
          languages: LangConf.supportedLangs,
          onSelect: this.props.setLanguage,
          language: this.props.global.lang
        }}
        />);
  }
};

SignupWrapper = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeEmail,
    actions.storeName,
    actions.setLanguage
  ])(SignupWrapper);

navigation.registerScreen('Apparts.Signup', {
  clazz: SignupWrapper,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { SignupWrapper as Signup };
