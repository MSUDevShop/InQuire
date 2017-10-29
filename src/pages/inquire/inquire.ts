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
  userId: any;
  // pushPage: any;
  // params: Object; //

  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo) {

                //Query for influencers the user follows
                this.apollo.query({
                  query: gql`
                    query {
                      allUsers(filter: {
                        isInfluencer: true
                      }) {
                        id
                        fullName
                        profilePic
                      }
                      user {
                        id
                      }
                    }
                  `
                }).toPromise().then(({data}) => {
                  
                  //Excluding user from list if is influencer
                  let temp: any;
                  temp = data;
                  this.userId = temp.user.id;
                  for (let influencer of temp.allUsers) {
                    if (influencer.id != this.userId) {
                      this.influencers.push(influencer);
                    }
                  }
                  console.log(this.influencers);
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
