import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { CanvasDrawService } from '../services/canvas.utilities';
import { WritingAlphabetsPage } from '../pages/writing-alphabets/writing-alphabets';
import { MyNavbarComponent } from '../components/navbar/navbar.component';
import { CanvasComponentModule } from '../components/canvas-component/canvas.module';
import { NativeAudio } from '@ionic-native/native-audio';
import { Pro } from '@ionic/pro';
import { Injectable, Injector } from '@angular/core';
import { MyErrorHandler } from './app.error.service';
/* 
const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '7e72e6ba'
    }
};  */

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        WritingAlphabetsPage,
        MyNavbarComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        CanvasComponentModule
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
        IonicErrorHandler,
        { provide: ErrorHandler, useClass: MyErrorHandler },
        CanvasDrawService,
        NativeAudio
    ]
})
export class AppModule {
}
