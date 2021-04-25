import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-info-aside',
    templateUrl: './info-aside.component.html',
    styleUrls: ['./info-aside.component.sass'],
})
export class InfoAsideComponent implements OnInit, OnDestroy {
    subSink: SubSink = null;
    screenWidth: BehaviorSubject<number> = new BehaviorSubject(
        window.innerWidth
    );
    menuOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly MENU_BREAKPOINT = 800;

    constructor() {}

    ngOnInit(): void {
        this.subSink = new SubSink();
        this.subSink.add(
            fromEvent(window, 'resize').subscribe((e) => {
                this.screenWidth.next(window.innerWidth);
            })
        );
    }

    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }
}
