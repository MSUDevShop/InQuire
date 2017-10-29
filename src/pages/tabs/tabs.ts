import { Component } from '@angular/core';
//pages
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { InquirePage } from '../inquire/inquire';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab3Root = InquirePage;
  tab5Root = ProfilePage;

  constructor() {

  }
}
