import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function ParticleEffect() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create a Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set up the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Mouse tracking
    const mouse = { x: undefined, y: undefined };

    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Cube particles array
    const cubes = [];
    const numberOfCubes = 100;

    // Load the Obama texture
    const textureLoader = new THREE.TextureLoader();
    const obamaTexture = textureLoader.load('/obama.jpg');

    // Cube geometry and material (with Obama image as texture)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: obamaTexture });

    // Create multiple cubes and add to the scene
    function createCubes() {
      for (let i = 0; i < numberOfCubes; i++) {
        const cube = new THREE.Mesh(geometry, material);
        
        // Randomly place cubes
        cube.position.x = (Math.random() - 0.5) * 20;
        cube.position.y = (Math.random() - 0.5) * 20;
        cube.position.z = (Math.random() - 0.5) * 20;

        // Assign random velocities
        cube.velocity = {
          x: (Math.random() - 0.5) * 0.05,
          y: (Math.random() - 0.5) * 0.05,
          z: (Math.random() - 0.5) * 0.05,
        };

        scene.add(cube);
        cubes.push(cube);
      }
    }

    createCubes();

    // Set the camera position
    camera.position.z = 15;

    // Animate the scene
    function animate() {
      requestAnimationFrame(animate);

      cubes.forEach((cube) => {
        // Rotate the cubes on each axis
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Update cube position based on its velocity
        cube.position.x += cube.velocity.x;
        cube.position.y += cube.velocity.y;
        cube.position.z += cube.velocity.z;

        // Keep cubes within bounds (reset if out of bounds)
        const bound = 10;
        if (cube.position.x > bound || cube.position.x < -bound) cube.velocity.x *= -1;
        if (cube.position.y > bound || cube.position.y < -bound) cube.velocity.y *= -1;
        if (cube.position.z > bound || cube.position.z < -bound) cube.velocity.z *= -1;

        // Mouse interaction: slightly scale cubes if close to the mouse position
        const dx = mouse.x * 10 - cube.position.x;
        const dy = mouse.y * 10 - cube.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          cube.scale.set(1.5, 1.5, 1.5); // Scale up when close to the mouse
        } else {
          cube.scale.set(1, 1, 1); // Reset size when far from the mouse
        }
      });

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', null);
      window.removeEventListener('resize', null);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default ParticleEffect;
