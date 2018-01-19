import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Stripe } from '@ionic-native/stripe';

import { Http, URLSearchParams } from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-donate',
  templateUrl: 'donate.html',
})
export class DonatePage {

  cardImage = "assets/credit-card.png";

  charity: any;
  donateAmount = 1;

  card = {
   number: '',
   expMonth: 0,
   expYear: 0,
   cvc: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public stripe: Stripe, public http: Http, public toastCtrl: ToastController) {
    this.charity = this.navParams.get('charity');
    console.log(this.charity);
    this.stripe.setPublishableKey('pk_live_lBf9W8G3n0UCNUUIEHmZqNx5');
  }

  submit() {
    this.stripe.createCardToken(this.card)
     .then(token => {
       this.http.post('http://45.55.44.208:3000/charge', {cardToken: token, email: 'gugafflu@gmail.com', donateAmount: this.donateAmount}, {})
       .map(res => res.json())
       .subscribe(data => {console.log(data)});
     })
     .catch(error => {
       let toast = this.toastCtrl.create({
          message: error,
          duration: 2000,
          position: 'top'
        });
        toast.present();
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DonatePage');
  }

}
