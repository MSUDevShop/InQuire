import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { InfluencerProfilePage } from '../influencer-profile/influencer-profile';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  user = <any>{};
  following = <any>[];
  donated: any = 0;

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo) {
    this.getUserInfo().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      this.following = this.user.following;
      for (let question of this.user.questions) {
          this.donated += +question.value;
      }
    });
  }
  ionViewDidEnter() {
    this.getUserInfo().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
    });
  }

  getUserInfo() {
    return this.apollo.query({
      query: gql`
      query {
        user {
          id
          email
          profilePic
          fullName
          isInfluencer
          questions {
            id
            question
            value
            answer
          }
          following {
            id
            fullName
            profilePic
            followers {
              id
            }
          }
        }
      }
      `,
      fetchPolicy: "network-only"
    }).toPromise();
  }

  goToSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

  gotoInfluencer(influencer) {
    this.navCtrl.push(InfluencerProfilePage, {influencer: influencer});
  }

}
