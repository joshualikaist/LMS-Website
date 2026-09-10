"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./DroneFly.module.css";

type Mini = {
  drone: THREE.Group;
  props: THREE.Group[];
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
};

function track<T extends THREE.BufferGeometry>(list: THREE.BufferGeometry[], geo: T): T {
  list.push(geo);
  return geo;
}

function roundedBox(width: number, height: number, depth: number, radius: number) {
  const shape = new THREE.Shape();
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(radius, w - 0.001, d - 0.001);
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w, d - r);
  shape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w + r, d);
  shape.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w, -d + r);
  shape.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 12,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  return geo;
}

function makeMini(): Mini {
  const geometries: THREE.BufferGeometry[] = [];
  const white = new THREE.MeshPhysicalMaterial({
    color: 0xf3f3f1,
    roughness: 0.38,
    metalness: 0.04,
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
  });
  const plastic = new THREE.MeshPhysicalMaterial({
    color: 0xe8e8e6,
    roughness: 0.46,
    metalness: 0.03,
  });
  const charcoal = new THREE.MeshStandardMaterial({
    color: 0x2b2e33,
    roughness: 0.55,
    metalness: 0.12,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: 0xf27a2a,
    roughness: 0.42,
    metalness: 0.08,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x15181c,
    roughness: 0.12,
    metalness: 0.55,
    clearcoat: 0.8,
  });
  const materials = [white, plastic, charcoal, orange, glass];

  const drone = new THREE.Group();
  const body = new THREE.Mesh(track(geometries, roundedBox(0.3, 0.11, 0.36, 0.045)), white);
  drone.add(body);

  const top = new THREE.Mesh(track(geometries, roundedBox(0.2, 0.02, 0.16, 0.03)), plastic);
  top.position.set(0, 0.062, -0.02);
  drone.add(top);

  const eyeGeo = track(geometries, new THREE.SphereGeometry(0.028, 20, 14));
  for (const x of [-0.04, 0.04]) {
    const eye = new THREE.Mesh(eyeGeo, glass);
    eye.scale.set(1, 1, 0.55);
    eye.position.set(x, 0.012, 0.168);
    drone.add(eye);
  }

  const gimbal = new THREE.Group();
  gimbal.position.set(0, -0.095, 0.07);
  const ball = new THREE.Mesh(track(geometries, new THREE.SphereGeometry(0.048, 20, 16)), charcoal);
  ball.scale.set(1.05, 0.88, 1.15);
  const cam = new THREE.Mesh(track(geometries, new THREE.CylinderGeometry(0.02, 0.023, 0.036, 18)), glass);
  cam.rotation.x = Math.PI / 2;
  cam.position.z = 0.038;
  gimbal.add(ball, cam);
  drone.add(gimbal);

  const armGeo = track(geometries, new THREE.BoxGeometry(0.048, 0.032, 0.34));
  const motorGeo = track(geometries, new THREE.CylinderGeometry(0.048, 0.052, 0.046, 20));
  const capGeo = track(geometries, new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16));
  const bladeGeo = track(geometries, new THREE.BoxGeometry(0.5, 0.004, 0.03));
  const tipGeo = track(geometries, new THREE.BoxGeometry(0.055, 0.005, 0.03));
  const props: THREE.Group[] = [];
  const yaws = [Math.PI / 4, -Math.PI / 4, (Math.PI * 3) / 4, (-Math.PI * 3) / 4];

  for (const yaw of yaws) {
    const arm = new THREE.Group();
    arm.rotation.y = yaw;
    const beam = new THREE.Mesh(armGeo, white);
    beam.position.set(0, -0.008, 0.22);
    const motor = new THREE.Mesh(motorGeo, white);
    motor.position.set(0, 0.018, 0.4);
    const cap = new THREE.Mesh(capGeo, plastic);
    cap.position.set(0, 0.044, 0.4);
    const prop = new THREE.Group();
    prop.position.set(0, 0.052, 0.4);
    const blade = new THREE.Mesh(bladeGeo, charcoal);
    const tipA = new THREE.Mesh(tipGeo, orange);
    const tipB = new THREE.Mesh(tipGeo, orange);
    tipA.position.x = 0.226;
    tipB.position.x = -0.226;
    prop.add(blade, tipA, tipB);
    arm.add(beam, motor, cap, prop);
    drone.add(arm);
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
    const pointer = { x: 0.72, y: 0.42 };
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);
    const { drone, props, materials, geometries } = makeMini();
    scene.add(drone);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.78, 36),
      new THREE.MeshBasicMaterial({
        color: 0x8a8e92,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.22;
    scene.add(shadow);
    geometries.push(shadow.geometry);
    materials.push(shadow.material as THREE.Material);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdedfe2, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(2.4, 4.2, 3.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.45);
    rim.position.set(-2.8, 1.8, -1.6);
    scene.add(rim);

    const rest = { x: -0.42, y: 0.58, z: 0.08 };
    drone.rotation.set(rest.x, rest.y, rest.z);

    const setView = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      camera.position.set(1.35, 1.02, 1.55);
      camera.lookAt(0, 0.02, 0);
    };
    setView();
    window.addEventListener("resize", setView);

    let frame = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      if (reduce) {
        drone.rotation.set(rest.x, rest.y, rest.z);
        drone.position.y = 0;
      } else {
        drone.rotation.y = THREE.MathUtils.damp(
          drone.rotation.y,
          rest.y + (pointer.x - 0.5) * 1.15,
          4,
          dt,
        );
        drone.rotation.x = THREE.MathUtils.damp(
          drone.rotation.x,
          rest.x + (0.45 - pointer.y) * 0.7,
          4,
          dt,
        );
        drone.rotation.z = THREE.MathUtils.damp(
          drone.rotation.z,
          rest.z + (pointer.x - 0.5) * 0.16,
          5,
          dt,
        );
        drone.position.y = Math.sin(t * 1.05) * 0.025;
        for (const prop of props) prop.rotation.y += dt * 14;
      }
      shadow.position.x = drone.position.x;
      shadow.position.z = drone.position.z;
      shadow.scale.setScalar(1 + drone.position.y * 0.4);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", setView);
      renderer.dispose();
      renderer.domElement.remove();
      for (const geo of geometries) geo.dispose();
      for (const mat of materials) mat.dispose();
    };
  }, []);

  return <div ref={wrapRef} className={styles.wrap} aria-hidden="true" />;
}
