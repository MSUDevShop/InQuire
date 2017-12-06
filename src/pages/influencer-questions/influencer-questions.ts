import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AnswerPage } from '../answer/answer';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

/**
 * Generated class for the InfluencerQuestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-influencer-questions',
  templateUrl: 'influencer-questions.html',
})
export class InfluencerQuestionsPage {

  user = <any>{};
  questionsToMe = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    //Query for influencers the user follows
    this.apollo.query({
      query: gql`
        query {
          user {
            id
            isInfluencer
            profilePic
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
      `
    }).toPromise().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      this.questionsToMe = [];
      for(let question of this.user.questionsToMe) {
        if (!question.answer) {
          this.questionsToMe.push(question);
        }
      }
    })
  }

  gotoAnswer(question) {
    this.navCtrl.push(AnswerPage, {question: question, user: this.user});
  }


}
