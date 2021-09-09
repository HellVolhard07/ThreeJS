import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("silver")

//Textures
const textureLoader = new THREE.TextureLoader()
const matcapTexture1 = textureLoader.load("/textures/matcaps/3.png")
const matcapTexture2 = textureLoader.load("/textures/matcaps/7.png")


//Object
const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture1,
})
const material2 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture2,
})


// Font geometry
const fontLoader = new THREE.FontLoader()
const fontPath = "/fonts/helvetiker_regular.typeface.json"
fontLoader.load(fontPath, (font) => {
  const textGeometrySarthak = new THREE.TextBufferGeometry("Sarthak Khandelwal", {
    font: font,
    size: 0.5,
    height: 0.04,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  })

  const textGeometryWamika = new THREE.TextBufferGeometry("Wamika Jha", {
    font: font,
    size: 0.5,
    height: 0.04,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  const textGeometryRahul = new THREE.TextBufferGeometry("Rahul Gandhi", {
    font: font,
    size: 0.5,
    height: 0.04,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  const textGeometryShubham = new THREE.TextBufferGeometry("Shubham Rawal", {
    font: font,
    size: 0.5,
    height: 0.04,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  const textGeometryDhruv = new THREE.TextBufferGeometry("Dhruv Pasricha", {
    font: font,
    size: 0.5,
    height: 0.04,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  })




  const text = new THREE.Mesh(textGeometrySarthak, material)
  scene.add(text)
  const text2 = new THREE.Mesh(textGeometryRahul, material)
  scene.add(text2)
  const text3 = new THREE.Mesh(textGeometryWamika, material)
  scene.add(text3)
  const text4 = new THREE.Mesh(textGeometryShubham, material)
  scene.add(text4)
  const text5 = new THREE.Mesh(textGeometryDhruv, material)
  scene.add(text5)

  text.geometry.computeBoundingBox() 
  text.geometry.center() 

  text2.position.x = 10
  text2.position.z = -2

  text3.position.x = 4
  text3.position.z = 2

  text4.position.x = -14
  text4.position.z = -2

  text5.position.x = -8
  text5.position.z = 2

})



// 100 donuts
const donutGeometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)
const amountOfDonuts = 100
for (let i = 0; i < amountOfDonuts; i++) {
  const donut = new THREE.Mesh(donutGeometry, material2)

  donut.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 10,
    -Math.random() - 1
  )

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  const randomScale = Math.random() + 0.1

  donut.scale.set(randomScale, randomScale, randomScale)

  scene.add(donut)
}

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0, -0.2, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Animation

const tick = () => {

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()