"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { heroNodes, nodePosition } from "./nodes";

/**
 * Hero visual: a luminous intelligence core connected to six business
 * functions. Lightweight by design — basic materials, additive sprites,
 * ~1 draw call per element, no post-processing, paused when off-screen.
 */

export interface SceneProps {
  activeId: string | null;
  hoverId: string | null;
  labelRefs: MutableRefObject<(HTMLElement | null)[]>;
  reducedMotion: boolean;
  lowPower: boolean;
  running: boolean;
  onReady?: () => void;
}

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(0.45, "rgba(255,255,255,0.14)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Network({ activeId, hoverId, labelRefs, reducedMotion, lowPower }: Omit<SceneProps, "running" | "onReady">) {
  const { camera, size, gl, invalidate } = useThree();

  // In reduced-motion ("demand") mode, redraw when the selection changes.
  useEffect(() => {
    invalidate();
  }, [activeId, hoverId, invalidate]);
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0, cx: -9999, cy: -9999, inside: false });

  const glow = useMemo(() => makeGlowTexture(), []);

  // Nodes, spokes, ring links and data packets — built once.
  const parts = useMemo(() => {
    const nodes = heroNodes.map((n) => {
      const color = new THREE.Color(n.color);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), new THREE.MeshBasicMaterial({ color }));
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      halo.scale.setScalar(0.9);
      const group = new THREE.Group();
      group.add(mesh, halo);
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const spoke = new THREE.Line(spokeGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }));
      const packet = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      packet.scale.setScalar(0.22);
      return { def: n, group, mesh, halo, spoke, packet, base: new THREE.Vector3(), pos: new THREE.Vector3(), proximity: 0 };
    });
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nodes.length * 2 * 3), 3));
    const ring = new THREE.LineSegments(
      ringGeo,
      new THREE.LineBasicMaterial({ color: new THREE.Color("#00C9E8"), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    return { nodes, ring };
  }, [glow]);

  const particles = useMemo(() => {
    const count = lowPower ? 140 : 360;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [lowPower]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      const r = gl.domElement.getBoundingClientRect();
      pointer.current.cx = e.clientX - r.left;
      pointer.current.cy = e.clientY - r.top;
      pointer.current.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useEffect(
    () => () => {
      parts.nodes.forEach((n) => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
        (n.halo.material as THREE.Material).dispose();
        n.spoke.geometry.dispose();
        (n.spoke.material as THREE.Material).dispose();
        (n.packet.material as THREE.Material).dispose();
      });
      parts.ring.geometry.dispose();
      glow.dispose();
      particles.dispose();
    },
    [parts, glow, particles],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const aspect = size.width / Math.max(1, size.height);
    const layoutScale = Math.min(1, Math.max(0.6, aspect / 1.45));

    // Parallax + scroll response
    if (root.current) {
      const targetY = reducedMotion ? 0 : pointer.current.x * 0.22;
      const targetX = reducedMotion ? 0 : -pointer.current.y * 0.12;
      root.current.rotation.y += (targetY - root.current.rotation.y) * Math.min(1, delta * 2.5);
      root.current.rotation.x += (targetX - root.current.rotation.x) * Math.min(1, delta * 2.5);
      const progress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      root.current.position.y = reducedMotion ? 0 : progress * 1.1;
      root.current.scale.setScalar(1 - progress * 0.12);
    }
    if (core.current && !reducedMotion) {
      core.current.rotation.y = t * 0.25;
      core.current.rotation.z = Math.sin(t * 0.3) * 0.1;
      const pulse = 1 + Math.sin(t * 1.6) * 0.04;
      core.current.scale.setScalar(pulse);
    }
    if (shell.current && !reducedMotion) shell.current.rotation.x = t * 0.12;
    if (particlesRef.current && !reducedMotion) particlesRef.current.rotation.y = t * 0.015;

    const ringPos = parts.ring.geometry.getAttribute("position") as THREE.BufferAttribute;
    const n = parts.nodes.length;

    parts.nodes.forEach((node, i) => {
      const p = nodePosition(node.def.angle, layoutScale);
      node.base.set(p.x, p.y, p.z);
      node.pos.copy(node.base);
      if (!reducedMotion) node.pos.y += Math.sin(t * 0.8 + i * 1.3) * 0.07;
      node.group.position.copy(node.pos);

      // Spoke from core to node
      const sp = node.spoke.geometry.getAttribute("position") as THREE.BufferAttribute;
      sp.setXYZ(0, 0, 0, 0);
      sp.setXYZ(1, node.pos.x, node.pos.y, node.pos.z);
      sp.needsUpdate = true;

      // Screen projection → HTML label position + pointer proximity
      tmp.copy(node.pos);
      root.current?.localToWorld(tmp);
      tmp.project(camera);
      const sx = (tmp.x * 0.5 + 0.5) * size.width;
      const sy = (-tmp.y * 0.5 + 0.5) * size.height;
      const label = labelRefs.current[i];
      if (label) {
        label.style.left = `${sx}px`;
        label.style.top = `${sy}px`;
      }
      const dist = pointer.current.inside ? Math.hypot(pointer.current.cx - sx, pointer.current.cy - sy) : 9999;
      const prox = Math.max(0, 1 - dist / 220);
      node.proximity += (prox - node.proximity) * Math.min(1, delta * 6);

      const selected = activeId === node.def.id || hoverId === node.def.id;
      const emphasis = Math.max(node.proximity, selected ? 1 : 0);
      const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 2 + i) * 0.12;
      node.halo.scale.setScalar((0.8 + emphasis * 0.9) * pulse);
      (node.halo.material as THREE.SpriteMaterial).opacity = 0.45 + emphasis * 0.45;
      node.mesh.scale.setScalar(1 + emphasis * 0.45);
      (node.spoke.material as THREE.LineBasicMaterial).opacity = 0.22 + emphasis * 0.55;

      // Data packet travelling core → node
      const k = reducedMotion ? 0.6 : (t * 0.32 + i * 0.17) % 1;
      node.packet.position.copy(node.pos).multiplyScalar(k);
      (node.packet.material as THREE.SpriteMaterial).opacity = Math.sin(k * Math.PI) * (0.55 + emphasis * 0.45);

      // Ring link to next node
      const next = parts.nodes[(i + 1) % n]!;
      ringPos.setXYZ(i * 2, node.pos.x, node.pos.y, node.pos.z);
      ringPos.setXYZ(i * 2 + 1, next.pos.x, next.pos.y, next.pos.z);
    });
    ringPos.needsUpdate = true;
  });

  return (
    <group ref={root}>
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial size={0.03} color="#9DC0FF" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
      </points>

      <group ref={core}>
        <mesh>
          <sphereGeometry args={[0.42, 48, 48]} />
          <meshBasicMaterial color="#EAF3FF" />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshBasicMaterial color="#2864FF" wireframe transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.25, 0.006, 8, 120]} />
          <meshBasicMaterial color="#00C9E8" transparent opacity={0.6} />
        </mesh>
        <sprite scale={[3.6, 3.6, 1]}>
          <spriteMaterial map={glow} color="#2864FF" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        <sprite scale={[1.6, 1.6, 1]}>
          <spriteMaterial map={glow} color="#ffffff" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>

      <primitive object={parts.ring} />
      {parts.nodes.map((node) => (
        <group key={node.def.id}>
          <primitive object={node.spoke} />
          <primitive object={node.packet} />
          <primitive object={node.group} />
        </group>
      ))}
    </group>
  );
}

export default function HeroScene(props: SceneProps) {
  const { running, reducedMotion, lowPower, onReady, ...rest } = props;
  return (
    <Canvas
      onCreated={() => onReady?.()}
      className="!absolute inset-0"
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "low-power" }}
      frameloop={running ? (reducedMotion ? "demand" : "always") : "never"}
      aria-hidden
    >
      <Network {...rest} reducedMotion={reducedMotion} lowPower={lowPower} />
    </Canvas>
  );
}
