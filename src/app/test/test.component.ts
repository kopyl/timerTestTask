import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit {

    title: string

    constructor() { }

    ngOnInit(): void {
    }

}
