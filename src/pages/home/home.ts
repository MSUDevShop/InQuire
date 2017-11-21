import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormsModule }   from '@angular/forms'
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { QuestionPage } from '../question/question';
import { InfluencerProfilePage } from '../influencer-profile/influencer-profile';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  questionPage = QuestionPage;
  questions = <any>[];
  user = <any> {};
  answered: any = 0;
  moneyRaised: any = 0;

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo
             ) {
    this.apollo.query({
      query: gql`
        query allQuestions($param: String){
          allQuestions(filter: {answer_not: $param}) {
            id
            question
            answer
            influencer {
              id
              fullName
              profilePic
              followers {
                id
              }
            }
            user{
              id
              fullName
            }
          }
          user{
            id
            isInfluencer
            profilePic
            fullName
            questionsToMe {
              id
              answer
              value
            }
          }
        }
      `, variables: {
        param: null
      }
    }).toPromise().then(({data}) => {
      this.questions = data;
      this.user = this.questions.user;
      console.log(this.user);
      this.questions = this.questions.allQuestions;
      for (let question of this.user.questionsToMe) {
        if (question.answer != "" && question.answer != null) {
          this.answered++;
          this.moneyRaised+=question.value;
        }
      }
    })

  }

  gotoInfluencer(influencer) {
    this.navCtrl.push(InfluencerProfilePage, {influencer: influencer});
  }

}
