import React, { Component } from 'react';
import { connect } from 'apparts-redux';
import * as actions from '../actions/index';
import { StyleSheet, Platform, View, Button, Alert, Text } from 'react-native';
const Colors = require('apparts-config').get('color');
const LoginConf = require('apparts-config').get('login');
import { MyText, MyTextInput, MyLink, MyInput, MyFooter,
         MySubmit, MyScrollView } from 'apparts-react-native-components';
import { checkMail, checkPWLoose } from '../util.js';
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

class PwForgottenView extends Component {
  render() {
    const { lang, onMailChange, validMail, validateMail,
            onLogin, pwForgotten, disabled, mail } = this.props;
    return (
        <MyScrollView>
          <View style={styles.outerWrapper}>
            <MyText style={styles.heading}>
              {lang.pwForgotten.h1}
            </MyText>
            <MyInput validate={validateMail}
                     valid={validMail}
                     placeholder={lang.account.mail}
                     keyboardType="email-address"
                     autoCapitalize={'none'}
                     onChangeText={onMailChange}
                     value={mail}
                     next={pwForgotten} />
            <MySubmit text={lang.controlls.continue}
                      onPress={pwForgotten} disabled={disabled}/>
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


class PwForgotten extends Screen {
  constructor(props){
    super(props);
    this.state = {
      validMail: true
    };
  }

  pwForgotten(){
    const {mail} = this.state;
    const mailValid = this.validateMail(mail);
    if(mailValid){
      this.setState({disabled: true});
      post(`user/${mail}/reset`, null, null)
        .then(x => {
          this.push('Apparts.PwForgottenDone');
        })
        .catch(x => {
          handleApiError({}, () => this.setState({disabled: false}))(x);
        });
    }
  }

  validateMail(x=""){
    const res = checkMail(x);
    this.setState({validMail: res});
    return res;
  }

  render(){
    return (
      <PwForgottenView
        validMail={this.state.validMail}
        validateMail={this.validateMail.bind(this)}
        onMailChange={mail => this.setState({mail})}
        mail={this.state.mail || ''}
        lang={this.props.lang["apparts-login"]}
        pwForgotten={this.pwForgotten.bind(this)}
        global={this.props.global}
        disabled={this.state.disabled}
        onLogin={() => this.resetTo('Apparts.Login')}/>
    );
  }
};

PwForgotten = connect(
  ({ }) => ({ }),
  [ actions.storeTokenAndId,
    actions.storeName
  ])(PwForgotten);

navigation.registerScreen('Apparts.PwForgotten', {
  clazz: PwForgotten,
  navigatorStyle: navigation.navigatorStyleNoStatus
});

export { PwForgotten };
