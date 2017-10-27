import { Component } from '@angular/core';
import { NavController, ToastController, Platform} from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  questions = <any>[];

  isInfluencer = false;
  influencerCode = "";
  correctCode = false;
  fullName: "";
  userName: "";
  email: "";
  password: "";
  confirmPassword: "";
  userInfo = <any>{};

  imageUri = "https://msudenver.edu/media/sampleassets/profile-placeholder.png";


  constructor(public navCtrl: NavController, public apollo: Angular2Apollo,
              public toastCtrl: ToastController, private Camera: Camera,
              private platform: Platform ) {
  }

  loginEvent(event) {
    if (!this.fullName || !this.userName || !this.email || !this.password || !this.confirmPassword) {
      let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else if(this.password != this.confirmPassword){
      let toast = this.toastCtrl.create({
        message: 'Your passwords do not match. Please try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else {
      if (this.influencerCode) {
        this.checkAccessCode().then(({data}) => {
          let allAccessCodes = <any>[];
          allAccessCodes = data;
          allAccessCodes = allAccessCodes.allAccessCodes;
          if (allAccessCodes.length) {
            this.correctCode = true;
            this.createandSignUp();
          } else {
            let toast = this.toastCtrl.create({
              message: 'Access code is not correct. Please try again',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            return;
          }
        });
      } else {
        this.createandSignUp();
      }
    }
  }

  createandSignUp() {
    this.createUser().then(({data}) => {
      console.log(data);
        if (data){
          this.signIn().then(({data}) => {
            this.userInfo.data = data
            console.log(this.userInfo.data.signinUser.token);
            window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
            this.navCtrl.setRoot(TabsPage);
          }, (errors) => {
              console.log(errors);
              if (errors == "GraphQL error: No user found with that information") {
                let toast = this.toastCtrl.create({
                  message: 'User already exists with that information. Try again.',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }
            });

        }
      }, (errors) => {
        console.log(errors);
        if (errors == "Error: GraphQL error: User already exists with that information") {
          let toast = this.toastCtrl.create({
            message: 'User already exists with that information. Try again.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      });
  }


  createUser(){
      return this.apollo.mutate({
        mutation: gql`
        mutation createUser($email: String!,
                            $password: String!,
                            $fullName: String!,
                            $userName: String!,
                            $profilePic: String,
                            $isInfluencer: Boolean){

          createUser(authProvider: { email: {email: $email, password: $password}},
                     fullName: $fullName,
                     userName: $userName,
                     profilePic: $profilePic, isInfluencer: $isInfluencer){
            id
          }
        }
        `,
        variables: {
          fullName: this.fullName,
          userName: this.userName,
          email: this.email,
          password: this.password,
          profilePic: this.imageUri,
          isInfluencer: this.correctCode
        }
      }).toPromise();
  }

  signIn(){
      return this.apollo.mutate({
        mutation: gql`
        mutation signinUser($email: String!,
                            $password: String!){

          signinUser(email: {email: $email, password: $password}){
            token
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }

  checkAccessCode() {
      return this.apollo.query({
        query: gql`
          query allAccessCodes($accessCode: String!) {
            allAccessCodes(filter: {accessCode: $accessCode}){
              id
            }
          }
        `, variables: {
            accessCode: this.influencerCode
        }
      }).toPromise();
  }

  changePic() {
    let options: CameraOptions = {
      quality: 50,
      destinationType: 0,
      targetWidth: 500,
      targetHeight: 500,
      encodingType: 0,
      sourceType: 0,
      correctOrientation: true,
      allowEdit: true

    };
    if (this.platform.is('android')) {
      this.Camera.getPicture(options).then((ImageData) => {
        let base64Image = "data:image/jpeg;base64," + ImageData;
        this.imageUri = base64Image;
      });
    } else if (this.platform.is('ios')) {
      this.Camera.getPicture(options).then((ImageData) => {
        let base64Image = "data:image/jpeg;base64," + ImageData;
        this.imageUri = base64Image;
      })
    }
  }

}
