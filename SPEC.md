# Mom's Birthday Tribute - Immersive 3D Experience

## Project Overview

**Project Name:** Mom's Birthday Tribute - AirDrop Ultra-Luxury Edition  
**Project Type:** Interactive 3D Web Experience  
**Core Functionality:** A cinematic, ultra-luxury birthday tribute website featuring a photorealistic 3D cake, glassmorphism iOS-style interface, interactive animations, AR capabilities, and ambient audio-visual experiences.  
**Target Users:** Children creating an immersive digital birthday surprise for their mother

---

## Visual & Rendering Specification

### Scene Setup

**Camera:**
- Type: PerspectiveCamera with dynamic FOV (60° mobile, 45° desktop)
- Controls: Mouse/touch parallax (no orbit controls - fixed cinematic view with subtle movement)
- Initial position: (0, 2, 8) looking at cake center
- Parallax depth: 50px on mouse move / device gyroscope

**Lighting:**
- Ambient light: Warm champagne (#FFF8E7) at 0.3 intensity
- Main spotlight: From above-front, warm white (#FFF8E7), intensity 2.0, casting shadows
- Candle point lights: 3x warm orange (#FF9500), intensity 1.5, animated flicker
- Rim lights: 2x golden (#D4AF37) from sides for edge highlighting
- God rays: Volumetric light scattering from candle positions

**Environment:**
- Background: Custom shader gradient (deep midnight navy #0F172A → champagne gold #D4AF37)
- Aurora effect: Subtle animated aurora using noise-based shader
- Fog: Volumetric fog, density 0.02, color #1a1a2e
- Bokeh: 50+ floating light orbs, responding to cursor

### Materials & Effects

**Cake Materials:**
- Base: PBR material, cream/ivory (#FFF8F0), roughness 0.3, metalness 0.0
- Gold leaf: PBR gold (#D4AF37), roughness 0.1, metalness 1.0, with displacement
- Sugar flowers: Translucent material with SSS, pink/cream gradient
- Cake tiers: Slight subsurface scattering simulation

**Glass Panel (AirDrop Card):**
- Custom GLSL shader with:
  - Refractive caustics (IOR 1.45)
  - Edge lighting (Fresnel-based)
  - Real-time background blur simulation
  - Chromatic aberration on edges

**Particle Systems:**
- Golden dust: 200 particles, size 0.02-0.05, velocity randomized, metallic gold
- Rose petals: 50 particles, translucent pink, tumbling rotation, slow descent
- Sparkles: 100 particles, burst on "Make a Wish" click

**Post-Processing:**
- Bloom: Threshold 0.8, intensity 1.5, radius 0.4
- Chromatic aberration: Subtle, 0.002 offset
- Vignette: Soft, 0.3 intensity
- Film grain: Very subtle, 0.05 intensity

### 3D Assets

**Cake Geometry:**
- 3-tier cylindrical cake (procedurally generated)
- Tier 1 (bottom): radius 2.0, height 0.8
- Tier 2 (middle): radius 1.5, height 0.7
- Tier 3 (top): radius 1.0, height 0.6
- Decorative elements: 15 sugar flowers, gold leaf strips, 3 candles

**Candles:**
- Cylinder geometry with flame (cone + particle)
- Flame: Animated shader with noise displacement
- Light: Point light with flicker animation (frequency 5-10Hz)

**Memory Cards (Timeline):**
- Onyx material: Dark (#1a1a1a), roughness 0.2, metalness 0.8
- Gold edges: 2mm rim with #D4AF37
- Photo texture: User-provided or default family photo
- Dimensions: 3x4 aspect ratio

**Crystal Ball:**
- Glass sphere: IOR 1.5, roughness 0.0, transmission 0.95
- Inner photos: Cubemap environment with family photos
- Caustic projection: Animated caustic light on surrounding surfaces

---

## Simulation Specification

### Physics

**Particle Systems:**
- Golden dust: Simple velocity + gravity (0.01 units/frame), random drift
- Rose petals: Tumbling physics with rotation, air resistance simulation
- Sparkles: Burst physics with velocity decay, gravity 0.05

**Candle Flames:**
- Simulation: Noise-based vertex displacement
- Flicker: Perlin noise at 5-10Hz
- Blow-out threshold: Microphone input > 0.7 amplitude

**Smoke Simulation:**
- Triggered on candle blow-out
- Billboard particle system
- Velocity: Upward drift with turbulence
- Opacity: Fade from 0.6 to 0 over 3 seconds

**Cloth/Petal Physics:**
- Rose petals: Quaternion-based tumbling, air resistance

### Performance Targets

- Target FPS: 60fps mobile, 120fps desktop
- Max particles: 500 simultaneous
- Texture resolution: 1024x1024 for mobile, 2048x2048 for desktop
- LOD: Simplified geometry at distance

---

## Interaction Specification

### User Controls

**Mouse/Touch:**
- Parallax: Camera offset based on cursor position (±50px depth)
- AirDrop card tilt: 3D rotation following cursor (max 15° X, 10° Y)
- Memory timeline: Horizontal scroll/drag
- Crystal ball: Drag to rotate 360°

**Buttons:**
- "Make a Wish": 
  - Hover: Magnetic pull + gold rim glow
  - Click: Trigger candle blow animation + sparkle burst
- "Blow Out Candles": Enable microphone, detect blow amplitude

**Gestures (Mobile):**
- Swipe: Memory timeline navigation
- Pinch: Crystal ball zoom
- Two-finger rotate: Cake rotation in AR mode

### Interactive Elements

**AirDrop Card:**
- Header: "AirDrop from [Son/Daughter]" with variable font weight animation
- Message: Typewriter reveal with golden shimmer
- 3D tilt following mouse/device

**Memory Lane Timeline:**
- Horizontal scroll with parallax depth (foreground moves faster)
- 5-7 memory cards representing different years/moments
- Cards float at slight angles, glassmorphism effect

**Photo Crystal Ball:**
- Drag to rotate - shows different family photos
- Caustic light projections on surrounding area
- Iridescent surface reflections

**AR Section:**
- QR code: Dynamic generation with particle aura
- WebXR: Place cake on real-world surfaces
- Gestures: Pinch to scale, two-finger rotate, tap to relight

### Audio Feedback

- Ambient: Soft piano melody, candle crackle, subtle champagne pour
- Interactions: 
  - Button hover: Soft chime
  - Button click: Crystal bell
  - Candle blow: Whoosh + ember crackle
  - Memory card: Page turn sound

---

## UI Specification

### Layout Structure

**Sections (Vertical Scroll):**
1. Hero (100vh) - Cake scene with AirDrop card
2. Memory Lane (200vh) - Horizontal timeline
3. Crystal Ball (100vh) - Photo sphere
4. AR Experience (100vh) - WebXR feature

**Responsive Breakpoints:**
- Mobile: 9:16 aspect priority, < 768px width
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Primary Gold: #D4AF37 (Imperial Gold)
- Secondary: #F4E4C1 (Champagne)
- Accent: #0F172A (Deep Sapphire)
- Highlight: #FFF8E7 (Candlelight Warm White)
- Iridescent: #E8D5E0 (Mother-of-Pearl)

**Typography:**
- Headlines: "Playfair Display" (editorial elegant serif)
- UI: "Plus Jakarta Sans" (geometric humanist)
- Monospace: "SF Mono" for technical elements
- Fluid typography: clamp(1rem, 5vw, 2rem)

**Glassmorphism:**
- Background: rgba(255, 255, 255, 0.1)
- Blur: backdrop-filter blur(20px)
- Border: 1px solid rgba(255, 255, 255, 0.2)
- Shadow: 0 8px 32px rgba(0, 0, 0, 0.1)

---

## Technical Implementation

### Dependencies (CDN)

```
Three.js r158
GSAP 3.12 + ScrollTrigger
WebXR Polyfill
Tone.js (audio)
Custom GLSL shaders
```

### File Structure

```
/mom-birthday-tribute
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── three-scene.js
│   ├── ui.js
│   ├── audio.js
│   └── ar.js
├── assets/
│   └── (generated procedurally)
└── SPEC.md
```

### Shader Requirements

**Background Gradient:**
- Vertex: Standard fullscreen quad
- Fragment: Mix between #0F172A and #D4AF37 based on UV + time

**Glass Effect:**
- Vertex: Standard with normal calculation
- Fragment: Fresnel + refraction + blur simulation + chromatic aberration

**Candle Flame:**
- Vertex: Noise-based displacement
- Fragment: Gradient from white core to orange tip with emission

---

## Acceptance Criteria

### Visual Checkpoints
- [ ] Cake renders with all 3 tiers, flowers, gold leaf, and candles
- [ ] Candle flames animate with realistic flicker
- [ ] Golden dust and rose petal particles float through scene
- [ ] Background shows gradient with aurora effect
- [ ] Bokeh lights respond to cursor movement

### Interaction Checkpoints
- [ ] AirDrop card tilts in 3D following cursor
- [ ] "Make a Wish" button has magnetic hover effect
- [ ] Clicking button triggers candle blow + sparkle animation
- [ ] Memory timeline scrolls horizontally with parallax
- [ ] Crystal ball rotates showing different photos

### Technical Checkpoints
- [ ] Loads without console errors
- [ ] Maintains 60fps on modern mobile devices
- [ ] Responsive across all breakpoints
- [ ] Microphone input works for candle blow detection
- [ ] AR section loads with QR code (WebXR fallback)

### Audio Checkpoints
- [ ] Ambient piano plays on user interaction
- [ ] UI sounds play on hover/click
- [ ] No audio errors in console

---

## Customization Notes

**User Configuration:**
- Replace `[Your Name]` in header
- Add photos to memory timeline
- Customize message strings
- Adjust candle count and colors

**Default Values:**
- Number of candles: 3
- Memory cards: 6
- Particle counts: 200 dust, 50 petals, 100 sparkles
