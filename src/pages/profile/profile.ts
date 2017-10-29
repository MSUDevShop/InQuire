import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { AnswerPage } from '../answer/answer';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  user = <any>{};
  questions = <any>[];

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo) {
    this.getUserInfo().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      for(let question of this.user.questionsToMe) {
        if (!question.answer) {
          this.questions.push(question);
        }
      }
      console.log(this.user);
    });
  }
  ionViewDidEnter() {
    this.getUserInfo().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      for(let question of this.user.questionsToMe) {
        if (!question.answer) {
          this.questions.push(question);
        }
      }
      console.log(this.user);
    });
  }

  getUserInfo() {
    return this.apollo.query({
      query: gql`
      query {
        user {
          id
          email
          profilePic
          fullName
          isInfluencer
          questionsToMe {
            id
            question
            value
            answer
            user {
              id
              fullName
            }
          }
        }
      }
      `,
      fetchPolicy: "network-only"
    }).toPromise();
  }

  goToSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

  gotoAnswer(question) {
    this.navCtrl.push(AnswerPage, {question: question});
  }

}
