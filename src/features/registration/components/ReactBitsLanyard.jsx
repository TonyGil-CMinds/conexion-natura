/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './ReactBitsLanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB = '/lanyard/card.glb';
const DEFAULT_LANYARD = '/lanyard/lanyard.png';
const BLANK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true,
  frontImage = null, backImage = null, imageFit = 'cover', lanyardImage = null, lanyardWidth = 1,
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }} dpr={[1, isMobile ? 1.5 : 2]} gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={1.1} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band {...{ isMobile, frontImage, backImage, imageFit, lanyardImage, lanyardWidth }} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={.8} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, .1, 1]} />
          <Lightformer intensity={1.2} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, .1, 1]} />
          <Lightformer intensity={1.2} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, .1, 1]} />
          <Lightformer intensity={3} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile, frontImage, backImage, imageFit, lanyardImage, lanyardWidth }) {
  const band = useRef(); const fixed = useRef(); const j1 = useRef(); const j2 = useRef(); const j3 = useRef(); const card = useRef();
  const vec = new THREE.Vector3(); const ang = new THREE.Vector3(); const rot = new THREE.Vector3(); const dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(CARD_GLB);
  const texture = useTexture(lanyardImage || DEFAULT_LANYARD);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;
    const base = baseMap.image; const canvas = document.createElement('canvas'); canvas.width = base.width; canvas.height = base.height;
    const context = canvas.getContext('2d'); if (!context) return baseMap;
    context.drawImage(base, 0, 0, canvas.width, canvas.height);
    const drawFitted = (image, rect) => {
      const x = rect.x * canvas.width; const y = rect.y * canvas.height; const width = rect.w * canvas.width; const height = rect.h * canvas.height;
      const scale = (imageFit === 'contain' ? Math.min : Math.max)(width / image.width, height / image.height);
      const dw = image.width * scale; const dh = image.height * scale;
      context.save(); context.beginPath(); context.rect(x, y, width, height); context.clip();
      context.drawImage(image, x + (width - dw) / 2, y + (height - dh) / 2, dw, dh); context.restore();
    };
    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);
    const composite = new THREE.CanvasTexture(canvas); composite.colorSpace = THREE.SRGBColorSpace; composite.flipY = baseMap.flipY; composite.anisotropy = 16; composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false); const [hovered, hover] = useState(false);
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]); useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]); useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]); useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);
  useEffect(() => { if (!hovered) return; document.body.style.cursor = dragged ? 'grabbing' : 'grab'; return () => { document.body.style.cursor = 'auto'; }; }, [hovered, dragged]);
  useFrame((state, delta) => {
    if (dragged) { vec.set(state.pointer.x, state.pointer.y, .5).unproject(state.camera); dir.copy(vec).sub(state.camera.position).normalize(); vec.add(dir.multiplyScalar(state.camera.position.length())); [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp()); card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z }); }
    if (!fixed.current || !band.current || !j1.current || !j2.current || !j3.current || !card.current) return;
    [j1, j2].forEach((ref) => { if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation()); const distance = Math.max(.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))); ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + distance * (maxSpeed - minSpeed))); });
    curve.points[0].copy(j3.current.translation()); curve.points[1].copy(j2.current.lerped); curve.points[2].copy(j1.current.lerped); curve.points[3].copy(fixed.current.translation()); band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32)); ang.copy(card.current.angvel()); rot.copy(card.current.rotation()); card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * .25, z: ang.z });
  });
  curve.curveType = 'chordal'; texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return <>
    <group position={[0, 4, 0]}>
      <RigidBody ref={fixed} {...segmentProps} type="fixed" />
      <RigidBody position={[.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[.1]} /></RigidBody>
      <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[.1]} /></RigidBody>
      <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[.1]} /></RigidBody>
      <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
        <CuboidCollider args={[.8, 1.125, .01]} />
        <group scale={2.25} position={[0, -1.2, -.05]} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} onPointerUp={(event) => { event.target.releasePointerCapture(event.pointerId); drag(false); }} onPointerDown={(event) => { event.target.setPointerCapture(event.pointerId); drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation()))); }}>
          <mesh geometry={nodes.card.geometry}><meshPhysicalMaterial map={cardMap} map-anisotropy={16} clearcoat={isMobile ? 0 : .35} clearcoatRoughness={.3} roughness={.98} metalness={.3} /></mesh>
          <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={.3} />
          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </RigidBody>
    </group>
    <mesh ref={band}><meshLineGeometry /><meshLineMaterial color="white" depthTest={false} resolution={isMobile ? [1000, 2000] : [1000, 1000]} useMap map={texture} repeat={[-2.4, 1]} lineWidth={lanyardWidth} /></mesh>
  </>;
}
