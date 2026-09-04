"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/yaskawa-arm.glb";

// The one number that controls how big the arm renders. Edit this directly
// to resize it — unlike the one-time setup effect below (which is guarded
// against re-running and won't pick up edits without a full page reload),
// this constant is read every frame in useFrame, so a saved edit here takes
// effect on the very next frame with no reload needed. Comfortable range is
// roughly 1.5-2.5; past ~3 the tool tip/base start clipping past the frame
// regardless of container size (the camera's FOV/distance are fixed, so
// this constant is the only thing that changes the arm's on-screen size).
const ARM_SCALE = 1.5;

// Which way the arm faces, as a Y-axis rotation in radians (Math.PI = 180°).
// Same live-editing note as ARM_SCALE above: this is read every frame, so
// editing it takes effect on save, no reload needed. Math.PI is the
// current "face the text column" orientation; 0 (or 2 * Math.PI, same
// angle) faces the opposite way — a 180° turn from here.
const ARM_YAW = -1;

// This GLB is a SolidWorks assembly export: five separate rigid meshes
// (base + 4 links), each already positioned in its assembled pose, with no
// bones/joints/animation baked in. We reconstruct a kinematic chain from
// their names + relative Y-height (base -> shoulder -> elbow -> wrist -> tool)
// and animate small rotations on top of each link's original "rest" pose.
const CHAIN = ["BASE-1", "LINK_1-1", "LINK_2-1", "LINK_4-1", "LINK_3-1"] as const;

function applyLocalTilt(
  obj: THREE.Object3D,
  rest: THREE.Quaternion,
  axis: THREE.Vector3,
  angle: number
) {
  const delta = new THREE.Quaternion().setFromAxisAngle(axis, angle);
  obj.quaternion.copy(rest).multiply(delta);
}

function CameraAim() {
  useFrame(({ camera }) => camera.lookAt(0, 0, 0));
  return null;
}

function RobotArm() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null!);
  const baseRef = useRef<THREE.Object3D | null>(null);
  const link2Ref = useRef<THREE.Object3D | null>(null);
  const link4Ref = useRef<THREE.Object3D | null>(null);
  const restQuats = useRef(new Map<THREE.Object3D, THREE.Quaternion>());
  const maxDimRef = useRef(1);
  const initialized = useRef(false);

  const model = useMemo(() => scene, [scene]);

  useEffect(() => {
    if (initialized.current || !groupRef.current) return;
    initialized.current = true;

    const byName: Record<string, THREE.Object3D> = {};
    model.traverse((o) => {
      if (o.name) byName[o.name] = o;
    });

    const [base, link1, link2, link4, link3] = CHAIN.map((n) => byName[n]);
    if (!base || !link1 || !link2 || !link4 || !link3) return;

    // Reparent the flat SolidWorks export into a real kinematic chain.
    // .attach() preserves each part's current world transform while
    // recomputing its local transform under the new parent.
    base.attach(link1);
    link1.attach(link2);
    link2.attach(link4);
    link4.attach(link3);

    baseRef.current = base;
    link2Ref.current = link2;
    link4Ref.current = link4;
    restQuats.current.set(base, base.quaternion.clone());
    restQuats.current.set(link2, link2.quaternion.clone());
    restQuats.current.set(link4, link4.quaternion.clone());

    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // The source material is near-mirror (metalness 1, roughness 0.14),
        // which reads as flat black under direct lights alone — it really
        // wants an HDRI environment to reflect. Rather than pull one in
        // from a remote CDN (a real network dependency for a hero
        // animation), back the finish off slightly so the direct/fill
        // lights below are enough to model the form.
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && "metalness" in mat) {
          mat.metalness = 0.6;
          mat.roughness = Math.max(mat.roughness, 0.4);
        }
      }
    });

    // Center + normalize scale so the arm frames consistently in the canvas.
    const box = new THREE.Box3().setFromObject(base);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    base.position.sub(center);
    groupRef.current.add(base);
    maxDimRef.current = maxDim;
  }, [model]);

  const smoothedX = useRef(0);
  const smoothedY = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(ARM_SCALE / maxDimRef.current);
      groupRef.current.rotation.y = ARM_YAW;
    }

    const damp = 1 - Math.pow(0.001, delta);
    smoothedX.current = THREE.MathUtils.lerp(smoothedX.current, state.pointer.x, damp);
    smoothedY.current = THREE.MathUtils.lerp(smoothedY.current, state.pointer.y, damp);

    const base = baseRef.current;
    const link2 = link2Ref.current;
    const link4 = link4Ref.current;
    if (!base || !link2 || !link4) return;

    applyLocalTilt(
      base,
      restQuats.current.get(base)!,
      new THREE.Vector3(0, 1, 0),
      smoothedX.current * 0.4
    );
    // Per reference annotation (see chat): vertical pointer movement should
    // nod the tool up/down hinged at the ELBOW (link2 — where the forearm
    // rib meets the shoulder), not flick just the wrist. link4 (wrist) is
    // left at its rest pose and carried rigidly along as link2's child, so
    // the whole rib+wrist+tool swings as one piece from a single joint.
    applyLocalTilt(
      link2,
      restQuats.current.get(link2)!,
      new THREE.Vector3(1, 0, 0),
      -smoothedY.current * 0.35
    );
  });

  return <group ref={groupRef} />;
}

useGLTF.preload(MODEL_URL);

export function RobotArmScene() {
  return (
    <Canvas
      camera={{ position: [2.4, 1.3, 2.6], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.8} />
      {/* key */}
      <directionalLight position={[3, 5, 3]} intensity={2.4} />
      {/* fill, cool-toned to pick up the brand blue on the shadow side */}
      <directionalLight position={[-4, 1, -1]} intensity={1.1} color="#8CA0F0" />
      {/* rim, from behind to separate the silhouette from the backdrop */}
      <directionalLight position={[0, 3, -4]} intensity={1.4} color="#EEF0F2" />
      <CameraAim />
      <RobotArm />
    </Canvas>
  );
}
