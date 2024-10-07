import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function SphereComponent() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Sphere geometry and material
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const texture = new THREE.TextureLoader().load('../public/obama.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    // Mouse controls for interaction
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0,
    };

    const onMouseDown = (event) => {
      isDragging = true;
    };

    const onMouseMove = (event) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y,
      };

      sphere.rotation.y += deltaMove.x * 0.005;
      sphere.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY,
      };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default SphereComponent;
