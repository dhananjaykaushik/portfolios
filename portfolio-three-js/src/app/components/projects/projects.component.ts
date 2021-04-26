import { Component, OnInit } from '@angular/core';
import { IProjectData } from 'src/app/interfaces/IProjectData';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.sass'],
})
export class ProjectsComponent implements OnInit {
    projects: IProjectData[] = [];

    constructor() {
        // this.projects = new Array(50).fill(1).map((value, index) => {
        //     return {
        //         projectName: `Project ${index + 1}`,
        //     };
        // });
    }

    ngOnInit(): void {}
}
