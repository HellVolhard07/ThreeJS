import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Stem
class CustomSinCurve extends THREE.Curve {
	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {
		const tx = t * 10;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;
		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

// Textures
const textureLoader = new THREE.TextureLoader();

const stemColorMap = textureLoader.load("textures/stemColor.jpg");
stemColorMap.repeat.set(1 ,0.5);
stemColorMap.wrapS = THREE.RepeatWrapping;
stemColorMap.wrapT = THREE.RepeatWrapping;
stemColorMap.minFilter = THREE.LinearFilter

const leafColorMap = textureLoader.load("textures/color2.png");
const leafAlphaMap = textureLoader.load("textures/alpha.jpg");

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load("/textures/grass/ambientOcclusion.jpg");

grassColorTexture.minFilter = THREE.NearestFilter

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

// Ambient Light
var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Directional Lights
var lights = [];
lights[0] = new THREE.DirectionalLight( 0xffffff, 0.8 );
lights[0].position.set( 0, 1, 0 );
lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
lights[1].position.set( 0.75, 1, 0.5 );
lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
lights[2].position.set( -0.75, -1, 0.5 );
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

// Hands
const hands = new THREE.Group()
scene.add(hands)
// Left Hand
const leftHand = new THREE.Object3D();
hands.add(leftHand);

// Hands Loader
const loader = new GLTFLoader();
loader.load(
  "Models/Hands/scene.gltf",
  (gltf) => {
    leftHand.add(gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0])
  }
)
leftHand.scale.set(2.6, 2.6, 2.6)
leftHand.rotation.z = Math.PI * 0.5
leftHand.position.set(-200, 530, 0)

// Right Hand
const rightHand = new THREE.Object3D();
hands.add(rightHand);

// Hands Loader
loader.load(
  "Models/Hands/scene.gltf",
  (gltf) => {
    rightHand.add(gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0])
  }
)
rightHand.scale.set(2.6, 2.6, -2.6)
rightHand.rotation.x = Math.PI
rightHand.rotation.z = - Math.PI * 0.5
rightHand.position.set(200, 530, 0)

// Air flowers
var particles = new THREE.Object3D();
scene.add(particles);

// Particles
var geometry = new THREE.TetrahedronBufferGeometry(2, 0);
var material = new THREE.MeshNormalMaterial();

for (var i = 0; i < 1000; i++) {
  var mesh = new THREE.Mesh(geometry , material);
  mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
  mesh.position.multiplyScalar(90 + (Math.random() * 700));
  mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
  particles.add(mesh);
}

// Flower
var flower = new THREE.Group();
flower.position.y = 100
scene.add(flower);

// Petals
var geom = new THREE.TorusKnotGeometry( 5, 3, 63, 7, 13, 14 );
var petals = new THREE.Mesh(geom, material);
petals.scale.x = petals.scale.y = petals.scale.z = 16;
flower.add(petals);

// Stem
const path = new CustomSinCurve( 6 );
const stemGeometry = new THREE.TubeBufferGeometry( path, 100, 2, 8, false );
const stemMaterial = new THREE.MeshBasicMaterial({
  map: stemColorMap
});

const stem = new THREE.Mesh( stemGeometry, stemMaterial );
stem.geometry.setAttribute(
  "uv2", 
  new THREE.Float32BufferAttribute(stem.geometry.attributes.uv.array, 2)
);
stem.position.set(-40, -600, 0)
stem.rotation.z = Math.PI * 0.5
stem.scale.set(10, 10, 10)
flower.add( stem );

// Leaves
const leafGeometry = new THREE.SphereGeometry( 12, 23, 12, 0, 1.2, 4, 2 );
const leafMaterial = new THREE.MeshBasicMaterial({
  map: leafColorMap,
  alphaMap: leafAlphaMap,
  alphaTest: 0.1,
  side: THREE.DoubleSide
});

const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
leaf1.position.set(-70, -80, -30)
leaf1.rotation.set(- Math.PI * 0.2, Math.PI * 0.2, - Math.PI * 0.8)
leaf1.scale.set(10, 10, 10)
scene.add(leaf1);

const leaf2 = new THREE.Mesh(leafGeometry, leafMaterial);
leaf2.position.set(-15, -100, -50)
leaf2.rotation.set(0, - Math.PI * 0.8, - Math.PI * 0.8)
leaf2.scale.set(10, 10, 10)
scene.add(leaf2);

// Floor
const floor = new THREE.Mesh(
  new THREE.CircleGeometry( 1200, 32 ),
  new THREE.MeshBasicMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    side: THREE.DoubleSide
  })
);
floor.geometry.setAttribute(
  "uv2", 
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.set(-Math.PI * 0.5, 0, -Math.PI * 0.5)
floor.position.y = -500
scene.add(floor)

// Floor flowers
loader.load(
  "Models/Flowers/scene.gltf",
  (gltf) => {
    const grassFlowers = new THREE.Object3D()
    grassFlowers.add(gltf.scene)
    grassFlowers.position.set(10, -500, 10)
    scene.add(grassFlowers)
  }
)

loader.load(
  "Models/Flowers/scene.gltf",
  (gltf) => {
    const grassFlowers = new THREE.Object3D()
    grassFlowers.add(gltf.scene)
    grassFlowers.position.set(-100, -500, 40)
    grassFlowers.rotation.y = Math.PI
    scene.add(grassFlowers)
  }
)

loader.load(
  "Models/Flowers/scene.gltf",
  (gltf) => {
    const grassFlowers = new THREE.Object3D()
    grassFlowers.add(gltf.scene)
    grassFlowers.position.set(-60, -500, -50)
    grassFlowers.rotation.y = Math.PI * 0.8
    scene.add(grassFlowers)
  }
)

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
  1000000
);

camera.position.set(0, 80, -700);
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

// Animation
const tick = () => {

  particles.rotation.x -= 0.0005;
  particles.rotation.y -= 0.0010;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick();

gui.close();