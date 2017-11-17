import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for (let i = 1; i <= 12; i++) {
      this.charities.push(new charity("c"+i, "assets/charities/c"+i+".jpg"))
    }
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad CharitiesPage');
  }

}
