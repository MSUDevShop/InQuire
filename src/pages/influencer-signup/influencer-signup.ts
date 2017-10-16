import { Component } from '@angular/core';
import { NavController, ToastController, Platform} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Angular2Apollo } from 'angular2-apollo';
import 'rxjs/add/operator/toPromise';
import { UserProvider, UserType } from '../../providers/user/user';

@Component({
  selector: 'page-influencer-signup',
  templateUrl: 'influencer-signup.html',
})
export class InfluencerSignupPage {

  form: FormGroup;

  imageUri = "https://msudenver.edu/media/sampleassets/profile-placeholder.png";

  constructor(
    public navCtrl: NavController,
    public apollo: Angular2Apollo,
    public toastCtrl: ToastController,
    private Camera: Camera,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private userService: UserProvider,
  ) {
    this.form = formBuilder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      accessCode: ['', Validators.required],
      role: UserType.INFLUENCER,
    })
  }

  register() {
    this.userService.validateForm(this.form.value)
    .then(res => {
      if(res) {
        this.userService.createUser(this.form.value).then(() => {
          const toast = this.toastCtrl.create({
            message: 'Sign Up Successful!',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }).catch(err => { throw(err);});
      }
    })
    .catch(err => {
      const toast = this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

  changePic() {
    const options: CameraOptions = {
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
