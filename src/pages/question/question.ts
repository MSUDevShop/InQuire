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

  user = <any>{};
  userId: any;

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
                this.apollo.query({
                  query: gql`
                    query {
                      user{
                        id
                      }
                    }
                  `
                }).toPromise().then(({data}) => {
                  this.user = data;
                  this.userId = this.user.user.id;
                });
              }

    influencer = this.navParams.get("influencer");

    newQuestion = {
      text: "",
      value:[].toString(),
      // influencerId: this.influencer.id,
      userId: this.user.id
    }

  validate() {
    let input = this.newQuestion;
    if(input.text === ""){
      console.log("Throw incorrect question error");
    } else if(isNaN(parseInt(input.value)) === true){
      console.log("Throw incorrect value input");
    } else if (parseInt(input.value) <= 0){
      console.log("Throw value can not be less than 1");
    } else {
      return true;
    }
    return false;
  }

  submitQuestion() {
    if (this.validate() === true){
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
      console.log(this.userId);
    }
  }

  customValue() {
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
