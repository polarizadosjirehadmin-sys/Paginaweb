import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('car-3d-container');
const section3d = document.getElementById('experiencia-3d');

const width = container ? container.clientWidth : window.innerWidth;
const height = container ? container.clientHeight : window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; 

if (container) {
    container.appendChild(renderer.domElement);
} else {
    document.body.appendChild(renderer.domElement);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const bockLight = new THREE.DirectionalLight(0xffffff, 1.5);
bockLight.position.set(-5, 5, -5);
scene.add(bockLight);

const loader = new GLTFLoader();
let windowMaterials = []; 

const rotationAngle = (Math.PI / 2) + Math.PI; 


loader.load('./assets/carro.glb', (gltf) => {
  const carObj = gltf.scene;
  carObj.rotation.y = rotationAngle;
  scene.add(carObj);
});

loader.load('./assets/ventana.glb', (gltf) => {
  const windowsObj = gltf.scene;
  windowsObj.rotation.y = rotationAngle;
  scene.add(windowsObj);

  windowsObj.traverse((obj) => {
    if (obj.isMesh) {

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x010a08,        
        transparent: true,
        opacity: 0.0,          
        roughness: 0.05,        
        transmission: 0.95,     
        ior: 1.52,              
        thickness: 1.8,         
        side: THREE.DoubleSide,
        depthWrite: false
      });

      obj.material = glassMaterial;
      windowMaterials.push(obj.material);
    }
  });
  updateScene();
});


const camStartPos = new THREE.Vector3(0, 1.4, 1.5);   
const camEndPos = new THREE.Vector3(-2., 1.6, 0); 

const camStartLook = new THREE.Vector3(0, 0.6, 0);    
const camEndLook = new THREE.Vector3(0, 0.6, 0);      

const currentPos = new THREE.Vector3();
const currentLook = new THREE.Vector3();


function updateScene() {
  if (!section3d) return;


  const rect = section3d.getBoundingClientRect();
  const sectionHeight = rect.height;
  

  const totalAnimationDistance = sectionHeight - window.innerHeight;

  if (totalAnimationDistance <= 0) return;


  const scrolledInsideSection = -rect.top;


  const progress = Math.max(0, Math.min(1, scrolledInsideSection / totalAnimationDistance)); 


  const targetOpacity = progress * 0.85; 

  windowMaterials.forEach((mat) => {
    mat.opacity = targetOpacity;
    mat.transmission = 1.0 - (progress * 0.5); 
  });


  currentPos.lerpVectors(camStartPos, camEndPos, progress);
  camera.position.copy(currentPos);

 
  currentLook.lerpVectors(camStartLook, camEndLook, progress);
  camera.lookAt(currentLook);
}


window.addEventListener('scroll', updateScene);

window.addEventListener('resize', () => {
  const w = container ? container.clientWidth : window.innerWidth;
  const h = container ? container.clientHeight : window.innerHeight;
  
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  updateScene();
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// ===== MENÚ HAMBURGUESA =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        // Abrir/cerrar menú al hacer clic
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Cambiar ícono (opcional: entre barras y X)
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Cerrar menú al hacer clic fuera (opcional)
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});
