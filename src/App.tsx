import{useEffect,useRef,useState}from"react";
import gsap from"gsap";
import{ArrowLeft,ArrowRight,Maximize2,Play,Pause,RotateCcw,ChevronLeft,ChevronRight,Mail}from"lucide-react";
import{slides}from"./slides";
import{Canvas,useFrame}from"@react-three/fiber";
import{OrbitControls,Grid}from"@react-three/drei";
import{Group}from"three";
function AnimatedBlockStack({count,loop}:{count:number,loop:boolean}){const group=useRef<Group>(null);useFrame((_,delta)=>{if(group.current)group.current.rotation.y+=delta*.16});return <group ref={group}>{Array.from({length:count},(_,i)=><mesh key={i} position={[0,(i-count/2)*.24,0]} castShadow receiveShadow><boxGeometry args={[2.5,.16,.9]}/><meshStandardMaterial color={loop?(i%4===0?"#f2d34f":"#315f9d"):"#9bb4ca"} metalness={.12} roughness={.48}/></mesh>)}</group>}
function Stack3D({count=8,active=0,loop=false}:{count?:number,active?:number,loop?:boolean}){return <div className="stack3d-wrap webgl-stack"><Canvas camera={{position:[4,3.2,5],fov:42}} shadows><ambientLight intensity={.85}/><directionalLight position={[4,7,5]} intensity={1.7} castShadow/><pointLight position={[-4,2,-3]} intensity={.55} color="#f2d34f"/><Grid position={[0,-count*.13-.2,0]} args={[8,8]} cellColor="#c8d6e2" sectionColor="#7893ad" fadeDistance={14}/><AnimatedBlockStack count={count} loop={loop}/><OrbitControls enablePan={false} minDistance={4} maxDistance={9} maxPolarAngle={Math.PI/1.8}/></Canvas>{loop&&<div className="loop-orbit"><span>↻</span><b>REPEAT × 4</b></div>}</div>}
