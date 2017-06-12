import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WritingAlphabetsPage } from './writing-alphabets';

@NgModule({
  declarations: [
    WritingAlphabetsPage,
  ],
  imports: [
    IonicPageModule.forChild(WritingAlphabetsPage),
  ],
  exports: [
    WritingAlphabetsPage
  ]
})
export class WritingAlphabetsPageModule {}
