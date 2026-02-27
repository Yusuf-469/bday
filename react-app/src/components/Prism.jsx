import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uHueShift;
  varying vec2 vUv;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    
    // Create animated prismatic effect
    float t = uTime * 0.15;
    
    // Multiple layers of shifting colors
    vec3 col = vec3(0.0);
    
    // Layer 1 - base gradient
    float n1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 - t * 0.5);
    float n2 = sin(uv.y * 4.0 - t * 0.7) * cos(uv.x * 3.0 + t * 0.3);
    float n3 = sin((uv.x + uv.y) * 5.0 + t * 0.4);
    
    // Prismatic rainbow effect
    float hue = fract(n1 * 0.5 + n2 * 0.3 + n3 * 0.2 + uHueShift + t * 0.1);
    hue = mod(hue + 0.5, 1.0);
    
    // Saturation and value vary with position
    float sat = 0.7 + 0.3 * sin(uv.x * 2.0 + uv.y * 3.0 + t);
    float val = 0.5 + 0.5 * sin(uv.x * 4.0 - uv.y * 2.0 + t * 0.5);
    
    col = hsv2rgb(vec3(hue, sat, val));
    
    // Add glow in center
    vec2 center = vec2(0.5, 0.5);
    float dist = length(uv - center);
    float glow = 1.0 - smoothstep(0.0, 0.8, dist);
    col += vec3(1.0, 0.9, 0.7) * glow * 0.3;
    
    // Add subtle noise
    float noise = random(uv + fract(t)) * 0.05;
    col += noise;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.2, dist);
    col *= vignette * 0.5 + 0.5;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Prism({ 
  animationType = "rotate", 
  timeScale = 0.5, 
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0,
  glow = 1
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const frameIdRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up any existing renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      containerRef.current.removeChild(rendererRef.current.domElement);
    }
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create renderer with alpha
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create orthographic camera for 2D background
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;
    
    // Create full-screen plane with custom shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uHueShift: { value: hueShift },
      },
      transparent: true
    });
    materialRef.current = material;
    
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.01 * timeScale;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(w, h);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [hueShift, timeScale]);
  
  return (
    <div 
      ref={containerRef} 
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: '#0F172A'
      }}
    />
  );
}

export default Prism;
