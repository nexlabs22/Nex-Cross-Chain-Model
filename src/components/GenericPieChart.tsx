import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Shape, ExtrudeGeometry } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import useTradePageStore from '@/store/tradeStore';

interface PieChart3DProps {
  data: { label: string; percentage: string; color: string }[];
}

const GenericPieChart3D: React.FC<PieChart3DProps> = ({ data }) => {
  const { selectedPortfolioChartSliceIndex, setSelectedPortfolioChartSliceIndex } = useTradePageStore();

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

      renderer.setClearColor(0xf2f2f2);

      renderer.setSize(canvas.width, canvas.height);

      const radius = 5;
      const height = 1;

      let startAngle = 0;

      // Check if both categories have 0% values
      const totalPercentage = data.reduce((total, sliceData) => total + parseFloat(sliceData.percentage), 0);

      if (totalPercentage === 0) {
        // If both categories have 0% values, create a default gray slice
        const defaultShape = new THREE.Shape();
        defaultShape.moveTo(0, 0);
        defaultShape.absarc(0, 0, radius, 0, Math.PI * 100, false);

        const defaultExtrudeSettings = {
          depth: height,
          bevelEnabled: false,
        };

        const defaultGeometry = new ExtrudeGeometry(defaultShape, defaultExtrudeSettings);
        const defaultMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color('#FFFFFF'), // Use a gray color or any other color you prefer
          emissive: new THREE.Color('#999999'),
          flatShading: false,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          shininess: 0,
          specular: new THREE.Color(0x111111),
        });

        defaultMaterial.precision = "highp"

        const defaultSlice = new THREE.Mesh(defaultGeometry, defaultMaterial);
        scene.add(defaultSlice);
      } else {
        // Create slices based on the provided data
        data.forEach((sliceData, index) => {
          const percentage = parseFloat(sliceData.percentage);
          const endAngle = startAngle + (percentage / 100) * Math.PI * 2;

          const shape = new THREE.Shape();
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

          slice.userData = {
            label: sliceData.label,
            percentage: sliceData.percentage,
            color: sliceData.color,
          };

          slices.push(slice);
          scene.add(slice);

          startAngle = endAngle;
        });
      }

      camera.position.set(0, -8, 13);
      camera.lookAt(0, 0, 0);

      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

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

          if (newIntersectedSlice.material instanceof THREE.MeshPhongMaterial) {
            newIntersectedSlice.material.emissiveIntensity = 0.02;

            console.log('Hovered Slice Data:', newIntersectedSlice.userData.label);

            // Tween the scale
            new TWEEN.Tween(newIntersectedSlice.scale)
              .to({ x: 1.1, y: 1.1, z: 1.1 }, 200)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();

            slices.forEach((slice) => {
              if (slice !== newIntersectedSlice) {
                // Tween the scale
                new TWEEN.Tween(slice.scale)
                  .to({ x: 1, y: 1, z: 1 }, 200)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
              }
            });
          }

          intersectedSlice = newIntersectedSlice;
        } else {
          slices.forEach((slice) => {
            // Tween the scale
            new TWEEN.Tween(slice.scale)
              .to({ x: 1, y: 1, z: 1 }, 200)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();

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
        TWEEN.update(); // Update Tween.js animations
      };

      slices.forEach((slice) => {
        slice.userData.originalPosition = slice.position.clone();
      });

      animate();

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
        window.removeEventListener('mousemove', handleMouseMove);

        slices.forEach((slice) => {
          scene.remove(slice);
          slice.geometry.dispose();
        });

        scene.clear();

        renderer.dispose();

        camera.clear();

        legend.innerHTML = '';
      };
    }
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: 'none' }} />
      <div ref={legendRef} style={{ display: 'flex', marginTop: '10px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '15px' }}></div>
    </div>
  );
};

export default GenericPieChart3D;
