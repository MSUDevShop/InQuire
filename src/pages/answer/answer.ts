import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-answer',
  templateUrl: 'answer.html',
})
export class AnswerPage {
  answer: any = "";
  user = <any> {};
  question: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo, public toastCtrl: ToastController) {
    this.question = this.navParams.get("question")
    this.user = this.navParams.get("user");
  }

  answerQuestion() {
    if (!this.answer) {
      let toast = this.toastCtrl.create({
        message: 'Please provide an answer',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      this.apollo.mutate({
        mutation: gql`
          mutation updateQuestion($id: ID!, $answer: String) {
            updateQuestion(id: $id, answer: $answer) {
              id
            }
          }
        `, variables: {
          id: this.question.id,
          answer: this.answer,
          answered: true
        }
      }).toPromise().then(({data}) => {
        let toast = this.toastCtrl.create({
          message: 'Answer submitted successfully.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop();
      });
    }
  }

}
