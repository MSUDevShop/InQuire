import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  questions = <any>[];


  email: "";
  password: "";
  confirmPassword: "";
  userInfo = <any>{};

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo, public toastCtrl: ToastController ) {
    this.apollo.query({
      query: gql`
        query {
          allQuestions {
            id
            question
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.questions = data;
      this.questions = this.questions.allQuestions;
    })


  }

  doLogin(event) {
    let userInfo = <any>{};
    this.login().then(({data}) =>{
      if (data) {
        userInfo.data = data
        console.log(userInfo.data.signinUser.token);
        window.localStorage.setItem('graphcoolToken', userInfo.data.signinUser.token);
      }
      // this.apollo.watchQuery({
      // query: this.CurrentUserForProfile
      // }).subscribe(({data}) => {
      //     console.log(data);
      // });

    }).then(() => {
      this.navCtrl.push(TabsPage);
    }).catch(() => {
    console.log('view was not dismissed');
    this.showToast();
  });
}

  login(){
      return this.apollo.mutate({
        mutation: gql`
        mutation signinUser($email: String!,
                            $password: String!){

          signinUser(email: {email: $email, password: $password}){
            token
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Login failed, Please try again.',
      duration: 2500,
      position: 'bottom'
    });

    toast.present(toast);
  }

  goToSignUp(){
    this.navCtrl.push(SignupPage);
  }




}
