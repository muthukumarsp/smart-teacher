import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CanvasDrawService} from '../../services/canvas.service';

/**
 * Generated class for the WritingAlphabetsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-writing-alphabets',
    templateUrl: 'writing-alphabets.html',
})
export class WritingAlphabetsPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private canvasDrawService: CanvasDrawService) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WritingAlphabetsPage');
        this.canvasDrawService.InitCanvas("blackboard")
    }

    ionViewWillUnload() {
        console.log("page will unload.. cleaning CANVAS")
        this.canvasDrawService.CleanupCanvas();
    }

    public replay() {
        this.canvasDrawService.replay();
    }

    public clearCanvas() {
        this.canvasDrawService.clearCanvas();
    }

    public clearBuffer() {
        this.canvasDrawService.clearBuffer();
    }

}

