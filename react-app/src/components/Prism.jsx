import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.15;
    
    float n1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 - t * 0.5);
    float n2 = sin(uv.y * 4.0 - t * 0.7) * cos(uv.x * 3.0 + t * 0.3);
    float n3 = sin((uv.x + uv.y) * 5.0 + t * 0.4);
    
    float hue = fract(n1 * 0.5 + n2 * 0.3 + n3 * 0.2 + t * 0.1);
    hue = mod(hue + 0.5, 1.0);
    
    float sat = 0.7 + 0.3 * sin(uv.x * 2.0 + uv.y * 3.0 + t);
    float val = 0.5 + 0.5 * sin(uv.x * 4.0 - uv.y * 2.0 + t * 0.5);
    
    vec3 col = hsv2rgb(vec3(hue, sat, val));
    
    vec2 center = vec2(0.5, 0.5);
    float dist = length(uv - center);
    float glow = 1.0 - smoothstep(0.0, 0.8, dist);
    col += vec3(1.0, 0.9, 0.7) * glow * 0.3;
    
    float vignette = 1.0 - smoothstep(0.4, 1.2, dist);
    col *= vignette * 0.5 + 0.5;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Prism() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  
  useEffect(() => {
    console.log('[DEBUG] Prism useEffect running');
    
    if (!containerRef.current) {
      console.log('[DEBUG] Prism: containerRef.current is null, returning');
      return;
    }
    
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 1;
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      transparent: true
    });
    
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    const animate = () => {
      material.uniforms.uTime.value += 0.016;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      material.uniforms.uResolution.value.set(w, h);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}

export default Prism;
