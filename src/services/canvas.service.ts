import {Injectable} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

// constants in milliseconds
const MOUSE_TOUCH_EVENT_THROTTLE_TIME = 25;
const REDRAW_ACTION_INTERVAL = 100;

@Injectable()
export class CanvasDrawService {
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

    constructor() {
        this.serializedActionArr = [];
    }

    public InitCanvas(canvasId: string): void {
        console.log("canvasID", canvasId);

        this.canvasInstance = document.getElementById(canvasId);
        this.canvasCtx = this.canvasInstance.getContext("2d");
        this.canvasRect = this.canvasInstance.getBoundingClientRect();

        this.clearCanvas();

        this.InitMouseEvents();
        this.InitTouchEvents();
    }

    public CleanupCanvas() {
        this.mouseDownSubscription.unsubscribe();
        this.touchStartSubscription.unsubscribe();
    }

    private InitMouseEvents() {
        // https://www.html5rocks.com/en/mobile/touchandmouse/

        this.mouseDown$ = Observable.fromEvent(this.canvasInstance, 'mousedown');
        this.mouseUp$ = Observable.fromEvent(this.canvasInstance, 'mouseup');
        this.mouseMove$ = Observable.fromEvent(this.canvasInstance, 'mousemove');

        this.mouseDownSubscription = this.mouseDown$.subscribe((e) => {
            let actions = [];
            let startPoint = this.getMousePos(this.canvasInstance, e);

            this.canvasCtx.moveTo(startPoint.x, startPoint.y);
            this.canvasCtx.beginPath();
            actions.push(startPoint);
            this.serializedActionArr.push(actions);

            console.log(this.serializedActionArr);
            this.mouseMove$
                .takeUntil(this.mouseUp$)
                .throttleTime(MOUSE_TOUCH_EVENT_THROTTLE_TIME)
                .map(e => this.getMousePos(this.canvasInstance, e))
                .subscribe((coordinate) => {
                    console.log('mouse move', coordinate);
                    this.canvasCtx.lineTo(coordinate.x, coordinate.y);
                    this.canvasCtx.stroke();
                    actions.push(coordinate);
                });
        });

    }

    private InitTouchEvents() {
        // https://www.html5rocks.com/en/mobile/touchandmouse/

        this.touchStart$ = Observable.fromEvent(this.canvasInstance, 'touchstart');
        this.touchEnd$ = Observable.fromEvent(this.canvasInstance, 'touchend');
        this.touchMove$ = Observable.fromEvent(this.canvasInstance, 'touchmove');

        this.touchStartSubscription = this.touchStart$.subscribe((e) => {
            console.log("touch start");
            e.stopPropagation();
            e.preventDefault();

            let actions = [];
            let startPoint = this.getTouchPos(this.canvasInstance, e);

            this.canvasCtx.moveTo(startPoint.x, startPoint.y);
            this.canvasCtx.beginPath();
            actions.push(startPoint);
            this.serializedActionArr.push(actions);

            console.log(this.serializedActionArr);
            this.touchMove$
                .takeUntil(this.touchEnd$)
                .throttleTime(MOUSE_TOUCH_EVENT_THROTTLE_TIME)
                .map(e => this.getTouchPos(this.canvasInstance, e))
                .subscribe((coordinate) => {
                    console.log('touch move', coordinate);
                    this.canvasCtx.lineTo(coordinate.x, coordinate.y);
                    this.canvasCtx.stroke();
                    actions.push(coordinate);
                });
        });

    }

    private   getMousePos(canvas, evt): any {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    private   getTouchPos(canvas, evt): any {
        var rect = canvas.getBoundingClientRect();

        return {
            x: (evt.changedTouches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.changedTouches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    public replay() {
        let flatActions = [];
        this.serializedActionArr.map(actionArray => {
            flatActions.push({x: -1});  // Markert for begin path..
            flatActions = flatActions.concat(actionArray);
        });
        this.drawActions(flatActions, REDRAW_ACTION_INTERVAL)
    }

    public clearCanvas() {
        this.canvasCtx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
        this.canvasCtx.strokeStyle = "white";
        this.canvasCtx.fillStyle = "#000000";
        this.canvasCtx.fillRect(10, 10, this.canvasRect.width, this.canvasRect.height);

    }

    public clearBuffer() {
        this.serializedActionArr = [];
        this.clearCanvas();
    }

    private drawActions(actionList, interval) {
        if (!actionList || actionList.length === 0)
            return;
        let start = 0;
        // https://stackoverflow.com/questions/2749244/javascript-setinterval-and-this-solution

        let timerId = setInterval((function (self) {

            return function () {
                if (start >= actionList.length - 1) {
                    self.canvasCtx.closePath()
                    clearInterval(timerId)
                }
                else {
                    if (actionList[start].x === -1) {
                        self.canvasCtx.beginPath();
                        start++;
                        self.canvasCtx.moveTo(actionList[start].x, actionList[start].y);
                    } else {
                        self.canvasCtx.lineTo(actionList[start].x, actionList[start].y);
                        self.canvasCtx.stroke();
                    }
                    start++;
                }
            }
        })(this), interval);
    }

}