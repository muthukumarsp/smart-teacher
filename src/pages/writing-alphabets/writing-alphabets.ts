import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CanvasDrawService } from '../../services/canvas.utilities';
import { MyNavbarComponent } from '../../components/navbar/navbar.component'
import { AppSettings } from '../../app/app.settings'

/**
 * Generated class for the WritingAlphabetsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-writing-alphabets',
    templateUrl: 'writing-alphabets.html'
})
export class WritingAlphabetsPage {

    public currentChar: string;
    public charIndex: number; // char index in navbar array
    public canvasOffset: number; // char index in navbar array
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private canvasDrawService: CanvasDrawService) {
    }
    public onCharChanged($event): void {
        console.log('writing alphabets: char changed', $event);
        this.currentChar = $event.currentChar;
        this.charIndex = $event.charIndex;
        this.canvasOffset = this.charIndex % AppSettings.NUMBER_OF_BOXES * AppSettings.BOX_WIDTH;
    }
}
