import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CanvasDrawService } from '../../services/canvas.utilities';
import { MyNavbarComponent } from '../../components/navbar/navbar.component'
import { AppSettings } from '../../app/app.settings'
import { NativeAudio } from '@ionic-native/native-audio';
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
    private indexToFileNameMapping: any = [
        'அ.wav',
        'ஆ.wav',
        'இ.wav',
        'ஈ.mp3',
        'உ.mp3',
        'ஊ.mp3',
        'எ.mp3',
        'ஏ.mp3',
        'ஐ.mp3',
        'ஒ.mp3',
        'ஓ.mp3',
        'ஔ.mp3',
        'ஃ.mp3',
        'க்.mp3',
        'ங்.mp3',
        'ச்.mp3',
        'ஞ்.mp3',
        'ட்.mp3',
        'ந்.mp3',
        'த்.mp3',
        'ண்.mp3',
        'ப்.mp3',
        'ம்.mp3',
        'ய்.mp3',
        'ர்.mp3',
        'ல்.mp3',
        'ள்.mp3',
        'வ்.mp3',
        'ழ்.mp3',
        'ற்.mp3',
        'ன்.mp3'
    ];
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private canvasDrawService: CanvasDrawService,
        private nativeAudio: NativeAudio) {
        this.loadAudioFiles();
    }
    public onCharChanged($event): void {
        console.log('writing alphabets: char changed', $event);
        this.currentChar = $event.currentChar;
        this.charIndex = $event.charIndex;
        this.canvasOffset = this.charIndex % AppSettings.NUMBER_OF_BOXES * AppSettings.BOX_WIDTH;
    }
    ionViewWillUnload(): void {
        console.log(' ionViewWillUnload()');
    };

    protected playAudio(charIndex): void {
        console.log("play Audio currentChar", charIndex);
        let audioFileName = this.indexToFileNameMapping[charIndex];
        console.log('playing filename', 'assets/audio/' + audioFileName);
        this.nativeAudio.play(audioFileName + 'id').then(
            () => console.log("audio play sucess"),
            () => console.log("audio play failed"));
        // this.nativeAudio.unload('uniqueId1').then(onSuccess, onError); */
    }
    private loadAudioFiles(): void {
        for (let i = 0; i < this.indexToFileNameMapping.length; i++) {
            let audioFileName = this.indexToFileNameMapping[i];
            this.nativeAudio.preloadSimple(audioFileName + 'id', 'assets/audio/' + audioFileName).then(
                () => console.log("audio லொடு sucess", audioFileName + 'id'),
                () => console.log("audio லோடு failed"));
        }
    }


}
