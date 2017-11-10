import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InfluencerProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-influencer-profile',
  templateUrl: 'influencer-profile.html',
})
export class InfluencerProfilePage {

  influencer = <any>{};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.influencer = this.navParams.get("influencer");
    console.log(this.influencer);
  }



}
