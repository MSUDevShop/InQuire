import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//pages
import { InquirePage } from '../pages/inquire/inquire';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { NotificationsPage } from '../pages/notifications/notifications';
import { StoriesPage } from '../pages/stories/stories';

//Apollo config
import { provideClient } from './client';
import { ApolloModule } from 'angular2-apollo';

//Providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';


@NgModule({
  declarations: [
    MyApp,
    InquirePage,
    ProfilePage,
    HomePage,
    TabsPage,
    LoginPage,
    SignupPage,
    NotificationsPage,
    StoriesPage
  ],
  imports: [
    ApolloModule.withClient(provideClient),
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InquirePage,
    ProfilePage,
    HomePage,
    TabsPage,
    LoginPage,
    SignupPage,
    NotificationsPage,
    StoriesPage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
