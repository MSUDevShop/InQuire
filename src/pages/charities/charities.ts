import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

// import { DonatePage }


@IonicPage()
@Component({
  selector: 'page-charities',
  templateUrl: 'charities.html',
})
export class CharitiesPage implements OnInit {

  charities = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
  }

  ngOnInit() {
    this.apollo.query({
      query: gql`
        query {
          allCharities{
            id
            name
            photo
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.charities = data;
      this.charities = this.charities.allCharities;
    });
  }

  donate(charity) {
      this.navCtrl.push('DonatePage', {charity: charity});
  }

}
