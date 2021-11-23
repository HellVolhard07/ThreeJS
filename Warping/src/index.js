import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures
const textureLoader = new THREE.TextureLoader();
const star = textureLoader.load("/particles/1.png");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d1d1d)

// Particles
const parameters = {
  count: 8000,
  size: 1.2,
};

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(parameters.count * 3);
const velocity = new Float32Array(parameters.count);
const acceleration = new Float32Array(parameters.count);

for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3;
  velocity[i] = 1;
  acceleration[i] = 0.03;
  positions[i3 + 0] = Math.random() * 600 - 300
  positions[i3 + 1] = Math.random() * 600 - 300
  positions[i3 + 2] = Math.random() * 600 - 300
}

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
  "velocity",
  new THREE.BufferAttribute(velocity, 1)
)

geometry.setAttribute(
  "acceleration",
  new THREE.BufferAttribute(acceleration, 1)
)

const material = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  alphaMap: star,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

const wheelGeometry = new THREE.TorusGeometry(4, 1, 20, 50)
const wheelMaterial = new THREE.MeshNormalMaterial({
  wireframe: true
})
const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)

wheel.position.set(0, -8.5, 1)
scene.add(wheel)

// Resizing and fullscreen
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 10)
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

// Animation
const tick = () => {

  for(let i = 0;  i < parameters.count ; i++) {
    const i3 = i * 3;
    geometry.attributes.velocity.array[i] += geometry.attributes.acceleration.array[i];
    geometry.attributes.position.array[i3 + 2] += geometry.attributes.velocity.array[i];
    if (geometry.attributes.position.array[i3 + 2] > 200) {
      geometry.attributes.position.array[i3 + 2] = -200
      geometry.attributes.velocity.array[i] = 0
    }
  }
  geometry.attributes.velocity.needsUpdate = true
  geometry.attributes.position.needsUpdate = true

  const elapsedTime = clock.getElapsedTime()

  camera.rotation.y = elapsedTime

  points.rotation.z += Math.sin(elapsedTime) * 0.005
  wheel.rotation.z += Math.sin(elapsedTime) * 0.005

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick();

gui.close();