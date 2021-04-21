import { Vector3 } from 'three';

export interface IGuiControls {
    totalElements: number;
    wireframe: boolean;
    cameraPosition: Vector3;
    textElementOffset: {
        x: number;
        y: number;
        z: number;
    };
    textParameters: {
        text: string;
        size: number;
        height: number;
        curveSegments: number;
        bevelEnabled: boolean;
        bevelThickness: number;
        bevelSize: number;
        bevelOffset: number;
        bevelSegments: number;
    };
    background: string;
}
