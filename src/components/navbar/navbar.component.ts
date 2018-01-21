import { Component, Output, EventEmitter, OnInit } from '@angular/core';
// import { Hero } from './hero';
import { TAMIL_CHAR_MAPPINGS } from '../../services/tamil-char-canvas-mapping'

interface NAVBAR_STATUS {
    currentChar: string;
    charIndex: number;
}
@Component({
    selector: 'my-navbar-component',
    templateUrl: 'navbar.component.html'
})
export class MyNavbarComponent implements OnInit {
    @Output() onCharChanged = new EventEmitter<NAVBAR_STATUS>();

    public alphabetList: any;
    // public currentAlphabet:string;
    public currentIndex;
    public currentAlphabet: string;
    public alphabetToSerializeMapping: any;

    constructor() {
        this.alphabetList = Object.keys(TAMIL_CHAR_MAPPINGS);
        // this.alphabetList = TAMIL_CHAR_MAPPINGS;
        this.currentIndex = 0;
    }
    ngOnInit() {
        this.onCharChanged.emit({
            currentChar: this.alphabetList[this.currentIndex],
            charIndex: this.currentIndex
        });
    }
    public nextAlphabet(): void {
        if (this.currentIndex < this.alphabetList.length - 1) {
            this.currentIndex++;
            this.onCharChanged.emit({
                currentChar: this.alphabetList[this.currentIndex],
                charIndex: this.currentIndex
            });
        }
    }
    public previousAlphabet(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.onCharChanged.emit({
                currentChar: this.alphabetList[this.currentIndex],
                charIndex: this.currentIndex
            });
        }
    }
    public getSymbol(): any {
        return this.alphabetList[this.currentIndex];
    }
}