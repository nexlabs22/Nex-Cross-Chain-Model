import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Shape, ExtrudeGeometry } from 'three';

interface PieChart3DProps {
  data: { label: string; percentage: string; color: string }[];
}

const GenericPieChart3D: React.FC<PieChart3DProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);
  const slices: THREE.Mesh[] = [];

  useEffect(() => {
    if (canvasRef.current && legendRef.current) {
      const canvas = canvasRef.current;
      const legend = legendRef.current;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);

      // Set background color
      renderer.setClearColor(0xf2f2f2);

      renderer.setSize(canvas.width, canvas.height);

      const radius = 5;
      const height = 1; // Set the extrusion height

      let startAngle = 0;

      data.forEach((sliceData, index) => {
        const percentage = parseFloat(sliceData.percentage);
        const endAngle = startAngle + (percentage / 100) * Math.PI * 2;

        const shape = new Shape();
        shape.moveTo(0, 0);
        shape.arc(0, 0, radius, startAngle, endAngle, false);
        shape.lineTo(0, 0);

        const extrudeSettings = {
          depth: height,
          bevelEnabled: false,
        };

        const geometry = new ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(sliceData.color),
          emissive: new THREE.Color('#ffffff'),
          flatShading: true,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          shininess: 0,
          specular: new THREE.Color(0x000000),
        });

        const slice = new THREE.Mesh(geometry, material);

        // Attach user data to the slice for reference
        slice.userData = {
          label: sliceData.label,
          percentage: sliceData.percentage,
          color: sliceData.color,
        };

        slices.push(slice);
        scene.add(slice);

        startAngle = endAngle;
      });

      // Adjust camera position for a slight angle from the bottom
      camera.position.set(0, -8, 13);
      camera.lookAt(0, 0, 0);

      // Add ambient light for better shading
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      // Add directional light for shading
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let intersectedSlice: THREE.Mesh | null = null;

      const handleMouseMove = (event: MouseEvent) => {
        const canvasRect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(slices);

        if (intersects.length > 0) {
          const newIntersectedSlice = intersects[0].object as THREE.Mesh;

          // Adjust the emissive color for an inset shadow effect
          if (newIntersectedSlice.material instanceof THREE.MeshPhongMaterial) {
            newIntersectedSlice.material.emissiveIntensity = 0.02; // Adjust the intensity as needed
          }

          // Scale up the hovered slice
          newIntersectedSlice.scale.set(1.1, 1.1, 1.1);

          // Scale down all other slices
          slices.forEach((slice) => {
            if (slice !== newIntersectedSlice) {
              slice.scale.set(1, 1, 1);
            }
          });

          intersectedSlice = newIntersectedSlice;
        } else {
          // Reset scale for all slices if no intersection
          slices.forEach((slice) => {
            slice.scale.set(1, 1, 1);

            if (slice.material instanceof THREE.MeshPhongMaterial) {
              slice.material.emissiveIntensity = 0;
            }
          });

          intersectedSlice = null;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
      };

      // Save the original positions of slices
      slices.forEach((slice) => {
        slice.userData.originalPosition = slice.position.clone();
      });

      animate();

      // Create legend
      data.forEach((sliceData) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const colorCircle = document.createElement('div');
        colorCircle.className = 'color-circle';
        colorCircle.style.backgroundColor = sliceData.color;

        const labelText = document.createElement('div');
        labelText.className = 'label-text';
        labelText.textContent = `${sliceData.label}: ${sliceData.percentage}`;

        legendItem.appendChild(colorCircle);
        legendItem.appendChild(labelText);
        legend.appendChild(legendItem);
      });

      return () => {
        // Remove event listener on component unmount
        window.removeEventListener('mousemove', handleMouseMove);

        // Dispose of existing objects in the scene
        slices.forEach((slice) => {
          scene.remove(slice);
          slice.geometry.dispose();
          //slice.material.dispose();
        });

        // Clear the scene
        scene.clear();

        // Dispose of the renderer
        renderer.dispose();

        // Clear the camera
        camera.clear();

        // Clear the legend
        legend.innerHTML = '';
      };
    }
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: 'none' }} />
      <div ref={legendRef} style={{ display: 'flex', marginTop: '10px', flexDirection: "row", alignItems: "center", justifyContent: 'center', gap: "15px" }}></div>
    </div>
  );
};

export default GenericPieChart3D;
