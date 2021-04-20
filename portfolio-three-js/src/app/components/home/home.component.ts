import { Component, OnInit } from '@angular/core';
import { Configuration } from 'src/app/classes/Configuration';
import {
    BoxGeometry,
    Mesh,
    MeshNormalMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        /**
         * Camera
         */
        const camera = new PerspectiveCamera(
            Configuration.FOV,
            this.aspect,
            Configuration.NEAR,
            Configuration.FAR
        );

        /**
         * Scene
         */
        const scene = new Scene();
        scene.add(camera);

        const textureLoader = new TextureLoader();
        const boxImage = textureLoader.load('../../../assets/box.png');

        /**
         * Box Geometry
         */
        for (let i = 0; i < 1000; ++i) {
            const geometry = new BoxGeometry(0.1, 0.1, 0.1);
            const material = new MeshNormalMaterial();
            const cube = new Mesh(geometry, material);

            const posX = (Math.random() - 0.5) * 10;
            const posY = (Math.random() - 0.5) * 10;
            const posZ = (Math.random() - 0.5) * 10;

            cube.position.set(posX, posY, posZ);

            scene.add(cube);
        }

        camera.position.z = 4;
        /**
         * Renderer
         */
        const renderer = new WebGLRenderer({
            canvas: document.querySelector('.webgl') as HTMLCanvasElement,
            antialias: true,
        });
        renderer.setSize(this.width, this.height);

        /**
         * Events Handling
         */
        const eventHandling = () => {
            window.addEventListener('resize', () => {
                renderer.setSize(this.width, this.height);
                camera.aspect = this.aspect;
                camera.updateProjectionMatrix();
            });
        };
        eventHandling();

        /**
         * Orbit Control
         */
        const orbitControl = new OrbitControls(camera, renderer.domElement);

        /**
         * Game Loop
         */
        const tick = () => {
            window.requestAnimationFrame(tick);
            orbitControl.update();
            renderer.render(scene, camera);
        };
        tick();
    }

    get width(): number {
        return window.innerWidth;
    }

    get height(): number {
        return window.innerHeight;
    }

    get aspect(): number {
        return this.width / this.height;
    }
}
