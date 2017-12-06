import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfluencerQuestionsPage } from './influencer-questions';

@NgModule({
  declarations: [
    InfluencerQuestionsPage,
  ],
  imports: [
    IonicPageModule.forChild(InfluencerQuestionsPage),
  ],
})
export class InfluencerQuestionsPageModule {}
