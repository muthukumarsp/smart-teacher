// import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TAMIL_CHAR_MAPPINGS } from './tamil-char-canvas-mapping';
// constants in milliseconds
const MOUSE_TOUCH_EVENT_THROTTLE_TIME = 25;
const REDRAW_ACTION_INTERVAL = 25;

// @Injectable()
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
        console.log(TAMIL_CHAR_MAPPINGS)
    }

    public InitCanvas(canvasId: string): void {
        console.log("canvasID", canvasId);

        this.canvasInstance = document.getElementById(canvasId);
        this.canvasCtx = this.canvasInstance.getContext("2d");

        this.drawRulers();

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.lineJoin = this.canvasCtx.lineCap = 'round';

        this.canvasRect = this.canvasInstance.getBoundingClientRect();

        this.clearCanvas();

        this.InitMouseEvents();
        this.InitTouchEvents();
    }

    public drawRulers(): void {

        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.strokeStyle = "grey";

        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(0.5, 100.5);
        this.canvasCtx.lineTo(500.5, 100.5);
        this.canvasCtx.stroke();

        this.canvasCtx.moveTo(0.5, 200.5);
        this.canvasCtx.lineTo(500.5, 200.5);
        this.canvasCtx.stroke();

        this.drawBoxMiddle();
        this.drawBoxLeft();
        this.drawBoxRight();

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = "white";
    }

    public drawBoxLeft(): void {
        this.canvasCtx.moveTo(100.5, 100.5);
        this.canvasCtx.lineTo(100.5, 200.5);
        this.canvasCtx.stroke();

        this.canvasCtx.moveTo(200.5, 100.5);
        this.canvasCtx.lineTo(200.5, 200.5);
        this.canvasCtx.stroke();
    }

    public drawBoxMiddle(): void {
        this.canvasCtx.moveTo(300.5, 100.5);
        this.canvasCtx.lineTo(300.5, 200.5);
        this.canvasCtx.stroke();
    }

    public drawBoxRight(): void {
        this.canvasCtx.moveTo(400.5, 100.5);
        this.canvasCtx.lineTo(400.5, 200.5);
        this.canvasCtx.stroke();
    }

    private midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }

    private drawBeziereLine(actions) {
        let numberOfPoints = actions.length;

        if (numberOfPoints > 1) {
            // find midpoint for the last two points and draw them
            // console.log("Draw beziere curve: numofpoints", numberOfPoints)
            let p1 = actions[numberOfPoints - 2];
            let p2 = actions[numberOfPoints - 1];
            let midPoint = this.midPointBtw(p1, p2);
            // console.log("p1 = ", p1, "p2 =", p2, "midpoint=", midPoint);
            this.canvasCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            this.canvasCtx.stroke();
        }
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

            // console.log(this.serializedActionArr);
            this.mouseMove$
                .takeUntil(this.mouseUp$)
                .throttleTime(MOUSE_TOUCH_EVENT_THROTTLE_TIME)
                .map(e => this.getMousePos(this.canvasInstance, e))
                .subscribe((coordinate) => {
                    // console.log('mouse move', coordinate);
                    // this.canvasCtx.lineTo(coordinate.x, coordinate.y);
                    // this.canvasCtx.stroke();

                    // var midPoint = this.midPointBtw(coordinate);
                    // this.canvasCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                    actions.push(coordinate);
                    this.drawBeziereLine(actions);
                });
        });

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
            let startPoint = this.getTouchPos(this.canvasInstance, e);

            this.canvasCtx.moveTo(startPoint.x, startPoint.y);
            this.canvasCtx.beginPath();
            actions.push(startPoint);
            this.serializedActionArr.push(actions);

            // console.log(this.serializedActionArr);
            this.touchMove$
                .takeUntil(this.touchEnd$)
                .throttleTime(MOUSE_TOUCH_EVENT_THROTTLE_TIME)
                .map(e => this.getTouchPos(this.canvasInstance, e))
                .subscribe((coordinate) => {
                    // console.log('touch move', coordinate);
                    this.canvasCtx.lineTo(coordinate.x, coordinate.y);
                    this.canvasCtx.stroke();
                    actions.push(coordinate);
                });
        });

    }

    private getMousePos(canvas, evt): any {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    private getTouchPos(canvas, evt): any {
        var rect = canvas.getBoundingClientRect();

        return {
            x: (evt.changedTouches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.changedTouches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    public replayOld() {
        let flatActions = [];
        this.serializedActionArr.map(actionArray => {
            flatActions.push({ x: -1 });  // Markert for begin path..
            flatActions = flatActions.concat(actionArray);
        });
        this.drawActions(flatActions, REDRAW_ACTION_INTERVAL)
    }

    // public replayFromMappings() {
    public replay() {
        console.log(TAMIL_CHAR_MAPPINGS['அ']);
         let flatActions = [];
          TAMIL_CHAR_MAPPINGS['ஆ'].map(actionArray => {
            flatActions.push({ x: -1 });  // Markert for begin path..
            flatActions = flatActions.concat(actionArray);
        });
        this.drawActions(flatActions, REDRAW_ACTION_INTERVAL)
        // this.drawActions(TAMIL_CHAR_MAPPINGS['அ'], REDRAW_ACTION_INTERVAL)
    }
    public clearCanvas() {
        this.canvasCtx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
        // this.canvasCtx.strokeStyle = "white";
        this.canvasCtx.fillStyle = "#000000";
        this.canvasCtx.fillRect(10, 10, this.canvasRect.width, this.canvasRect.height);
        this.drawRulers();

    }

    public clearBuffer() {
        this.serializedActionArr = [];
        this.clearCanvas();
    }

    public dumpCanvasBuffer() {
        console.log(JSON.stringify(this.serializedActionArr));
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