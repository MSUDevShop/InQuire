import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule }   from '@angular/forms'
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  questions = <any>[];
  question: "";
  value: "";
  userQuestion: {
    question;
    value;
  };

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              //  private formBuilder: FormBuilder
             ) {
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
    // this.userQuestion = this.formBuilder.group({
    //   question: ['', Validators.required],
    //   questionValue: []
    // });

  }

  submitQuestion() {
    this.apollo.mutate({
      mutation: gql`
      mutation($question:String!) {
      	createQuestion(question: $question){
          question
        }
      }
      `, variables:{
        question: this.userQuestion.question
      }
    });
    console.log(this.userQuestion.question);
  }

}
