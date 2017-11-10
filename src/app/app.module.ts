import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//pages
import { InquirePage } from '../pages/inquire/inquire';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { QuestionPage } from '../pages/question/question';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SettingsPage } from '../pages/settings/settings';
import { AnswerPage } from '../pages/answer/answer';
import { InfluencerProfilePage } from '../pages/influencer-profile/influencer-profile';

//Apollo config
import { provideClient } from './client';
import { ApolloModule } from 'angular2-apollo';

//Modules
import { Autosize } from '../components/autosize';

//Providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

import { Camera } from '@ionic-native/camera';
import { UserProvider } from '../providers/user/user';
import { FormBuilder } from '@angular/forms';
import { FlashCardComponent } from '../components/flash-card/flash-card';

@NgModule({
  declarations: [
    MyApp,
    Autosize,
    InquirePage,
    ProfilePage,
    HomePage,
    QuestionPage,
    TabsPage,
    LoginPage,
    SignupPage,
    SettingsPage,
    AnswerPage,
    FlashCardComponent,
    InfluencerProfilePage
  ],
  imports: [
    ApolloModule.withClient(provideClient),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InquirePage,
    ProfilePage,
    HomePage,
    QuestionPage,
    TabsPage,
    LoginPage,
    SignupPage,
    SettingsPage,
    AnswerPage,
    InfluencerProfilePage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    FormBuilder,
  ]
})
export class AppModule {}
