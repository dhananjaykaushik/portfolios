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
    textParameters: TextParams;
    linksTextParameters: TextParams;
    background: string;
    lineColor: string;
    dotColor: string;
}

interface TextParams {
    text: string;
    size: number;
    height: number;
    curveSegments: number;
    bevelEnabled: boolean;
    bevelThickness: number;
    bevelSize: number;
    bevelOffset: number;
    bevelSegments: number;
}
