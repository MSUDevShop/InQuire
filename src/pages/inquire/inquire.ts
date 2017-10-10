/*
Author: Yash Vesikar
Created On: 10/9/2017

CHANGELOG:

*/
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

  influencers = <any>[]; // These are all the influencers the current user "follows"
  // pushPage: any;
  // params: Object; //

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo) {

                //Query for influencers the user follows
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
                  // Sets an array of influencers the user follows to this.influencers
                  this.influencers = this.influencers.user.following;
                })

            }

  // onclick function that pushs a unique influencers page onto the screen
  openQuestionPage(influencer) {
    /*
    influencer param is the influencer that the user selected
    influencer : object[influencer]
    */
    this.navCtrl.push(QuestionPage, { influencer: influencer });
  }

}
