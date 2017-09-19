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

  constructor(public navCtrl: NavController) {}

}
