import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { QuestionPage } from '../question/question';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';


@Component({
  selector: 'page-inquire',
  templateUrl: 'inquire.html'
})
export class InquirePage {

  influencers = <any>[];
  pushPage: any;
  params: Object;

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo) {

      this.apollo.query({
        query: gql`
          query {
            user{
              following {
                id
                fullName
                profilePic
                userName
              }
            }
          }
        `
      }).toPromise().then(({data}) => {
        this.influencers = data;
        this.influencers = this.influencers.user.following;;
        console.log(this.influencers)
      })

  }


  openQuestionPage(influencer) {
    this.navCtrl.push(QuestionPage, { influencer: influencer });
  }

}
