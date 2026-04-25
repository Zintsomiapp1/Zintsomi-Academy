/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trees, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    BABYLON?: any;
  }
}

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });

const VRStoryForest = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supportsVR, setSupportsVR] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [inVR, setInVR] = useState(false);
  const [cluesFound, setCluesFound] = useState(0);
  const [message, setMessage] = useState('Find hidden story clues in the forest and bring them to Dr Sasa.');
  const xrExperienceRef = useRef<any>(null);
  const cluesFoundRef = useRef(0);
  const drSasaUnlockedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const checkVR = async () => {
      if (!navigator.xr) {
        setSupportsVR(false);
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        if (mounted) setSupportsVR(supported);
      } catch {
        if (mounted) setSupportsVR(false);
      }
    };

    checkVR();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || supportsVR !== true) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const init = async () => {
      try {
        await loadScript('https://cdn.babylonjs.com/babylon.js');
      } catch {
        setMessage('Could not load 3D engine. Check internet access and try again.');
        return;
      }

      if (disposed || !window.BABYLON || !canvasRef.current) return;

      const BABYLON = window.BABYLON;
      const engine = new BABYLON.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0.48, 0.76, 0.94, 1);

      const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 2, -12), scene);
      camera.setTarget(new BABYLON.Vector3(0, 2, 0));
      camera.attachControl(canvasRef.current, true);

      const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
      hemi.intensity = 0.9;
      const dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(-1, -2, 1), scene);
      dir.position = new BABYLON.Vector3(20, 25, -20);
      dir.intensity = 0.6;

      const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 80, height: 80 }, scene);
      const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
      groundMat.diffuseColor = new BABYLON.Color3(0.87, 0.78, 0.55);
      ground.material = groundMat;

      const hutBase = BABYLON.MeshBuilder.CreateCylinder('hutBase', { height: 4, diameter: 6 }, scene);
      hutBase.position = new BABYLON.Vector3(0, 2, 6);
      const hutRoof = BABYLON.MeshBuilder.CreateCylinder('hutRoof', { height: 2.5, diameterTop: 0.2, diameterBottom: 7, tessellation: 12 }, scene);
      hutRoof.position = new BABYLON.Vector3(0, 5, 6);
      const hutMat = new BABYLON.StandardMaterial('hutMat', scene);
      hutMat.diffuseColor = new BABYLON.Color3(0.59, 0.38, 0.2);
      hutBase.material = hutMat;
      const roofMat = new BABYLON.StandardMaterial('roofMat', scene);
      roofMat.diffuseColor = new BABYLON.Color3(0.37, 0.25, 0.14);
      hutRoof.material = roofMat;

      const drSasa = BABYLON.MeshBuilder.CreateCapsule('drSasa', { height: 2.8, radius: 0.45 }, scene);
      drSasa.position = new BABYLON.Vector3(0, 1.4, 3.2);
      const drMat = new BABYLON.StandardMaterial('drMat', scene);
      drMat.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.15);
      drSasa.material = drMat;

      for (let i = 0; i < 45; i += 1) {
        const x = (Math.random() - 0.5) * 70;
        const z = (Math.random() - 0.5) * 70;
        if (Math.abs(x) < 8 && z > -2 && z < 14) continue;

        const trunk = BABYLON.MeshBuilder.CreateCylinder(`trunk-${i}`, { height: 2 + Math.random() * 1.8, diameter: 0.5 }, scene);
        trunk.position = new BABYLON.Vector3(x, 1, z);
        trunk.material = hutMat;

        const top = BABYLON.MeshBuilder.CreateSphere(`leaf-${i}`, { diameter: 2.8 + Math.random() * 1.3 }, scene);
        top.position = new BABYLON.Vector3(x, trunk.position.y + 1.9, z);
        const leafMat = new BABYLON.StandardMaterial(`leafMat-${i}`, scene);
        leafMat.diffuseColor = new BABYLON.Color3(0.14, 0.45 + Math.random() * 0.2, 0.14);
        top.material = leafMat;
      }

      const animalMat = new BABYLON.StandardMaterial('animalMat', scene);
      animalMat.diffuseColor = new BABYLON.Color3(0.55, 0.45, 0.32);

      const lion = BABYLON.MeshBuilder.CreateSphere('lion', { diameter: 1.7 }, scene);
      lion.scaling = new BABYLON.Vector3(1.4, 0.8, 0.8);
      lion.position = new BABYLON.Vector3(-7, 1, -3);
      lion.material = animalMat;

      const elephant = BABYLON.MeshBuilder.CreateBox('elephant', { width: 2.4, height: 1.6, depth: 1.3 }, scene);
      elephant.position = new BABYLON.Vector3(8, 0.9, -1);
      elephant.material = animalMat;

      const clues: any[] = [];
      const clueMat = new BABYLON.StandardMaterial('clueMat', scene);
      clueMat.emissiveColor = new BABYLON.Color3(0.9, 0.7, 0.12);
      clueMat.diffuseColor = new BABYLON.Color3(0.55, 0.42, 0.05);

      const cluePositions = [
        new BABYLON.Vector3(-14, 1.2, 11),
        new BABYLON.Vector3(14, 1.2, 11),
        new BABYLON.Vector3(-17, 1.2, -13),
        new BABYLON.Vector3(18, 1.2, -8),
        new BABYLON.Vector3(4, 1.2, -18),
      ];

      cluePositions.forEach((position, index) => {
        const clue = BABYLON.MeshBuilder.CreateTorusKnot(`clue-${index}`, {
          radius: 0.5,
          tube: 0.16,
          radialSegments: 64,
          tubularSegments: 16,
        }, scene);
        clue.position = position;
        clue.material = clueMat;
        clue.metadata = { collected: false, clueId: index };
        clues.push(clue);
      });

      scene.onPointerDown = (_, pickInfo) => {
        const picked = pickInfo?.pickedMesh;
        if (!picked || !picked.name.startsWith('clue-')) return;

        if (picked.metadata?.collected) return;
        picked.metadata.collected = true;
        picked.isVisible = false;

        setCluesFound((count) => {
          const next = count + 1;
          cluesFoundRef.current = next;
          if (next < cluePositions.length) {
            setMessage(`Great! ${next}/${cluePositions.length} clues found. Keep searching the forest.`);
          } else {
            setMessage('All clues found! Return to Dr Sasa at the hut to unlock storytelling mode.');
          }
          return next;
        });
      };

      scene.registerBeforeRender(() => {
        clues.forEach((clue, index) => {
          if (clue.isVisible) {
            clue.rotation.y += 0.01 + index * 0.0015;
            clue.position.y = 1.2 + Math.sin(performance.now() * 0.001 + index) * 0.2;
          }
        });

        if (cluesFoundRef.current >= cluePositions.length) {
          const distance = BABYLON.Vector3.Distance(camera.position, drSasa.position);
          if (distance < 2.5 && !drSasaUnlockedRef.current) {
            drSasaUnlockedRef.current = true;
            setMessage('Dr Sasa is ready. Upload voice-overs and story books next to activate narrated stories.');
          }
        }
      });

      const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [ground],
      });

      xr.baseExperience.onStateChangedObservable.add((state: number) => {
        if (state === BABYLON.WebXRState.IN_XR) {
          setInVR(true);
        }
        if (state === BABYLON.WebXRState.NOT_IN_XR) {
          setInVR(false);
        }
      });

      xrExperienceRef.current = xr;
      setSceneReady(true);

      engine.runRenderLoop(() => {
        scene.render();
      });

      const onResize = () => engine.resize();
      window.addEventListener('resize', onResize);

      cleanup = () => {
        window.removeEventListener('resize', onResize);
        scene.dispose();
        engine.dispose();
      };
    };

    init();

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, [supportsVR]);

  const enterVR = async () => {
    const xr = xrExperienceRef.current;
    if (!xr) {
      setMessage('VR scene not ready yet. Please wait a few seconds.');
      return;
    }

    try {
      await xr.baseExperience.enterXRAsync('immersive-vr', 'local-floor');
      setMessage('You are in VR mode. Find all clues and return to Dr Sasa.');
    } catch {
      setMessage('Failed to enter VR. Confirm your headset is connected and WebXR is enabled.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-amber-100 px-4 py-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <Button onClick={enterVR} disabled={!sceneReady || supportsVR !== true} className="bg-emerald-700 hover:bg-emerald-800 text-white">
            Enter VR Story Forest
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl md:text-2xl">VR Story Forest: Dr Sasa Quest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center gap-2"><Trees className="w-4 h-4" /> Explore the African savannah, trees, hut, and animals in VR.</p>
            <p className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Hidden clues unlock stories that Dr Sasa can read when voice-overs are uploaded.</p>
            <p><strong>Status:</strong> {supportsVR === null ? 'Checking headset support...' : supportsVR ? 'VR headset supported' : 'VR headset not supported on this device/browser.'}</p>
            <p><strong>Progress:</strong> {cluesFound}/5 clues found</p>
            <p>{message}</p>
          </CardContent>
        </Card>

        <div className="relative rounded-xl overflow-hidden border-2 border-emerald-800/30 bg-black">
          <canvas ref={canvasRef} className="w-full h-[65vh]" />
          {supportsVR !== true && (
            <div className="absolute inset-0 bg-black/80 text-white flex items-center justify-center text-center px-6">
              <div>
                <h2 className="text-xl font-bold mb-2">VR Headset Required</h2>
                <p className="text-sm text-white/90">This experience is locked to VR glasses only. Open this page from a WebXR-capable headset browser.</p>
              </div>
            </div>
          )}
          {supportsVR === true && !inVR && (
            <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs md:text-sm p-3 text-center">
              Headset detected. Click <strong>Enter VR Story Forest</strong> to start immersive mode.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRStoryForest;
