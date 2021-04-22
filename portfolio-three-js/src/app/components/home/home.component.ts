import { Component, OnInit } from '@angular/core';
import { GUI } from 'dat.gui';
import { gsap } from 'gsap';
import { fromEvent } from 'rxjs';
import { Configuration } from 'src/app/classes/Configuration';
import { Helper } from 'src/app/classes/Helper';
import { IGuiControls } from 'src/app/interfaces/IGuiControls';
import { SubSink } from 'subsink';
import {
    BoxGeometry,
    BufferGeometry,
    Clock,
    ConeBufferGeometry,
    Font,
    FontLoader,
    IcosahedronBufferGeometry,
    Mesh,
    MeshNormalMaterial,
    PerspectiveCamera,
    Scene,
    TetrahedronBufferGeometry,
    TextBufferGeometry,
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
    font: Font;
    textMesh: Mesh = null;
    clock: Clock = null;
    subSink: SubSink = new SubSink();
    initialCameraMovementDone = false;

    guiControls: IGuiControls = {
        totalElements: 300,
        textElementOffset: {
            x: 1,
            y: 1,
            z: 2.5,
        },
        wireframe: false,
        cameraPosition: new Vector3(-150, -4, 15),
        textParameters: {
            text: Configuration.INITIAL_TEXT,
            size: 0.6,
            height: 0.5,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.02,
            bevelOffset: 0.02,
            bevelSegments: 10,
        },
        background: '#61d9ff',
        lineColor: '#ffffff',
        dotColor: '#00abe2',
    };
    sceneMeshIds: number[] = [];

    cursorOffset = {
        x: 0,
        y: 0,
    };

    constructor() {}

    ngOnInit(): void {
        // Creating clock
        this.initiateClock();

        // Creating Debugger
        this.createDebugger();

        // Creating basic layout
        this.createBasicLayout();

        // Creating Text
        this.createText();

        // Creating elements
        this.createElements();

        // Events Handling
        this.eventHandling();

        // Handling controls
        this.setControls();

        // Debugger Visibility
        this.handleDebuggerVisibility();

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
            alpha: true,
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
        document.body.style.touchAction = 'none';
        this.subSink.add(
            fromEvent(window, 'resize').subscribe((event) => {
                this.renderer.setSize(this.width, this.height);
                this.camera.aspect = this.aspect;
                this.camera.updateProjectionMatrix();
            })
        );
        this.subSink.add(
            fromEvent(window, 'pointermove').subscribe((e) => {
                if (this.initialCameraMovementDone) {
                    const event = e as PointerEvent;
                    if (!event.isPrimary) {
                        return;
                    }

                    this.cursorOffset.x =
                        (event.clientX - this.width / 2) * 0.002;
                    this.cursorOffset.y =
                        (event.clientY - this.height / 2) * 0.002;
                }
            })
        );
    }

    createElements() {
        if (this.sceneMeshIds && this.sceneMeshIds.length) {
            this.removeSceneMeshes();
        }
        const boxGeometry = new BoxGeometry(0.4, 0.4, 0.4);
        const donutGeometry = new TorusBufferGeometry(0.3, 0.2, 20, 45);
        const coneGeometry = new ConeBufferGeometry(0.2, 0.6, 5, 4);
        const icosahedronGeometry = new IcosahedronBufferGeometry(0.5);
        const tetrahedronGeometry = new TetrahedronBufferGeometry(0.8);
        this.material = new MeshNormalMaterial();
        this.material.wireframe = this.guiControls.wireframe;
        const geometries = [
            coneGeometry,
            boxGeometry,
            donutGeometry,
            icosahedronGeometry,
            tetrahedronGeometry,
        ];
        const rotations = [
            0,
            Math.PI * 0.25,
            Math.PI * 0.5,
            Math.PI * 0.75,
            Math.PI,
        ];
        for (let i = 0; i < this.guiControls.totalElements; ++i) {
            const geometry: BufferGeometry = Helper.getRandomFromArray(
                geometries
            );

            geometry.rotateX(Helper.getRandomFromArray(rotations));
            geometry.rotateY(Helper.getRandomFromArray(rotations));
            geometry.rotateZ(Helper.getRandomFromArray(rotations));
            const mesh = new Mesh(geometry, this.material);
            const coordinates = this.getCoordinates();
            this.sceneMeshIds.push(mesh.id);
            mesh.position.set(coordinates.x, coordinates.y, coordinates.z);
            this.scene.add(mesh);
        }
    }

    getCoordinates(): { x: number; y: number; z: number } {
        const coords = {
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 40,
            z: (Math.random() - 0.5) * 30,
        };

        if (Math.abs(coords.x) < this.guiControls.textElementOffset.x) {
            if (coords.x < 0) {
                coords.x = coords.x - this.guiControls.textElementOffset.x;
            } else {
                coords.x = coords.x + this.guiControls.textElementOffset.x;
            }
        }
        if (Math.abs(coords.y) < this.guiControls.textElementOffset.y) {
            if (coords.y < 0) {
                coords.y = coords.y - this.guiControls.textElementOffset.y;
            } else {
                coords.y = coords.y + this.guiControls.textElementOffset.y;
            }
        }
        if (Math.abs(coords.z) < this.guiControls.textElementOffset.z) {
            if (coords.z < 0) {
                coords.z = coords.z - this.guiControls.textElementOffset.z;
            } else {
                coords.z = coords.z + this.guiControls.textElementOffset.z;
            }
        }

        return coords;
    }

    removeSceneMeshes() {
        this.sceneMeshIds.forEach((meshId) => {
            const element = this.scene.getObjectById(meshId);
            if (element) {
                this.scene.remove(element);
            }
        });
    }

    createText() {
        this.loadFont(this.generateText.bind(this));
    }

    loadFont(callBack: Function) {
        const fontLoader = new FontLoader();
        fontLoader.load(
            '../../../assets/fonts/Quicksand_Bold.json',
            (responseFont: Font) => {
                this.font = responseFont;
                callBack();
            },
            null,
            () => {
                console.error('Error loading font');
            }
        );
    }

    generateText() {
        if (this.textMesh) {
            this.textMesh.geometry.dispose();
        }

        const textGeometry = new TextBufferGeometry(
            this.guiControls.textParameters.text,
            {
                font: this.font,
                size: this.guiControls.textParameters.size,
                height: this.guiControls.textParameters.height,
                bevelEnabled: this.guiControls.textParameters.bevelEnabled,
                bevelOffset: this.guiControls.textParameters.bevelOffset,
                bevelSegments: this.guiControls.textParameters.bevelSegments,
                bevelSize: this.guiControls.textParameters.bevelSize,
                bevelThickness: this.guiControls.textParameters.bevelThickness,
                curveSegments: this.guiControls.textParameters.curveSegments,
            }
        );
        textGeometry.center();
        if (this.textMesh) {
            this.textMesh.geometry = textGeometry;
        } else {
            this.textMesh = new Mesh(textGeometry, this.material);
            this.scene.add(this.textMesh);
            this.cameraPositionInitialize();
        }
    }

    setControls() {
        /**
         * Orbit Control
         */
        // this.orbitControls = new OrbitControls(
        //     this.camera,
        //     this.renderer.domElement
        // );
        // this.orbitControls.autoRotate = true;
        // this.orbitControls.enableZoom = false;
        // this.orbitControls.maxAzimuthAngle = Math.PI * 0.25;
        // this.orbitControls.minAzimuthAngle = -(Math.PI * 0.25);
        // this.orbitControls.maxDistance = 20;
        // this.orbitControls.enableDamping = true;
    }

    startGameLoop() {
        const tick = () => {
            window.requestAnimationFrame(tick);
            // this.orbitControls.update();
            this.animateText();
            if (this.initialCameraMovementDone) {
                this.animateCamera();
            }
            if (this.scene) {
                this.camera.lookAt(this.scene.position);
            }
            this.renderer.render(this.scene, this.camera);
        };
        tick();
    }

    initiateClock() {
        this.clock = new Clock();
    }

    animateText() {
        const elapsedTime = this.clock.getElapsedTime();
        if (this.textMesh) {
            this.textMesh.rotation.x = Math.sin(elapsedTime) * Math.PI * 0.12;
            this.textMesh.rotation.y = Math.sin(elapsedTime) * Math.PI * 0.12;
        }
    }

    animateCamera() {
        gsap.to(this.camera.position, {
            x: this.cursorOffset.x * 12,
            y: -this.cursorOffset.y * 12,
            duration: 5,
            ease: 'power4',
        });
        const elapsedTime = this.clock.getElapsedTime();
        this.cursorOffset.x += Math.cos(elapsedTime) * 0.002;
        this.cursorOffset.y += Math.cos(elapsedTime) * 0.002;
        this.cursorOffset.y += Math.sin(elapsedTime) * 0.001;
    }

    createDebugger() {
        this.datGui = new GUI({
            name: 'Configuration',
            hideable: true,
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

        // Text Controls
        const textFolder = this.datGui.addFolder('Text');

        // Text Margins
        const textMarginFolder = textFolder.addFolder('Text Margin');
        textMarginFolder
            .add(this.guiControls.textElementOffset, 'x')
            .name('X')
            .min(1)
            .max(3)
            .step(0.1)
            .onFinishChange(() => {
                this.createElements();
            });

        textMarginFolder
            .add(this.guiControls.textElementOffset, 'y')
            .name('Y')
            .min(1)
            .max(3)
            .step(0.1)
            .onFinishChange(() => {
                this.createElements();
            });

        textMarginFolder
            .add(this.guiControls.textElementOffset, 'z')
            .name('Z')
            .min(1)
            .max(3)
            .step(0.1)
            .onFinishChange(() => {
                this.createElements();
            });
        textMarginFolder.close();

        textFolder
            .add(this.guiControls.textParameters, 'size')
            .min(0.1)
            .max(3)
            .step(0.1)
            .name('Size')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'height')
            .min(0.1)
            .max(3)
            .step(0.1)
            .name('Height')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'curveSegments')
            .min(1)
            .max(20)
            .step(1)
            .name('Curve Segments')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'bevelEnabled')
            .name('Bevel Ensable')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'bevelThickness')
            .min(0)
            .max(0.5)
            .step(0.01)
            .name('Bevel Thickness')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'bevelSize')
            .min(0)
            .max(0.5)
            .step(0.01)
            .name('Bevel Size')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'bevelOffset')
            .min(0)
            .max(0.05)
            .step(0.001)
            .name('Bevel Offset')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder
            .add(this.guiControls.textParameters, 'bevelSegments')
            .min(1)
            .max(20)
            .step(1)
            .name('Bevel Segments')
            .onFinishChange((value) => {
                if (this.textMesh) {
                    this.createText();
                }
            });

        textFolder.close();
        const bodyElement = document.querySelector('body');
        Helper.setGradientBackground(
            bodyElement,
            this.guiControls.lineColor,
            this.guiControls.dotColor,
            this.guiControls.background
        );
        const colorFolder = this.datGui.addFolder('Colors');
        colorFolder
            .addColor(this.guiControls, 'background')
            .name('Background')
            .onChange((value) => {
                Helper.setGradientBackground(
                    bodyElement,
                    this.guiControls.lineColor,
                    this.guiControls.dotColor,
                    this.guiControls.background
                );
            });

        colorFolder
            .addColor(this.guiControls, 'lineColor')
            .name('Line Color')
            .onChange((value) => {
                Helper.setGradientBackground(
                    bodyElement,
                    this.guiControls.lineColor,
                    this.guiControls.dotColor,
                    this.guiControls.background
                );
            });

        colorFolder
            .addColor(this.guiControls, 'dotColor')
            .name('Dot COlor')
            .onChange((value) => {
                Helper.setGradientBackground(
                    bodyElement,
                    this.guiControls.lineColor,
                    this.guiControls.dotColor,
                    this.guiControls.background
                );
            });
    }

    handleDebuggerVisibility() {
        if (window.location.href.includes('#debug') && this.datGui) {
            this.datGui.show();
        } else {
            this.datGui.hide();
        }
        // this.datGui.show();
    }

    cameraPositionInitialize() {
        gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: 5,
            duration: 5,
            delay: 1,
            ease: 'power4',
        });
        this.initialCameraMovementDone = true;
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
