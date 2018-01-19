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


import { Http, URLSearchParams } from '@angular/http';

import { Stripe } from '@ionic-native/stripe';

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
  e: any;

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              public http: Http,
              public stripe: Stripe
             ) {


               // this.stripe.setPublishableKey('sk_test_TYZj7thwUssypbIIT1w2PkWU');
               // let card = {
               //   number: '4242424242424242',
               //   expMonth: 12,
               //   expYear: 2020,
               //   cvc: '220'
               //  };
               //
               //  this.stripe.createCardToken(card)
               //     .then(token => {
               //       this.http.post('http://localhost:3000/charge', {cardToken: 'token'}, {})
               //       .map(res => res.json())
               //       .subscribe(data => {console.log(data)});
               //     })
               //     .catch(error => console.error(error));

                   this.http.post('http://localhost:3000/charge', {cardToken: 'mycardtoken', email: 'email'}, {})
                   .map(res => res.json())
                   .subscribe(data => {console.log(data)});
  //  this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
  //     console.log(data.data.children);
  // });

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
            goal
            questionsToMe {
              id
              answer
              value
            }
            _followersMeta{
              count
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
