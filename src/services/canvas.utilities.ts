// import { Injectable } from '@angular/core';
import { TAMIL_CHAR_MAPPINGS } from './tamil-char-canvas-mapping';
import { AppSettings } from '../app/app.settings';

// @Injectable()
export class CanvasDrawService {

    constructor() {
    }

    public drawRulers(canvasCtx): void {
        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = "grey";

        canvasCtx.beginPath();
        canvasCtx.moveTo(0.5, 100.5);
        canvasCtx.lineTo(500.5, 100.5);
        canvasCtx.stroke();

        canvasCtx.moveTo(0.5, 200.5);
        canvasCtx.lineTo(500.5, 200.5);
        canvasCtx.stroke();

        this.drawBoxMiddle(canvasCtx);
        this.drawBoxLeft(canvasCtx);
        this.drawBoxRight(canvasCtx);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "white";
    }

    public drawBoxLeft(canvasCtx): void {
        canvasCtx.moveTo(100.5, 0);
        canvasCtx.lineTo(100.5, 100);
        canvasCtx.stroke();

        canvasCtx.moveTo(200.5, 0);
        canvasCtx.lineTo(200.5, 100);
        canvasCtx.stroke();
    }

    public drawBoxMiddle(canvasCtx): void {
        canvasCtx.moveTo(300.5, 0);
        canvasCtx.lineTo(300.5, 100);
        canvasCtx.stroke();
    }

    public drawBoxRight(canvasCtx): void {
        canvasCtx.moveTo(400.5, 0);
        canvasCtx.lineTo(400.5, 100);
        canvasCtx.stroke();
    }

    private midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }

    public drawBeziereLine(canvasCtx, actions) {
        let numberOfPoints = actions.length;

        if (numberOfPoints > 1) {
            // find midpoint for the last two points and draw them
            // console.log("Draw beziere curve: numofpoints", numberOfPoints)
            let p1 = actions[numberOfPoints - 2];
            let p2 = actions[numberOfPoints - 1];
            let midPoint = this.midPointBtw(p1, p2);
            canvasCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            canvasCtx.stroke();
        }
    }

    public getMousePos(canvas, evt): any {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    public getTouchPos(canvas, evt): any {
        var rect = canvas.getBoundingClientRect();

        return {
            x: (evt.changedTouches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.changedTouches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    /* public replayOld() {
         let flatActions = [];
         this.serializedActionArr.map(actionArray => {
             flatActions.push({ x: -1 });  // Markert for begin path..
             flatActions = flatActions.concat(actionArray);
         });
         this.drawActions(flatActions, REDRAW_ACTION_INTERVAL)
     }*/

    public replay(canvasCtx, currentChar, canvasOffset) {
        let flatActions = [];
        // let charIndex = this.unicodeToIndex(char);
        console.log(TAMIL_CHAR_MAPPINGS[currentChar], canvasOffset);
        this.clearCanvasRect(canvasCtx, canvasOffset);
        TAMIL_CHAR_MAPPINGS[currentChar].map(actionArray => {
            flatActions.push({ x: -1 });  // Markert for begin path..
            flatActions = flatActions.concat(actionArray);
        });
        this.drawActions(canvasCtx, flatActions, AppSettings.REDRAW_ACTION_INTERVAL, canvasOffset);
        // this.drawActions(TAMIL_CHAR_MAPPINGS['அ'], REDRAW_ACTION_INTERVAL)
    }

    private clearCanvasRect(canvasCtx, canvasOffset): void {
        canvasCtx.clearRect(canvasOffset + 1,
            0,
            AppSettings.BOX_WIDTH - 1,
            AppSettings.BOX_HEIGHT);
    }
    private drawActions(canvasCtx, actionList, interval, canvasOffset) {
        if (!actionList || actionList.length === 0)
            return;
        let start = 0;
        // https://stackoverflow.com/questions/2749244/javascript-setinterval-and-this-solution

        let timerId = setInterval((function (canvasCtx, canvasOffset) {

            return function () {
                if (start >= actionList.length - 1) {
                    canvasCtx.closePath()
                    clearInterval(timerId)
                }
                else {
                    if (actionList[start].x === -1) {
                        canvasCtx.beginPath();
                        start++;
                        canvasCtx.moveTo(actionList[start].x + canvasOffset, actionList[start].y);
                    } else {
                        canvasCtx.lineTo(actionList[start].x + canvasOffset, actionList[start].y);
                        canvasCtx.stroke();
                    }
                    start++;
                }
            }
        })(canvasCtx, canvasOffset), interval);
    }

}
