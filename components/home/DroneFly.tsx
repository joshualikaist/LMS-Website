"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./DroneFly.module.css";

type Quad = {
  drone: THREE.Group;
  props: THREE.Group[];
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
};

function add<T extends THREE.BufferGeometry>(list: THREE.BufferGeometry[], geo: T): T {
  list.push(geo);
  return geo;
}

function makeQuad(): Quad {
  const geometries: THREE.BufferGeometry[] = [];
  const dark = new THREE.MeshStandardMaterial({
    color: 0x1c2026,
    metalness: 0.52,
    roughness: 0.4,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0x4a515a,
    metalness: 0.72,
    roughness: 0.28,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0xc45c2a,
    metalness: 0.35,
    roughness: 0.42,
  });
  const blade = new THREE.MeshStandardMaterial({
    color: 0x6a717a,
    metalness: 0.2,
    roughness: 0.48,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
  });
  const disc = new THREE.MeshStandardMaterial({
    color: 0x8a9098,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const materials = [dark, metal, accent, blade, disc];

  const drone = new THREE.Group();
  const body = new THREE.Mesh(add(geometries, new THREE.BoxGeometry(0.34, 0.1, 0.24)), dark);
  drone.add(body);

  const battery = new THREE.Mesh(add(geometries, new THREE.BoxGeometry(0.2, 0.05, 0.13)), metal);
  battery.position.y = 0.075;
  drone.add(battery);

  const cam = new THREE.Mesh(add(geometries, new THREE.BoxGeometry(0.07, 0.05, 0.08)), accent);
  cam.position.set(0, -0.055, 0.13);
  drone.add(cam);

  const lens = new THREE.Mesh(add(geometries, new THREE.CylinderGeometry(0.02, 0.02, 0.022, 16)), metal);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, -0.055, 0.175);
  drone.add(lens);

  const arms = new THREE.Group();
  arms.rotation.y = Math.PI / 4;
  const armGeo = add(geometries, new THREE.BoxGeometry(1.18, 0.036, 0.055));
  arms.add(new THREE.Mesh(armGeo, dark));
  const cross = new THREE.Mesh(armGeo, dark);
  cross.rotation.y = Math.PI / 2;
  arms.add(cross);
  drone.add(arms);

  const motorGeo = add(geometries, new THREE.CylinderGeometry(0.055, 0.055, 0.05, 18));
  const bladeGeo = add(geometries, new THREE.BoxGeometry(0.5, 0.006, 0.034));
  const discGeo = add(geometries, new THREE.CircleGeometry(0.25, 28));
  const legGeo = add(geometries, new THREE.CylinderGeometry(0.01, 0.012, 0.12, 8));
  const props: THREE.Group[] = [];
  const motors: Array<[number, number, number]> = [
    [0.56, 0.04, 0],
    [-0.56, 0.04, 0],
    [0, 0.04, 0.56],
    [0, 0.04, -0.56],
  ];

  for (const [x, y, z] of motors) {
    const motor = new THREE.Group();
    motor.position.set(x, y, z);
    motor.add(new THREE.Mesh(motorGeo, metal));
    const prop = new THREE.Group();
    prop.position.y = 0.04;
    const b1 = new THREE.Mesh(bladeGeo, blade);
    const b2 = new THREE.Mesh(bladeGeo, blade);
    b2.rotation.y = Math.PI / 2;
    const ring = new THREE.Mesh(discGeo, disc);
    ring.rotation.x = -Math.PI / 2;
    prop.add(b1, b2, ring);
    motor.add(prop);
    const leg = new THREE.Mesh(legGeo, dark);
    leg.position.y = -0.08;
    motor.add(leg);
    arms.add(motor);
    props.push(prop);
  }

  return { drone, props, materials, geometries };
}

export default function DroneFly() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.68, y: 0.42 };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      window.removeEventListener("pointermove", onMove);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    const { drone, props, materials, geometries } = makeQuad();
    drone.scale.setScalar(1.12);
    scene.add(drone);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 32),
      new THREE.MeshBasicMaterial({
        color: 0x14202a,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);
    geometries.push(shadow.geometry);
    materials.push(shadow.material as THREE.Material);

    scene.add(new THREE.AmbientLight(0xffffff, 0.92));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(3.2, 5.2, 2.4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdde4ec, 0.35);
    fill.position.set(-3.4, 1.6, -2.2);
    scene.add(fill);

    const setView = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      const mobile = w < 720;
      camera.position.set(mobile ? 0.05 : 0.15, mobile ? 1.35 : 0.72, mobile ? 4.4 : 3.55);
      camera.lookAt(mobile ? 0 : 0.72, 0.08, 0);
      drone.position.set(mobile ? 0 : 0.78, 0.12, 0);
    };
    setView();
    const onResize = () => setView();
    window.addEventListener("resize", onResize);

    let frame = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      if (reduce) {
        drone.rotation.set(-0.16, 0.62, 0.1);
        drone.position.y = 0.12;
      } else {
        const yaw = (pointer.x - 0.5) * Math.PI * 1.25;
        const pitch = (0.44 - pointer.y) * 1.05;
        const roll = (pointer.x - 0.5) * 0.3;
        drone.rotation.y = THREE.MathUtils.damp(drone.rotation.y, yaw, 4.2, dt);
        drone.rotation.x = THREE.MathUtils.damp(drone.rotation.x, pitch, 4.2, dt);
        drone.rotation.z = THREE.MathUtils.damp(drone.rotation.z, roll, 5.2, dt);
        drone.position.y = 0.12 + Math.sin(t * 1.15) * 0.035;
        for (const prop of props) prop.rotation.y += dt * 26;
      }
      shadow.position.set(drone.position.x, -0.52, drone.position.z);
      shadow.scale.setScalar(0.92 + drone.position.y * 0.18);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      renderer.domElement.remove();
      for (const geo of geometries) geo.dispose();
      for (const mat of materials) mat.dispose();
    };
  }, []);

  return <div ref={wrapRef} className={styles.wrap} aria-hidden="true" />;
}
