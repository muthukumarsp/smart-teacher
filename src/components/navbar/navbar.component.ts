import { Component } from '@angular/core';
// import { Hero } from './hero';
@Component({
    selector: 'my-navbar-component',
    templateUrl: 'navbar.component.html'
})
export class MyNavbarComponent {
    //   @Input() hero: Hero;

    public alphabetList: string[];
    // public currentAlphabet:string;
    public currentIndex;
    public currentAlphabet: string;
    public alphabetToSerializeMapping: any;

    constructor() {
        this.alphabetList = ['&#x0b85;', '&#x0B86;', '&#x0B87;', '&#x0B88;', '	&#x0B89;', '&#x0B8A;', '&#x0B8E;', '&#x0B8F;', '&#x0B90;', '&#x0B92;', '&#x0B93;', '&#x0B94;'];
        this.currentIndex = 0;
        this.alphabetToSerializeMapping = [
            {
                uniCode: "0B85",
                serialized: "",
            },
            {
                uniCode: "0B86",
                serialized: "",
            },
            {
                uniCode: "0B87",
                serialized: "",
            },
            {
                uniCode: "0B88",
                serialized: "",
            },
            {
                uniCode: "0B89",
                serialized: "",
            },
            {
                uniCode: "0B8A",
                serialized: "",
            },
            {
                uniCode: "0B8E",
                serialized: "",
            }, 
            {
                uniCode: "0B8F",
                serialized: "",
            },
            {
                uniCode: "0B90",
                serialized: "",
            },
            {
                uniCode: "0B92",
                serialized: "",
            },
            {
                uniCode: "0B93",
                serialized: "",
            },
            {
                uniCode: "0B94",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            },
            {
                uniCode: "",
                serialized: "",
            }


        ]
    }

    public nextAlphabet(): void {
        if (this.currentIndex < this.alphabetList.length - 1) {
            this.currentIndex++;
        }
    }

    public previousAlphabet(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }
    public getSymbol(): any {
        return this.alphabetList[this.currentIndex];
    }
}