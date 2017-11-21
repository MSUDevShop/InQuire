import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-influencer-profile',
  templateUrl: 'influencer-profile.html',
})
export class InfluencerProfilePage {

  influencer = <any>{};
  followers: number;
  isfollowing: boolean = false;
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    this.influencer = this.navParams.get("influencer");
    this.followers = this.influencer.followers.length;
    console.log(this.influencer);
    this.apollo.query({
      query: gql`
        query {
          user {
            id
            following {
              id
            }
          }
        }
      `, fetchPolicy: "network-only"
    }).toPromise().then(({data}) => {
      let following = <any>[];
      following = data;
      this.userId = following.user.id;
      following = following.user.following;
      var that = this;
      if (following.find(function(e){return e.id==that.influencer.id})) {
        this.isfollowing = true;
      }
    });
  }

  follow() {
    return this.apollo.mutate({
      mutation: gql`
        mutation addToUserOnUser($followingUserId: ID!, $followersUserId: ID!) {
          addToUserOnUser(followingUserId: $followingUserId, followersUserId: $followersUserId) {
            followingUser {
              id
            }
          }
        }
      `, variables: {
        followingUserId: this.influencer.id,
        followersUserId: this.userId,
      }
    }).toPromise().then(({data}) => {
      this.isfollowing = true;
      this.followers++;
    })
  }

  unfollow() {
    return this.apollo.mutate({
      mutation: gql`
        mutation removeFromUserOnUser($followingUserId: ID!, $followersUserId: ID!) {
          removeFromUserOnUser(followingUserId: $followingUserId, followersUserId: $followersUserId) {
            followingUser {
              id
            }
          }
        }
      `, variables: {
        followingUserId: this.influencer.id,
        followersUserId: this.userId,
      }
    }).toPromise().then(({data}) => {
      this.isfollowing = false;
      this.followers--;
    });
  }

}
