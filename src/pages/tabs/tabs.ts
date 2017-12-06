import { Component } from '@angular/core';
//pages
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { InquirePage } from '../inquire/inquire';
import { CharitiesPage } from '../charities/charities';
import { InfluencerProfilePage } from '../influencer-profile/influencer-profile';
import { InfluencerQuestionsPage } from '../influencer-questions/influencer-questions';


import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root: any;
  tab3Root: any;
  tab4Root = CharitiesPage;

  user = <any>{};

  constructor(public apollo: Angular2Apollo) {
    this.apollo.query({
      query: gql`
        query {
          user {
            id
            isInfluencer
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      if (this.user.isInfluencer == true) {
        this.tab2Root = InfluencerQuestionsPage;
        this.tab3Root = InfluencerProfilePage;
      } else {
        this.tab2Root = InquirePage;
        this.tab3Root = ProfilePage;
      }
    });

  }
}
