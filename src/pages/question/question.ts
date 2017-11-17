import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormsModule }   from '@angular/forms'

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';


class charity {
   name: string;
   photo: string;
   selected: boolean
   constructor(name: string, photo: string, selected: boolean = false) {
      this.name = name;
      this.photo = photo;
      selected = selected
  }
 }



@IonicPage()
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})

export class QuestionPage {
  user = <any>{}; // Object to hold user data from gql (basically a temp variable)
  userId: any; // The current users ID

  charities = <any>[];

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {


                //Adds all charities to array
                for (let i = 1; i <= 12; i++) {
                  this.charities.push(new charity("c"+i, "assets/charities/c"+i+".jpg"))
                }

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
      value:[1].toString(),
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
      let toast = this.toastCtrl.create({
        message: 'Please type the question first.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
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
      }).toPromise().then(({data}) => {
        let toast = this.toastCtrl.create({
          message: 'Question asked successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop();
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

  selectCharity(charity) {
    for (let c of this.charities) {
      c.selected = false;
    }
    charity.selected = true;
  }

}
