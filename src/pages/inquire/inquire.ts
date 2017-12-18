import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

import { QuestionPage } from '../question/question';
import { AnswerPage } from '../answer/answer';
import { InfluencerProfilePage } from '../influencer-profile/influencer-profile';


@Component({
  selector: 'page-inquire',
  templateUrl: 'inquire.html'
})
export class InquirePage {

  influencers = <any>[]; // These are all the influencers the current user "follows"
  influencersData = <any>[];
  top3 = <any>[];
  userId: any;
  user = <any>{};
  isInfluencer: boolean = false;
  questionsToMe = <any>[];


  constructor(public navCtrl: NavController,
              public apollo: Angular2Apollo)
    {
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
              backgroundPic
              followers {
                id
              }
            }
            user {
              id
              isInfluencer
              profilePic
            }
          }
        `
      }).toPromise().then(({data}) => {

        //Excluding user from list if is influencer
        let temp: any;
        temp = data;
        this.userId = temp.user.id;
        this.user = temp.user;
        this.isInfluencer = temp.user.isInfluencer;
        for (let influencer of temp.allUsers) {
          if (influencer.id != this.userId) {
            this.influencers.push(influencer);
          }
        }
        this.top3 = this.influencers.slice(0, 3);
        console.log(this.top3);
        this.influencersData = this.influencers.slice(3);
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

  //Reseting array
  initializeItems(): void {
    this.influencersData = this.influencers;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.initializeItems();
      return;
    }

    this.influencersData = this.influencersData.filter((v) => {
      if(v.fullName && q) {
        if (v.fullName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  gotoAnswer(question) {
    this.navCtrl.push(AnswerPage, {question: question, user: this.user});
  }

  gotoInfluencer(influencer) {
    this.navCtrl.push(InfluencerProfilePage, {influencer: influencer});
  }

}
