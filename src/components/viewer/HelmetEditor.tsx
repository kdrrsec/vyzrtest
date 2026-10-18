"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useLocale, useTranslations } from "next-intl";
import { defaultTransform, useCustomizerStore } from "@/store/useCustomizerStore";
import { slotsForSetup, type VisorSlotId } from "@/lib/customizerSetup";
import { ViewerErrorBoundary } from "./ViewerErrorBoundary";
import { WebGLGate } from "./WebGLGate";

// UV coordinates belong to the authored visor surface, not the helmet shell.
const zones = { left: [270,170,300,300], top: [760,24,528,130], right: [1478,170,300,300] };

/**
 * Engraving preview color, alpha-aware: an upload with its own transparency (a PNG/SVG
 * cutout) keeps that alpha as-is, so white ink on a transparent background stays visible.
 * An upload with no transparency at all (a flat JPG or a flattened PNG, e.g. a black
 * drawing on white paper) falls back to treating light pixels as background to remove,
 * since there's no alpha channel to tell ink from background otherwise.
 */
function toWhiteEngraving(img: HTMLImageElement): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = img.width; out.height = img.height;
  const ctx = out.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, out.width, out.height);
  const p = data.data;
  let hasTransparency = false;
  for (let i = 3; i < p.length; i += 4) { if (p[i] < 250) { hasTransparency = true; break; } }
  for (let i = 0; i < p.length; i += 4) {
    if (!hasTransparency) {
      const l = (p[i] + p[i + 1] + p[i + 2]) / 3;
      p[i + 3] = Math.round(p[i + 3] * (1 - l / 255));
    }
    p[i] = p[i + 1] = p[i + 2] = 240;
  }
  ctx.putImageData(data, 0, 0);
  return out;
}

function Helmet({ texture }: { texture: THREE.CanvasTexture }) {
  const { scene } = useGLTF("/models/arai-rx7gp.glb");
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse(o => {
      if (!(o instanceof THREE.Mesh)) return;
      o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone();
      if (o.name === "Visor_design_surface") {
        o.material.dispose();
        o.material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.FrontSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
        o.renderOrder = 2;
      } else {
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        materials.forEach(m => { m.side = THREE.DoubleSide; });
      }
    });
    return root;
  }, [scene, texture]);
  useEffect(() => () => model.traverse(o => { if (o instanceof THREE.Mesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); }), [model]);
  return <primitive object={model} dispose={null} />;
}
function Camera({ slot }: { slot: VisorSlotId }) {
  const { camera } = useThree();
  useEffect(() => { camera.position.set(slot === "left" ? -5 : slot === "right" ? 5 : 0, .8, slot === "top" ? 6.2 : 2.7); camera.lookAt(0,0,0); }, [slot, camera]);
  return <OrbitControls key={slot} makeDefault enablePan={false} minDistance={3.5} maxDistance={8} />;
}
export default function HelmetEditor({ disabled = false }: { disabled?: boolean }) {
  const nl = useLocale() === "nl";
  const t = useTranslations("Customizer");
  const { setup, singleSide, uploads, transforms, setSlotUpload, setTransform } = useCustomizerStore();
  const slots = setup ? slotsForSetup(setup, singleSide) : [];
  const [selected, setSelected] = useState<VisorSlotId>(slots[0] || "left");
  const slot = slots.includes(selected) ? selected : slots[0] || "left";
  const [error, setError] = useState("");
  const [guides, setGuides] = useState(true);
  const request = useRef(0);
  const canvas = useMemo(() => Object.assign(document.createElement("canvas"), { width: 2048, height: 640 }), []);
  const texture = useMemo(() => { const tex = new THREE.CanvasTexture(canvas); tex.flipY = false; tex.colorSpace = THREE.SRGBColorSpace; return tex; }, [canvas]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    let cancelled = false;
    async function draw() {
      const images = await Promise.all(slots.map(async id => {
        if (!uploads[id]) return null;
        const img = new Image(); img.src = uploads[id]!;
        try { await img.decode(); return { id, img: toWhiteEngraving(img) }; } catch { return null; }
      }));
      if (cancelled) return;
      const ctx = canvas.getContext("2d")!; ctx.clearRect(0,0,2048,640);
      for (const item of images) {
        if (!item) continue;
        const {id,img} = item; const [x,y,w,h] = zones[id]; const v = transforms[id];
        const angle = v.rotation * Math.PI / 180;
        const fit = Math.min(w / (Math.abs(Math.cos(angle))*img.width + Math.abs(Math.sin(angle))*img.height), h / (Math.abs(Math.sin(angle))*img.width + Math.abs(Math.cos(angle))*img.height)) * v.scale / 100;
        const iw = img.width*fit, ih=img.height*fit;
        const bw=Math.abs(Math.cos(angle))*iw+Math.abs(Math.sin(angle))*ih, bh=Math.abs(Math.sin(angle))*iw+Math.abs(Math.cos(angle))*ih;
        ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
        ctx.translate(x+w/2+v.x/100*(w-bw)/2,y+h/2+v.y/100*(h-bh)/2); ctx.rotate(angle); ctx.drawImage(img,-iw/2,-ih/2,iw,ih); ctx.restore();
      }
      if(guides) for(const id of slots) { const [x,y,w,h]=zones[id]; ctx.strokeStyle=id===slot ? "#e01e1e" : "#ffffff80"; ctx.lineWidth=3; ctx.setLineDash([12,9]); ctx.strokeRect(x,y,w,h); }
      texture.needsUpdate=true;
    }
    void draw(); return () => { cancelled=true; };
  }, [uploads, transforms, setup, singleSide, slot, guides, canvas, texture]);
  const title = (id: VisorSlotId) => t(id === "left" ? "slotLeftTitle" : id === "right" ? "slotRightTitle" : "slotTopTitle");
  const fallback = <div role="status" className="flex h-full items-center justify-center p-8 text-center text-sm text-muted">{nl ? "3D-voorbeeld niet beschikbaar. Herlaad de pagina of probeer een browser met WebGL." : "3D preview unavailable. Reload or use a WebGL-enabled browser."}</div>;
  async function upload(file: File | undefined) {
    if (!file) return;
    const id=++request.current; const target=slot; setError("");
    if(!["image/png","image/jpeg","image/svg+xml"].includes(file.type) || file.size>8*1024*1024) { setError(nl ? "Gebruik PNG, JPG of SVG van maximaal 8 MB." : "Use PNG, JPG or SVG up to 8 MB."); return; }
    try {
      const data = await new Promise<string>((resolve,reject) => { const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result)); reader.onerror=reject; reader.readAsDataURL(file); });
      const img=new Image(); img.src=data; await img.decode();
      if(img.width*img.height>40000000) throw new Error("size");
      if(id===request.current) { setSlotUpload(target,data); setTransform(target,defaultTransform); }
    } catch { setError(nl ? "Deze afbeelding kan niet worden geopend of is te groot." : "This image cannot be opened or is too large."); }
  }
  return <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
    <div className="lg:sticky lg:top-28">
      <div className="relative h-[360px] overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03] md:h-[520px]">
        <WebGLGate pending={fallback} fallback={fallback}><ViewerErrorBoundary fallback={fallback}>
          <Canvas camera={{ position:[-5,.8,2.7], fov:35 }} dpr={[1,1.5]} gl={{ antialias:true }}>
            <ambientLight intensity={.8}/><directionalLight position={[3,5,4]} intensity={3}/>
            <Suspense fallback={null}>
              <Helmet texture={texture}/>
              <Environment resolution={128}><Lightformer position={[-4,3,3]} intensity={5} scale={[3,6,1]}/><Lightformer position={[4,2,1]} intensity={4} scale={[2,5,1]}/><Lightformer position={[0,5,-1]} rotation={[Math.PI/2,0,0]} intensity={4} scale={[5,2,1]}/></Environment>
            </Suspense><Camera slot={slot}/>
          </Canvas>
        </ViewerErrorBoundary></WebGLGate>
        <span className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[.2em] text-muted">VYZR / DESIGN STUDIO</span>
      </div>
      <div className="mt-3 flex justify-between gap-4 text-xs text-muted"><span>{nl ? "Sleep om te draaien · scroll om te zoomen" : "Drag to rotate · scroll to zoom"}</span><label><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)} className="mr-2 accent-accent"/>{nl ? "Ontwerpzones" : "Design zones"}</label></div>
      <p className="mt-2 text-xs text-muted">{nl ? "Arai RX7 GP als voorbeeldmodel. Plaatsing wordt gecontroleerd voor jouw gekozen vizier." : "Arai RX7 GP preview model. Placement is reviewed for your selected visor."}</p>
    </div>
    <div className="rounded-2xl border border-black/10 bg-background p-5 dark:border-white/10 md:p-6">
      <div className="mb-6 flex gap-2">{slots.map(id=><button key={id} type="button" aria-pressed={slot===id} onClick={()=>setSelected(id)} className={`flex-1 rounded-full border px-3 py-3 text-[10px] font-semibold uppercase tracking-wider ${slot===id ? "border-accent bg-accent/10 text-foreground" : "border-black/10 text-muted dark:border-white/10"}`}>{title(id)}</button>)}</div>
      <label className="block text-xs font-semibold uppercase tracking-wider">{title(slot)}<input key={slot} type="file" disabled={disabled} accept="image/png,image/jpeg,image/svg+xml" onChange={e=>{void upload(e.target.files?.[0]); e.target.value="";}} className="mt-4 block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-3 file:text-background"/></label>
      <p className="mt-3 text-xs text-muted">PNG / JPG / SVG · max. 8 MB</p>
      {error && <p role="alert" className="mt-3 text-sm text-accent">{error}</p>}
      <fieldset disabled={disabled || !uploads[slot]} className="mt-8 space-y-5 disabled:opacity-40">{([['scale',nl?'Grootte':'Size',20,100],['x',nl?'Horizontaal':'Horizontal',-100,100],['y',nl?'Verticaal':'Vertical',-100,100],['rotation',nl?'Draaien':'Rotation',-180,180]] as const).map(([key,label,min,max])=><label key={key} className="block text-xs text-muted"><span className="flex justify-between"><span>{label}</span><span>{transforms[slot][key]}{key==='rotation'?'°':'%'}</span></span><input type="range" min={min} max={max} value={transforms[slot][key]} onChange={e=>setTransform(slot,{[key]:Number(e.target.value)})} className="mt-3 w-full accent-accent"/></label>)}
      <div className="flex gap-5 text-xs"><button type="button" onClick={()=>setTransform(slot,defaultTransform)} className="underline">Reset</button><button type="button" onClick={()=>setSlotUpload(slot,null)} className="text-accent underline">{t("slotDesignRemove")}</button></div></fieldset>
      <p className="mt-8 text-xs leading-relaxed text-muted">{t("noteReview")}</p>
    </div>
  </div>;
}
