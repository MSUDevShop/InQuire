/*
  Author: Yash Vesikar
  Created On: 10/9/2017

  CHANGELOG:

*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
/*
  This page is dynamically created when a user selects a influencer to ask a question to
  input NavParams is a influencer object
*/
  user = <any>{}; // Object to hold user data from gql (basically a temp variable)
  userId: any; // The current users ID

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
                // gql Query that returns the current users ID
                this.apollo.query({
                  query: gql`
                    query {
                      user{
                        id
                        profilePic
                        fullName
                      }
                    }
                  `
                }).toPromise().then(({data}) => {
                  this.user = data;
                  this.user = this.user.user;
                  // Convoluted way of storing the users ID
                  this.userId = this.user.id;
                });
              }

    influencer = this.navParams.get("influencer"); // Influencer Data
    // New Question data
    newQuestion = {
      text: "",
      value:[].toString(),
      userId: this.user.id
    }

  validate() {
    /*
      Function is validation for new questions
      Checks if question and value are proper and within range
      ***** Need to add feedback elements if question or value is improper *****
    */
    let input = this.newQuestion;
    if(input.text === ""){
      console.log("Throw incorrect question error"); // Need to turn input area red w/ error message
    } else if(isNaN(parseInt(input.value)) === true){
      console.log("Throw incorrect value input"); // Need to turn value red w/ error message
    } else if (parseInt(input.value) <= 0){
      console.log("Throw value can not be less than 1"); // Need to turn value red w/ error message
    } else {
      return true;
    }
    return false;
  }

  submitQuestion() {
    /*
      Submit Question Function makes gql mutation if all input is valid
    */
    if (this.validate() === true) {
      // gql mutation for sending user question to influencer
      this.apollo.mutate({
        mutation: gql`
        mutation createQuestion($question:String!, $value: String!, $influencerId:ID, $userId: ID){
          createQuestion(
            question: $question,
            influencerId:$influencerId,
            value: $value,
            userId: $userId
          ){
            id
          }
        }
        `, variables:{
          question: this.newQuestion.text,
          value: this.newQuestion.value.toString(),
          influencerId: this.influencer.id,
          userId: this.userId
        }
      });
    }
  }

  customValue() {
    /*
      Function for custom value input
    */
    // Creates a input alert/modal
    let prompt = this.alertCtrl.create({
      title: 'Custom Value',
      message: "Enter a custom value for your question",
      inputs: [
        {
          name: 'value',
          placeholder: '$$$',
          type: 'tel'

        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Lets Go!',
          handler: data => {
            console.log('Saved clicked', data);
            this.newQuestion.value = data.value;
            console.log(this.newQuestion);
          }
        }
      ]
    });
    prompt.present();
  }

}
