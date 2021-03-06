import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { CharitiesPage } from '../pages/charities/charities';
import { InfluencerQuestionsPage } from '../pages/influencer-questions/influencer-questions';
import { DonatePage } from '../pages/donate/donate';

//Apollo config
import { provideClient } from './client';
import { ApolloModule } from 'angular2-apollo';

//Modules
import { Autosize } from '../components/autosize';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

//Providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
// import { Braintree } from '@ionic-native/braintree';
// import { HTTP } from '@ionic-native/http';
import { Stripe } from '@ionic-native/stripe';
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
    TabsPage,
    LoginPage,
    SignupPage,
    QuestionPage,
    SettingsPage,
    AnswerPage,
    FlashCardComponent,
    InfluencerProfilePage,
    CharitiesPage,
    InfluencerQuestionsPage,
    // DonatePage
  ],
  imports: [
    ApolloModule.withClient(provideClient),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    RoundProgressModule
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
    InfluencerProfilePage,
    CharitiesPage,
    InfluencerQuestionsPage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    FormBuilder,
    Stripe
    // HTTP
    // Braintree
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
