import { Component } from '@angular/core';
//pages
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { InquirePage } from '../inquire/inquire';
import { CharitiesPage } from '../charities/charities';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = InquirePage;
  tab3Root = ProfilePage;
  tab4Root = CharitiesPage;

  constructor() {

  }
}
