import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AmbientLight } from 'three'

//Debug
const gui = new dat.GUI()

//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

//Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const ambientFolder = gui.addFolder("Ambient Light")
ambientFolder.add(ambientLight, "intensity").min(0).max(1).step(0.001).name("Intensity");

//Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = -1;
directionalLight.shadow.camera.far = 14;
directionalLight.shadow.radius = 6;

scene.add(directionalLight);

const directionalFolder = gui.addFolder("Directional Light");
directionalFolder.add(directionalLight, "intensity").min(0).max(1).step(0.001).name("Intensity");
const positionFolder = directionalFolder.addFolder("Position");
positionFolder.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
positionFolder.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
positionFolder.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

//Geometry
const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 16);
const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);

//Materials
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xffffff);
material.roughness = 0.5;
material.metalness = 0.5;

const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "roughness").min(0).max(1).step(0.001);
materialFolder.add(material, "metalness").min(0).max(1).step(0.001);

//Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.castShadow = true;

const plane = new THREE.Mesh(planeGeometry, material);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
plane.material.side = THREE.DoubleSide;
plane.receiveShadow = true;

scene.add(sphere, plane);

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 4, 6);
camera.lookAt(sphere);
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  
  sphere.position.x = Math.cos(elapsedTime) * 2;
  sphere.position.z = Math.sin(elapsedTime) * 2;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));


    controls.update();

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick();

gui.close();