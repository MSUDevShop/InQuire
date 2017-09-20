import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FormsModule }   from '@angular/forms'
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {

  questions = <any>[];
  newQuestion = {
    text: "",
    value:[].toString()
  }

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo) {}

  submitQuestion() {
    this.apollo.mutate({
      mutation: gql`
      mutation($question:String!, $value: String!) {
      	createQuestion(question: $question, value: $value){
          question
          value
        }
      }
      `, variables:{
        question: this.newQuestion.text,
        value: this.newQuestion.value.toString()
      }
    });
    console.log(typeof(this.newQuestion.value.toString()));
  }

}
