import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Configuration } from 'src/app/classes/Configuration';
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
    Configuration = Configuration;

    constructor(public route: ActivatedRoute) {}

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
