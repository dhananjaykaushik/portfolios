import { Component, OnInit } from '@angular/core';
import { Configuration } from 'src/app/classes/Configuration';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.sass'],
})
export class FooterComponent implements OnInit {
    Configuration = Configuration;

    constructor() {}

    ngOnInit(): void {}
}
