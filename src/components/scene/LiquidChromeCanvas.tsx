import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

#define MAX_STEPS 90
#define MAX_DIST 40.0
#define SURF_DIST 0.001

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float getSceneSDF(vec3 p) {
  float t = uTime * 0.12;
  vec2 mPos = (uMouse - 0.5) * 6.5;

  // Mouse-reactive main fluid node
  float d = length(p - vec3(mPos.x, mPos.y, 1.2)) - 0.9;

  // 8 Primary organic mercury fluid bodies (forming the lush left and right fluid frames)
  for(int i = 0; i < 8; i++) {
      float fi = float(i);
      vec3 pos = vec3(
          sin(t * 0.7 + fi * 1.5) * 3.8,
          cos(t * 0.5 + fi * 2.2) * 2.2,
          sin(t * 0.9 + fi * 0.8) * 1.0
      );
      vec3 p_str = p - pos;
      p_str.y *= 0.8 + 0.3 * sin(t + fi);
      float r = 0.5 + 0.3 * sin(t * 0.8 + fi);
      d = smin(d, length(p_str) - r, 1.1);
  }

  // 16 Micro fluid beads / mercury satellites
  for(int j = 0; j < 16; j++) {
      float fj = float(j);
      vec3 pos = vec3(
          sin(t * 1.3 + fj * 4.1) * 5.2,
          cos(t * 1.0 + fj * 2.8) * 3.6,
          sin(t * 1.6 + fj * 0.7) * 0.8
      );
      float r = 0.08 + 0.2 * abs(cos(t * 1.8 + fj * 1.2));
      d = smin(d, length(p - pos) - r, 0.45);
  }

  // Surface micro-ripples
  d += sin(p.x * 2.5 + t) * sin(p.y * 2.5 + t) * 0.06;
  return d;
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  vec3 n = vec3(
      getSceneSDF(p + e.xyy) - getSceneSDF(p - e.xyy),
      getSceneSDF(p + e.yxy) - getSceneSDF(p - e.yxy),
      getSceneSDF(p + e.yyx) - getSceneSDF(p - e.yyx)
  );
  return normalize(n);
}

vec3 getEnvironment(vec3 r) {
  vec3 col = vec3(1.0);
  float overhead = smoothstep(-0.5, 0.5, r.y);
  col = mix(vec3(0.85, 0.9, 0.96), vec3(1.0), overhead);

  // Directional Studio Softboxes & Light Bars
  float bar1 = pow(max(0.0, dot(r, normalize(vec3(1.5, 0.2, -0.8)))), 24.0);
  float bar2 = pow(max(0.0, dot(r, normalize(vec3(-1.2, 0.1, -0.4)))), 32.0);
  col += vec3(1.8) * bar1 * overhead;
  col += vec3(1.2) * bar2 * (1.0 - overhead);

  // High-contrast Studio Occlusion Panels (Giving that deep liquid chrome mirror contrast)
  float panelA = smoothstep(0.4, 0.9, abs(r.x));
  float panelB = smoothstep(0.2, 0.7, abs(r.z));
  col = mix(col, vec3(0.0), panelA * 0.85 * (1.0 - overhead));
  col = mix(col, vec3(0.01), panelB * 0.65);

  // Gloss striping
  float strips = pow(abs(cos(r.x * 2.5 + r.z * 1.5 + uTime * 0.05)), 60.0);
  col = mix(col, vec3(1.5), strips * 0.4 * overhead);
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  vec3 ro = vec3(0.0, 0.0, -8.2);
  vec3 rd = normalize(vec3(uv, 3.2));

  float dTotal = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * dTotal;
      float dS = getSceneSDF(p);
      dTotal += dS;
      if(dTotal > MAX_DIST || abs(dS) < SURF_DIST) break;
  }

  // Pristine white studio backdrop
  vec3 col = vec3(1.0);

  if(dTotal < MAX_DIST) {
      vec3 p = ro + rd * dTotal;
      vec3 n = getNormal(p);
      vec3 v = -rd;
      vec3 r = reflect(rd, n);
      vec3 reflection = getEnvironment(r);
      col = reflection * vec3(0.98, 0.99, 1.0);

      // Dynamic Specular Highlights from Pointer Light Source
      vec3 lightPos = normalize(vec3((uMouse.x - 0.5) * 15.0, (uMouse.y - 0.5) * 15.0 + 5.0, -3.5));
      float specPeak = pow(max(0.0, dot(reflect(-lightPos, n), v)), 4000.0);
      col += vec3(3.5) * specPeak;

      // Fresnel Rim Reflection
      float fres = pow(1.0 - max(0.0, dot(n, v)), 6.0);
      col = mix(col, vec3(1.0), fres * 0.75);
      col += fres * vec3(0.6, 0.8, 1.2) * 0.6;

      // Soft Secondary Specular
      float specSoft = pow(max(0.0, dot(reflect(-lightPos, n), v)), 64.0);
      col += vec3(0.4, 0.6, 1.0) * specSoft * 0.35;

      // Curvature Darkening for liquid depth
      float curve = 1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0)));
      col *= mix(1.0, 0.7, pow(curve, 3.5));
  }

  col = pow(col, vec3(0.85));
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const LiquidChromeCanvas: React.FC<{ className?: string }> = ({
  className = 'fixed inset-0 z-0 pointer-events-none',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            window.innerWidth * dpr,
            window.innerHeight * dpr
          ),
        },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX / window.innerWidth;
        mouse.targetY = 1.0 - e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(currentDpr);
      material.uniforms.uResolution.value.set(w * currentDpr, h * currentDpr);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;

      // Smooth mouse interpolation (inertia)
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};
