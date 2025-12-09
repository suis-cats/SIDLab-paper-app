"use client";

import { useRef, useState, useMemo } from "react";
import { Float, Html, View, PerspectiveCamera, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Achievement } from "./types";
import { clsx } from "clsx";
import * as THREE from "three";

interface Props {
  achievement: Achievement;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  unlocked?: boolean;
  debugLayer?: "all" | "body" | "rim" | "icon";
}

function BadgeModel({ achievement, interactive, unlocked, debugLayer = "all" }: { achievement: Achievement, interactive?: boolean, unlocked?: boolean, debugLayer?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  const targetRotation = useRef(new THREE.Vector2(0, 0));
    
    // Smooth interaction logic
    const handlePointerMove = (e: any) => {
        if (!interactive) return;
        // Calculate tilt based on intersection point relative to center
        // e.point is in world space. Since badge is at ~0,0,0 local, we can use it directly
        // Multiply by sensitivity factor
        const x = e.point.x * 2.5; 
        const y = e.point.y * 2.5;
        targetRotation.current.set(y, x);
    };

    const handlePointerLeave = () => {
        setHover(false);
        targetRotation.current.set(0, 0);
    };

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        // Smoothly interpolate current rotation to target rotation
        // Damping factor: 5 * delta (adjust for speed/weight)
        const damping = 8 * delta;
        
        // Default floating animation when not interacting
        if (!hovered) {
             const floatX = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
             const floatY = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
             groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, floatX, damping);
             groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, floatY, damping);
        } else {
             // Interactive tilt
             // Note: Mouse X affects Rotation Y, Mouse Y affects Rotation X
             groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, damping);
             groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, damping);
        }
    });

  // Color & Material Logic
  const visualStyle = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < achievement.id.length; i++) hash = achievement.id.charCodeAt(i) + ((hash << 5) - hash);
    
    const h = Math.abs(hash % 360);
    return {
        // More vibrant, premium colors
        color: `hsl(${h}, 85%, 55%)`,
        rimColor: `hsl(${h}, 90%, 85%)`,
    };
  }, [achievement.id]);

  const mainColor = unlocked ? visualStyle.color : "#3a3a3a";
  const rimColor = unlocked ? visualStyle.rimColor : "#5a5a5a";
  const emissiveColor = unlocked ? visualStyle.color : "#000000"; 
  const envMapIntensity = unlocked ? 1.5 : 0.5;

  const showBody = debugLayer === "all" || debugLayer === "body";
  const showRim = debugLayer === "all" || debugLayer === "rim";
  const showIcon = debugLayer === "all" || debugLayer === "icon";

  return (
    <group 
        ref={groupRef} 
        rotation={[0.2, 0, 0]} // Slight initial tilt to catch light
        onPointerOver={() => interactive && setHover(true)}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerLeave}
    >
        {/* Main Body - Coin Base */}
        {showBody && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1, 1, 0.15, 64]} />
                <meshPhysicalMaterial 
                    color={mainColor}
                    metalness={0.8}       // Reduced slightly to show more color
                    roughness={0.1}       // Very smooth/shiny
                    clearcoat={1.0}       // Clearcoat for that "Apple" glass/polish finish
                    clearcoatRoughness={0.05} // Glass-like finish
                    reflectivity={1.0}
                    emissive={emissiveColor} // Ensure it's not pitch black in shadows
                    emissiveIntensity={0.25} 
                    envMapIntensity={envMapIntensity}
                />
            </mesh>
        )}

        {/* Rim - Face Border */}
        {showRim && (
            <group>
                {/* Outer Edge Ring */}
                <mesh>
                    <torusGeometry args={[1, 0.05, 16, 64]} />
                    <meshPhysicalMaterial 
                        color={rimColor} 
                        metalness={0.9} 
                        roughness={0.1}
                        clearcoat={1.0}
                        emissive={rimColor}
                        emissiveIntensity={0.2}
                    />
                </mesh>
                
                {/* Inner Face Border (The "Badge" Rim) */}
                <mesh position={[0, 0, 0.08]}>
                    <torusGeometry args={[0.9, 0.04, 16, 64]} />
                     <meshPhysicalMaterial 
                        color={rimColor} 
                        metalness={0.8} 
                        roughness={0.2} 
                        clearcoat={1.0}
                    />
                </mesh>
            </group>
        )}

        {/* Icon Overlay */}
        {showIcon && (
            <Html
                transform
                position={[0, 0, 0.09]} // Slightly above the surface
                scale={0.5} 
                style={{
                    pointerEvents: "none",
                    userSelect: "none",
                    width: "120px",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    zIndex: 10,
                    // Add subtle glow to icon
                    filter: unlocked ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))" : "none"
                }}
                as="div"
            >
                <div className={`flex items-center justify-center ${unlocked ? "text-white" : "text-gray-400 opacity-50"}`}>
                    <achievement.icon size={100} strokeWidth={2.5} />
                </div>
            </Html>
        )}
    </group>
  );
}

export default function PremiumBadge({ achievement, size = "md", interactive = true, unlocked = true, debugLayer = "all" }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Bigger sizes by default
    const sizeClasses = {
        sm: "w-20 h-20",
        md: "w-32 h-32",
        lg: "w-56 h-56",
        xl: "w-72 h-72" 
    };

    return (
        <div ref={containerRef} className={clsx("relative", sizeClasses[size])}>
            <View className="absolute inset-0 w-full h-full" track={containerRef as any}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                
                {/* Local lights removed to prevent stacking. Using global SceneCanvas lights. */}

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <BadgeModel achievement={achievement} interactive={interactive} unlocked={unlocked} debugLayer={debugLayer} />
                </Float>
            </View>
        </div>
    );
}
