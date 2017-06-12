import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {CloudSettings, CloudModule} from '@ionic/cloud-angular';
import {CanvasDrawService} from '../services/canvas.service';
import {WritingAlphabetsPage} from '../pages/writing-alphabets/writing-alphabets';

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': 'c05da8b4'
    }
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        WritingAlphabetsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        CloudModule.forRoot(cloudSettings)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        WritingAlphabetsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        CanvasDrawService
    ]
})
export class AppModule {
}
