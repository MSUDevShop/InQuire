import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormsModule }   from '@angular/forms'
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { QuestionPage } from '../question/question';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  questionPage = QuestionPage;
  questions = <any>[];

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo
             ) {
    this.apollo.query({
      query: gql`
        query {
          allQuestions {
            id
            question
            influencer {
              id
              fullName
            }
            user{
              id
              fullName
            }
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.questions = data;
      this.questions = this.questions.allQuestions;
    })

  }

}
