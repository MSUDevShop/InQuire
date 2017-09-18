import { Component } from '@angular/core';
import { NavController, ToastController, Platform} from 'ionic-angular';

import { HomePage } from '../home/home';

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
    this.apollo.query({
      query: gql`
        query {
          allQuestions {
            id
            question
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.questions = data;
      this.questions = this.questions.allQuestions;
    })


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
    else{
      this.createUser().then(({data}) => {
          if (data){
            this.signIn().then(({data}) => {
              this.userInfo.data = data
              console.log(this.userInfo.data.signinUser.token);
              window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
              this.navCtrl.setRoot(HomePage);
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

  }


  createUser(){
      console.log(this.fullName);
      return this.apollo.mutate({
        mutation: gql`
        mutation createUser($email: String!,
                            $password: String!,
                            $fullName: String!,
                            $userName: String!,
                            $profilePic: String){

          createUser(authProvider: { email: {email: $email, password: $password}},
                     fullName: $fullName,
                     userName: $userName,
                     profilePic: $profilePic){
            id
          }
        }
        `,
        variables: {
          fullName: this.fullName,
          userName: this.userName,
          email: this.email,
          password: this.password,
          profilePic: this.imageUri
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
