import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CanvasDrawService } from '../../services/canvas.utilities';
import { Observable, Subscription } from 'rxjs';
import { AppSettings } from '../../app/app.settings';

@Component(
    {
        selector: 'canvas-component',
        templateUrl: 'canvas.component.html'
    })
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() canvasid: string;
    /*  @Input() canvaswidth: string;
     @Input() canvasheight: string; */
    @Input() canvasstyle: string;

    protected canvasWidth: string;
    protected canvasHeight: string;

    private canvasInstance: any;
    private canvasCtx: CanvasRenderingContext2D;
    private canvasRect: ClientRect;

    private mouseDown$: Observable<any>;
    private mouseUp$: Observable<any>;
    private mouseMove$: Observable<any>;

    private touchStart$: Observable<any>;
    private touchEnd$: Observable<any>;
    private touchMove$: Observable<any>;

    // Subscription reference -> Needed to unsubscribe.
    private mouseDownSubscription: Subscription;
    private touchStartSubscription: Subscription;
    private serializedActionArr: any[];

    constructor(private canvasDrawService: CanvasDrawService) {
        this.serializedActionArr = [];
    }
    ngOnInit() {
        this.canvasWidth = AppSettings.BOARD_SIZE.toString();
        this.canvasHeight = AppSettings.BOX_HEIGHT.toString();
    }
    ngAfterViewInit() {
        console.log('ionViewDidLoad WritingAlphabetsPage');
        this.InitCanvas(this.canvasid);
    }

    ngOnDestroy() {
        console.log("page will unload.. cleaning CANVAS")
        this.CleanupCanvas();
    }

    public replay(charIndex, canvasOffset) {
        return this.canvasDrawService.replay(this.canvasCtx, charIndex, canvasOffset);
    }

    public replayOld() {
        return this.canvasDrawService.replayOld(this.canvasCtx, this.serializedActionArr);
    }
    /*  public getCanvasDarawStatus(): Observable<any> {
         return this.canvasDrawService.getCanvasDarawStatus();
     } */

    public clearBuffer() {
        this.serializedActionArr = [];
        this.clearCanvas();
    }

    public dumpBuffer() {
        this.dumpCanvasBuffer();
    }
    public clearCanvas() {
        this.canvasCtx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
        // this.canvasCtx.strokeStyle = "white";
        this.canvasCtx.fillStyle = "#000000";
        this.canvasCtx.fillRect(10, 10, this.canvasRect.width, this.canvasRect.height);
        this.canvasDrawService.drawRulers(this.canvasCtx);
    }



    private InitCanvas(canvasId: string): void {
        console.log("canvasID", canvasId);

        this.canvasInstance = document.getElementById(canvasId);
        this.canvasCtx = this.canvasInstance.getContext("2d");

        this.canvasDrawService.drawRulers(this.canvasCtx);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.lineJoin = this.canvasCtx.lineCap = 'round';

        this.canvasRect = this.canvasInstance.getBoundingClientRect();

        this.clearCanvas();

        this.InitMouseEvents();
        this.InitTouchEvents();
    }
    private InitMouseEvents() {
        // https://www.html5rocks.com/en/mobile/touchandmouse/

        this.mouseDown$ = Observable.fromEvent(this.canvasInstance, 'mousedown');
        this.mouseUp$ = Observable.fromEvent(this.canvasInstance, 'mouseup');
        this.mouseMove$ = Observable.fromEvent(this.canvasInstance, 'mousemove');

        this.mouseDownSubscription = this.mouseDown$.subscribe((e) => {
            let actions = [];
            let startPoint = this.canvasDrawService.getMousePos(this.canvasInstance, e);

            this.canvasCtx.moveTo(startPoint.x, startPoint.y);
            this.canvasCtx.beginPath();
            actions.push(startPoint);
            this.serializedActionArr.push(actions);

            // console.log(this.serializedActionArr);
            this.mouseMove$
                .takeUntil(this.mouseUp$)
                .throttleTime(AppSettings.MOUSE_TOUCH_EVENT_THROTTLE_TIME)
                .map(e => this.canvasDrawService.getMousePos(this.canvasInstance, e))
                .subscribe((coordinate) => {
                    // console.log('mouse move', coordinate);
                    // this.canvasCtx.lineTo(coordinate.x, coordinate.y);
                    // this.canvasCtx.stroke();

                    // var midPoint = this.midPointBtw(coordinate);
                    // this.canvasCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                    actions.push(coordinate);
                    this.canvasDrawService.drawBeziereLine(this.canvasCtx, actions);
                });
        });

    }
    public dumpCanvasBuffer() {
        console.log(JSON.stringify(this.serializedActionArr));
    }

    private InitTouchEvents() {
        // https://www.html5rocks.com/en/mobile/touchandmouse/

        this.touchStart$ = Observable.fromEvent(this.canvasInstance, 'touchstart');
        this.touchEnd$ = Observable.fromEvent(this.canvasInstance, 'touchend');
        this.touchMove$ = Observable.fromEvent(this.canvasInstance, 'touchmove');

        this.touchStartSubscription = this.touchStart$.subscribe((e) => {
            // console.log("touch start");
            e.stopPropagation();
            e.preventDefault();

            let actions = [];
            let startPoint = this.canvasDrawService.getTouchPos(this.canvasInstance, e);

            this.canvasCtx.moveTo(startPoint.x, startPoint.y);
            this.canvasCtx.beginPath();
            actions.push(startPoint);
            this.serializedActionArr.push(actions);

            // console.log(this.serializedActionArr);
            this.touchMove$
                .takeUntil(this.touchEnd$)
                .throttleTime(AppSettings.MOUSE_TOUCH_EVENT_THROTTLE_TIME)
                .map(e => this.canvasDrawService.getTouchPos(this.canvasInstance, e))
                .subscribe((coordinate) => {
                    // console.log('touch move', coordinate);
                    this.canvasCtx.lineTo(coordinate.x, coordinate.y);
                    this.canvasCtx.stroke();
                    actions.push(coordinate);
                });
        });

    }
    public CleanupCanvas() {
        this.mouseDownSubscription.unsubscribe();
        this.touchStartSubscription.unsubscribe();
    }
}