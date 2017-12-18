import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

/**
 * Generated class for the CharitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class charity {
   name: string;
   photo: string
   constructor(name: string, photo: string) {
      this.name = name;
      this.photo = photo;
  }
 }

@IonicPage()
@Component({
  selector: 'page-charities',
  templateUrl: 'charities.html',
})
export class CharitiesPage {

  charities = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
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
    })
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad CharitiesPage');
  }

}
