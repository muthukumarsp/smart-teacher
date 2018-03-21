import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppSettings } from '../../app/app.settings'
import { TAMIL_CHAR_MAPPINGS } from '../../services/tamil-char-canvas-mapping'
import { NativeAudio } from 'ionic-native';
import { CanvasComponent } from '../../components/canvas-component/canvas.component';
import {  CanvasDrawService } from '../../services/canvas.utilities';
import { Observable } from 'rxjs/Observable';

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
export class WritingAlphabetsPage implements AfterViewInit {
    @ViewChild("blackBoardInst") blackBoardInst: CanvasComponent;
    public currentChar: string;
    public currentIndex: number = 0; // char index in navbar array
    public canvasOffset: number; // char index in navbar array
    public alphabetList: any;
    public isDrawingCompleted$: Observable<any>;
    private indexToFileNameMapping: string[] = [
        'அ.wav',
        'ஆ.wav',
        'இ.wav',
        'ஈ.mp3',
        'உ.mp3',
        'ஊ.mp3',
        'எ.wav',
        'ஏ.mp3',
        'ஐ.wav',
        'ஒ.mp3',
        'ஓ.wav',
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
        public canvasDrawService: CanvasDrawService) {
        this.currentIndex = 0;
        // this.isDrawingCompleted = true;
        this.alphabetList = Object.keys(TAMIL_CHAR_MAPPINGS);
        this.updateCurrentState();
        this.loadAudioFiles();
        this.isDrawingCompleted$ = this.canvasDrawService.getCanvasDarawStatus();
    }
    ngAfterViewInit() {
        this.playCurrentState();
    }

    public nextAlphabet() {
        if (this.currentIndex < this.alphabetList.length - 1) {
            this.currentIndex++;
            this.updateCurrentState();
            this.playCurrentState();
        }
    }
    public previousAlphabet() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCurrentState();
            this.playCurrentState();
        }
    }

    public playCurrentState() {
        this.blackBoardInst.replay(this.currentChar, this.canvasOffset);
        this.playAudio();
    }
    protected playAudio(): void {
        console.log("play Audio currentChar", this.currentIndex);
        let audioFileName = this.indexToFileNameMapping[this.currentIndex];
        console.log('playing filename', 'assets/audio/' + audioFileName);
        NativeAudio.play(audioFileName + 'id').then(
            () => console.log("audio play sucess"),
            () => console.log("audio play failed"));
        /*  NativeAudio.unload(audioFileName + 'id').then(() => { console.log('unload success'); },
             () => { console.log(' onError'); }); */
    }
    private loadAudioFiles(): void {
        for (let i = 0; i < this.indexToFileNameMapping.length; i++) {
            let audioFileName = this.indexToFileNameMapping[i];
            NativeAudio.preloadSimple(audioFileName + 'id', 'assets/audio/' + audioFileName).then(
                () => console.log("audio லொடு sucess", audioFileName + 'id'),
                () => console.log("audio லோடு failed"));
        }
    }

    private updateCurrentState() {
        this.currentChar = this.alphabetList[this.currentIndex]
        this.canvasOffset = this.currentIndex % AppSettings.NUMBER_OF_BOXES * AppSettings.BOX_WIDTH;
    }


}
