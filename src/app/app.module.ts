import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { CanvasDrawService } from '../services/canvas.utilities';
import { WritingAlphabetsPage } from '../pages/writing-alphabets/writing-alphabets';
import { MyNavbarComponent } from '../components/navbar/navbar.component';
import { CanvasComponentModule } from '../components/canvas-component/canvas.module';
import { NativeAudio } from '@ionic-native/native-audio';
import { Pro } from '@ionic/pro';
import { Injectable, Injector } from '@angular/core';

Pro.init('7e72e6ba', {
    appVersion: '0.1'
});
const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '7e72e6ba'
    }
}; 
@Injectable()
export class MyErrorHandler implements ErrorHandler {
    ionicErrorHandler: IonicErrorHandler;

    constructor(injector: Injector) {
        try {
            this.ionicErrorHandler = injector.get(IonicErrorHandler);
        } catch (e) {
            // Unable to get the IonicErrorHandler provider, ensure
            // IonicErrorHandler has been added to the providers list below
        }
    }

    handleError(err: any): void {
        Pro.monitoring.handleNewError(err);
        // Remove this if you want to disable Ionic's auto exception handling
        // in development mode.
        this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
    }
}

 

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
        CloudModule.forRoot(cloudSettings),
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
