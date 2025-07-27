import { useEffect, useRef } from "react";
import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const zoomDistance = 5; // Change this value to set how zoomed in the camera is

// Label height offsets (negative = above, 0 = center, positive = below)
const leftLabelHeightOffset = -60;
const middleLabelHeightOffset = 40;
const rightLabelHeightOffset = -60;

// Label colors
const leftLabelColor = '#ff5555';
const middleLabelColor = '#55ff55';
const rightLabelColor = '#5555ff';

const labelScale = 1.5;

export default function ThreeScene({ onButtonClick }) {
  const mountRef = useRef(null);
  const labelsRef = useRef({});

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x11111f);
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

    // Create label container
    const labelContainer = document.createElement('div');
    labelContainer.style.position = 'absolute';
    labelContainer.style.top = '0';
    labelContainer.style.left = '0';
    labelContainer.style.width = '100%';
    labelContainer.style.height = '100%';
    labelContainer.style.pointerEvents = 'none';
    labelContainer.style.zIndex = '100';
    mountRef.current.appendChild(labelContainer);

    // Function to create a label
    const createLabel = (text, color = '#ffffff') => {
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      label.style.color = color;
      label.style.padding = '8px 12px';
      label.style.borderRadius = '6px';
      label.style.fontSize = '14px';
      label.style.fontFamily = 'Arial, sans-serif';
      label.style.fontWeight = 'bold';
      label.style.border = `2px solid ${color}`;
      label.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      label.style.transform = 'translate(-50%, 0%)'; // Center horizontally, use offset for vertical positioning
      label.style.transition = 'all 0.1s ease-out';
      label.textContent = text;
      label.style.display = 'none'; // Initially hidden
      labelContainer.appendChild(label);
      return label;
    };

    // Load a GLTF/GLB model
    const loader = new GLTFLoader();
    let model;
    let button1, button2, button3;

    // Function to convert 3D position to 2D screen coordinates
    const toScreenPosition = (obj, camera, renderer) => {
      const vector = new THREE.Vector3();
      obj.getWorldPosition(vector);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
      const y = (vector.y * -0.5 + 0.5) * renderer.domElement.clientHeight;

      return {
        x: x,
        y: y,
        z: vector.z
      };
    };

    // Function to update label positions
    const updateLabels = () => {
      if (!model || !button1 || !button2 || !button3) return;

      const buttons = [
        { mesh: button1, label: labelsRef.current.leftLabel, offset: leftLabelHeightOffset },
        { mesh: button2, label: labelsRef.current.middleLabel, offset: middleLabelHeightOffset },
        { mesh: button3, label: labelsRef.current.rightLabel, offset: rightLabelHeightOffset }
      ];

      buttons.forEach(({ mesh, label, offset }) => {
        if (mesh && label) {
          const screenPos = toScreenPosition(mesh, camera, renderer);

          // Hide label if behind camera or too far
          if (screenPos.z > 1) {
            label.style.display = 'none';
          } else {
            label.style.display = 'block';
            label.style.left = `${screenPos.x}px`;
            label.style.top = `${screenPos.y + offset}px`;

            // Optional: Scale label based on distance and base scale
            const distanceScale = Math.max(0.5, Math.min(1, 1 - screenPos.z * 0.5));
            const finalScale = distanceScale * labelScale;
            label.style.transform = `translate(-50%, 0%) scale(${finalScale})`;
          }
        }
      });
    };

    loader.load(
      '/model.glb',
      (gltf) => {
        model = gltf.scene;
        const scale = 0.01;
        model.position.y -= 1;
        model.scale.set(scale, scale, scale);

        // Convert materials to MeshBasicMaterial while preserving textures
        model.traverse((child) => {
          if (child.isMesh) {
            const mat = child.material;
            // Only if material has a color property
            if (mat.color) {
              // Darken the color by multiplying RGB values by a factor < 1
              mat.color.multiplyScalar(0.9); // 10% darker
            }

            // Function to convert a single material
            const convertMaterial = (mat) => {
              const basicMat = new THREE.MeshBasicMaterial();

              // Preserve color
              if (mat.color) basicMat.color.copy(mat.color);

              // Preserve all texture maps that MeshBasicMaterial supports
              if (mat.map) basicMat.map = mat.map;
              if (mat.alphaMap) basicMat.alphaMap = mat.alphaMap;
              if (mat.aoMap) basicMat.aoMap = mat.aoMap;
              if (mat.envMap) basicMat.envMap = mat.envMap;
              if (mat.lightMap) basicMat.lightMap = mat.lightMap;
              if (mat.specularMap) basicMat.specularMap = mat.specularMap;

              // Preserve transparency settings
              basicMat.transparent = mat.transparent || false;
              basicMat.opacity = mat.opacity !== undefined ? mat.opacity : 1.0;

              // Preserve other important properties
              if (mat.side !== undefined) basicMat.side = mat.side;
              if (mat.alphaTest !== undefined) basicMat.alphaTest = mat.alphaTest;
              if (mat.blending !== undefined) basicMat.blending = mat.blending;
              if (mat.depthTest !== undefined) basicMat.depthTest = mat.depthTest;
              if (mat.depthWrite !== undefined) basicMat.depthWrite = mat.depthWrite;

              // Handle UV coordinates
              if (mat.map && mat.map.wrapS !== undefined) {
                basicMat.map.wrapS = mat.map.wrapS;
                basicMat.map.wrapT = mat.map.wrapT;
                basicMat.map.repeat.copy(mat.map.repeat);
                basicMat.map.offset.copy(mat.map.offset);
              }

              return basicMat;
            };

            // Handle both single materials and material arrays
            if (Array.isArray(child.material)) {
              child.material = child.material.map(convertMaterial);
            } else {
              child.material = convertMaterial(child.material);
            }
          }
        });

        // --- 3D Button Meshes as children of the model ---
        const buttonGeometry = new THREE.BoxGeometry(20, 20, 20);
        const buttonMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff5555 });
        const buttonMaterial2 = new THREE.MeshBasicMaterial({ color: 0x55ff55 });
        const buttonMaterial3 = new THREE.MeshBasicMaterial({ color: 0x5555ff });

        button1 = new THREE.Mesh(buttonGeometry, buttonMaterial1);
        button1.position.set(-50, 230, 90);
        button1.name = 'left';
        button1.visible = false;
        model.add(button1);

        button2 = new THREE.Mesh(buttonGeometry, buttonMaterial2);
        button2.position.set(0, 230, 100);
        button2.name = 'middle';
        button2.visible = false;
        model.add(button2);

        button3 = new THREE.Mesh(buttonGeometry, buttonMaterial3);
        button3.position.set(50, 230, 90);
        button3.name = 'right';
        button3.visible = false;
        model.add(button3);

        // Create labels for each button
        labelsRef.current.leftLabel = createLabel('Link Wallet', leftLabelColor);
        labelsRef.current.middleLabel = createLabel('Generate Identity', middleLabelColor);
        labelsRef.current.rightLabel = createLabel('Claim SoulDrop NFT', rightLabelColor);

        scene.add(model);
      },
      (progress) => { },
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
          if (clicked === 'left') {
            onButtonClick('left');
          } else if (clicked === 'middle') {
            onButtonClick('middle');
          } else if (clicked === 'right') {
            onButtonClick('right');
          }
        }
      }
    }

    // Handle window resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('pointerdown', onCanvasClick);

    camera.position.z = zoomDistance;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      updateLabels(); // Update label positions every frame
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onCanvasClick);

      // Clean up labels
      if (labelContainer && mountRef.current && labelContainer.parentNode === mountRef.current) {
        mountRef.current.removeChild(labelContainer);
      }

      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh", position: "relative" }} />;
}