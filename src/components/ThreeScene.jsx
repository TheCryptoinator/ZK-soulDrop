import { useEffect, useRef } from "react";
import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const zoomDistance = 2; // Change this value to set how zoomed in the camera is

export default function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add OrbitControls for free camera movement, but lock zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = zoomDistance;
    controls.maxDistance = zoomDistance;
    controls.target.set(0, 0, 0);
    controls.update();
    // Load a GLTF/GLB model
    const loader = new GLTFLoader();
    let model;
    let button1, button2, button3;
    loader.load(
      '/model.glb',
      (gltf) => {
        model = gltf.scene;

        // Convert all mesh materials in the model to MeshBasicMaterial for unlit rendering
        model.traverse((child) => {
          if (child.isMesh) {
            // If the mesh has a material array, convert each
            if (Array.isArray(child.material)) {
              child.material = child.material.map((mat) =>
                new THREE.MeshBasicMaterial({
                  color: mat.color ? mat.color : 0xffffff,
                  map: mat.map || null,
                  transparent: mat.transparent,
                  opacity: mat.opacity,
                  side: mat.side
                })
              );
            } else {
              child.material = new THREE.MeshBasicMaterial({
                color: child.material.color ? child.material.color : 0xffffff,
                map: child.material.map || null,
                transparent: child.material.transparent,
                opacity: child.material.opacity,
                side: child.material.side
              });
            }
          }
        });

        // --- 3D Button Meshes as children of the model ---
        const buttonGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.05);
        const buttonMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff5555 });
        const buttonMaterial2 = new THREE.MeshBasicMaterial({ color: 0x55ff55 });
        const buttonMaterial3 = new THREE.MeshBasicMaterial({ color: 0x5555ff });

        button1 = new THREE.Mesh(buttonGeometry, buttonMaterial1);
        button1.position.set(-0.3, 0.3, 0.4);
        button1.name = 'Button1';
        model.add(button1);

        button2 = new THREE.Mesh(buttonGeometry, buttonMaterial2);
        button2.position.set(0, -1, 0);
        button2.name = 'Button2';
        model.add(button2);

        button3 = new THREE.Mesh(buttonGeometry, buttonMaterial3);
        button3.position.set(0.6, -1, 0);
        button3.name = 'Button3';
        model.add(button3);

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model:', error);
      }
    );

    // --- Raycaster for 3D button clicks ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onCanvasClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      // Only check for button meshes if model and buttons are loaded
      if (model && button1 && button2 && button3) {
        const intersects = raycaster.intersectObjects([button1, button2, button3]);
        if (intersects.length > 0) {
          const clicked = intersects[0].object.name;
          if (clicked === 'Button1') {
            console.log('3D Button1 clicked');
            // Add your custom logic for 3D Button1 here
          } else if (clicked === 'Button2') {
            console.log('3D Button2 clicked');
            // Add your custom logic for 3D Button2 here
          } else if (clicked === 'Button3') {
            console.log('3D Button3 clicked');
            // Add your custom logic for 3D Button3 here
          }
        }
      }
    }
    renderer.domElement.addEventListener('pointerdown', onCanvasClick);

    camera.position.z = zoomDistance;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onCanvasClick);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}
