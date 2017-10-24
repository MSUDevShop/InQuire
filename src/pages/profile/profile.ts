import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  user = <any>{};
  questions = <any>[];

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo) {
    this.getUserInfo().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      console.log(this.user);
    })
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
            influencer {
              id
              fullName
            }
          }
        }
      }
      `
    }).toPromise();
  }

  goToSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

}
