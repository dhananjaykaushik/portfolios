import { Component, OnInit } from '@angular/core';
import { GUI } from 'dat.gui';
import { Configuration } from 'src/app/classes/Configuration';
import { IGuiControls } from 'src/app/interfaces/IGuiControls';
import {
    BoxGeometry,
    Mesh,
    MeshNormalMaterial,
    PerspectiveCamera,
    Scene,
    TorusBufferGeometry,
    Vector3,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
    scene: Scene;
    camera: PerspectiveCamera = null;
    renderer: WebGLRenderer = null;
    orbitControls: OrbitControls = null;
    datGui: GUI = null;
    material: MeshNormalMaterial = null;

    guiControls: IGuiControls = {
        totalElements: 1000,
        wireframe: false,
        cameraPosition: new Vector3(0, 0, 4),
    };
    sceneMeshIds: number[] = [];

    constructor() {}

    ngOnInit(): void {
        // Creating Debugger
        this.createDebugger();

        // Creating basic layout
        this.createBasicLayout();

        // Creating elements
        this.createElements();

        // Events Handling
        this.eventHandling();

        // Handling controls
        this.setControls();

        /**
         * Game Loop
         */
        this.startGameLoop();
    }

    /**
     * Functions
     */

    createBasicLayout() {
        // Adding Camera
        this.camera = new PerspectiveCamera(
            Configuration.FOV,
            this.aspect,
            Configuration.NEAR,
            Configuration.FAR
        );
        this.updateCameraPosition();

        // Adding Scene
        this.scene = new Scene();
        this.scene.add(this.camera);

        // Adding Renderer
        this.renderer = new WebGLRenderer({
            canvas: document.querySelector('.webgl') as HTMLCanvasElement,
            antialias: true,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    updateCameraPosition() {
        this.camera.position.set(
            this.guiControls.cameraPosition.x,
            this.guiControls.cameraPosition.y,
            this.guiControls.cameraPosition.z
        );

        // Camera position debugger
        const cameraFolder = this.datGui.addFolder('Camera Position');
        cameraFolder
            .add(this.camera.position, 'x')
            .min(-80)
            .max(80)
            .step(1)
            .name('X');
        cameraFolder
            .add(this.camera.position, 'y')
            .min(-80)
            .max(80)
            .step(1)
            .name('Y');
        cameraFolder
            .add(this.camera.position, 'z')
            .min(-80)
            .max(80)
            .step(1)
            .name('Z');
        cameraFolder.close();
    }

    eventHandling() {
        // TODO: Try fromEvent
        window.addEventListener('resize', () => {
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.aspect;
            this.camera.updateProjectionMatrix();
        });
    }

    createElements() {
        if (this.sceneMeshIds && this.sceneMeshIds.length) {
            this.removeSceneMeshes();
        }
        const boxGeometry = new BoxGeometry(0.4, 0.4, 0.4);
        const donutGeometry = new TorusBufferGeometry(0.3, 0.2, 20, 45);
        this.material = new MeshNormalMaterial();
        this.material.wireframe = this.guiControls.wireframe;

        for (let i = 0; i < this.guiControls.totalElements; ++i) {
            const mesh = new Mesh(
                Math.random() > 0.5 ? boxGeometry : donutGeometry,
                this.material
            );
            let posX = (Math.random() - 0.5) * 30;
            let posY = (Math.random() - 0.5) * 30;
            let posZ = (Math.random() - 0.5) * 30;
            this.sceneMeshIds.push(mesh.id);
            mesh.position.set(posX, posY, posZ);
            this.scene.add(mesh);
        }
    }

    removeSceneMeshes() {
        this.sceneMeshIds.forEach((meshId) => {
            const element = this.scene.getObjectById(meshId);
            if (element) {
                this.scene.remove(element);
            }
        });
    }

    setControls() {
        /**
         * Orbit Control
         */
        this.orbitControls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
    }

    startGameLoop() {
        const tick = () => {
            window.requestAnimationFrame(tick);
            this.orbitControls.update();
            this.renderer.render(this.scene, this.camera);
        };
        tick();
    }

    createDebugger() {
        this.datGui = new GUI({
            name: 'Configuration',
        });
        this.datGui
            .add(this.guiControls, 'totalElements')
            .name('Total Elements')
            .min(1)
            .max(1000)
            .onFinishChange(() => {
                this.createElements();
            });

        this.datGui
            .add(this.guiControls, 'wireframe')
            .onFinishChange((value) => {
                if (this.material) {
                    this.material.wireframe = value;
                }
            })
            .name('Wireframe');
    }

    /**
     * Getters and Setters
     */
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
