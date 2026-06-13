/**
 * LVGL 8.x: lv_meter multi-zone arc gauge, lv_bar, lv_led, LV_LAYOUT_GRID 2x2
 * Card layout: [gauge 180x180] | [info panel]
 */
import { Zap, Activity, Thermometer, Droplets, RefreshCw, Cpu, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const toRad = (d: number) => (d * Math.PI) / 180;
const ptOn = (cx: number, cy: number, r: number, deg: number) => ({ x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) });
const arcPath = (cx: number, cy: number, r: number, from: number, to: number) => {
  const s = ptOn(cx,cy,r,from), e = ptOn(cx,cy,r,to);
  return `M${s.x.toFixed(3)} ${s.y.toFixed(3)} A${r} ${r} 0 ${to-from>180?1:0} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
};

function PremiumGauge({ pct, color, value, unit, warn }: { pct:number; color:string; value:string; unit:string; warn:boolean }) {
  const CX=90,CY=90,R=73,START=135,SWEEP=270;
  const c=Math.min(100,Math.max(0,pct)), vEnd=START+(SWEEP*c)/100;
  const stroke=c>85?"var(--destructive)":c>70?"var(--chart-3)":color;
  const z1=START+SWEEP*0.70, z2=START+SWEEP*0.85, z3=START+SWEEP;
  const ticks=Array.from({length:9},(_,i)=>{
    const frac=i/8, deg=START+SWEEP*frac, isMajor=i===0||i===4||i===8, isMed=i===2||i===6;
    return { inner:ptOn(CX,CY,R-(isMajor?17:isMed?11:7),deg), outer:ptOn(CX,CY,R+(isMajor?5:3),deg), isMajor, isMed };
  });
  const tipPt=ptOn(CX,CY,R+6,vEnd), tipPt2=ptOn(CX,CY,R+2,vEnd);
  return (
    <svg viewBox="0 0 180 180" width={180} height={180} style={{ display:"block" }}>
      <circle cx={CX} cy={CY} r={R+18} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" />
      <circle cx={CX} cy={CY} r={R+11} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <path d={arcPath(CX,CY,R,START,z1)} fill="none" stroke="rgba(0,255,136,0.13)" strokeWidth="16" strokeLinecap="butt" />
      <path d={arcPath(CX,CY,R,z1,z2)} fill="none" stroke="rgba(255,184,0,0.16)" strokeWidth="16" strokeLinecap="butt" />
      <path d={arcPath(CX,CY,R,z2,z3)} fill="none" stroke="rgba(255,59,59,0.20)" strokeWidth="16" strokeLinecap="butt" />
      <circle cx={CX} cy={CY} r={R-9} fill="var(--background)" />
      {[z1,z2].map((deg,i) => { const a=ptOn(CX,CY,R-12,deg),b=ptOn(CX,CY,R+9,deg); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />; })}
      {ticks.map((tk,i) => (<line key={i} x1={tk.inner.x} y1={tk.inner.y} x2={tk.outer.x} y2={tk.outer.y} stroke={tk.isMajor?"rgba(255,255,255,0.45)":tk.isMed?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.12)"} strokeWidth={tk.isMajor?2:1} strokeLinecap="round" />))}
      {[{i:0,label:"0"},{i:8,label:"MAX"}].map(({i,label}) => { const p=ptOn(CX,CY,R+22,START+SWEEP*i/8); return <text key={i} x={p.x} y={p.y+4} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="var(--font-mono)">{label}</text>; })}
      {c>0.5&&<path d={arcPath(CX,CY,R,START,vEnd)} fill="none" stroke={stroke} strokeWidth="13" strokeLinecap="round" />}
      {c>0.5&&<><circle cx={tipPt2.x} cy={tipPt2.y} r={7} fill={stroke} opacity={0.18} /><circle cx={tipPt.x} cy={tipPt.y} r={4} fill={stroke} opacity={0.92} /></>}
      <circle cx={CX} cy={CY} r={42} fill="var(--muted)" />
      <circle cx={CX} cy={CY} r={40} fill="var(--card)" />
      <circle cx={CX} cy={CY} r={39} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x={CX} y={CY-8} textAnchor="middle" fill={stroke} fontSize="21" fontFamily="var(--font-mono)" fontWeight="700">{value}</text>
      <text x={CX} y={CY+10} textAnchor="middle" fill="var(--muted-foreground)" fontSize="11" fontFamily="var(--font-mono)">{unit}</text>
      <text x={CX} y={CY+24} textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="var(--font-mono)" opacity="0.5">{Math.round(c)}%</text>
    </svg>
  );
}

function Spark({ values, color }: { values:number[]; color:string }) {
  if (values.length<2) return null;
  const max=Math.max(...values), min=Math.min(...values), range=max-min||1, W=100, H=28;
  const pts=values.map((v,i)=>`${((i/(values.length-1))*W).toFixed(1)},${(H-((v-min)/range)*H).toFixed(1)}`).join(" ");
  const last=values[values.length-1], lx=W, ly=H-((last-min)/range)*H;
  return (<svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" /><circle cx={lx} cy={ly} r="2.5" fill={color} /></svg>);
}

function ParamCard({ title,Icon,color,value,unit,pct,rangeMin,rangeMax,desc,history }: { title:string;Icon:any;color:string;value:string;unit:string;pct:number;rangeMin:string;rangeMax:string;nominal:string;desc:string;history:number[] }) {
  const warn=pct>88, danger=pct>95;
  const stroke=danger?"var(--destructive)":pct>70?"var(--chart-3)":color;
  const deviation=history.length>=2?(history[history.length-1]-history[history.length-2]):0;
  return (
    <div className="flex overflow-hidden rounded-lg" style={{ background:"var(--card)", border:`1px solid ${warn?"rgba(255,59,59,0.35)":"var(--border)"}`, backgroundImage:"linear-gradient(135deg, var(--card) 60%, var(--muted) 100%)" }}>
      <div className="flex items-center justify-center shrink-0" style={{ width:180, borderRight:"1px solid var(--border)" }}><PremiumGauge pct={pct} color={color} value={value} unit={unit} warn={warn} /></div>
      <div className="flex-1 flex flex-col justify-between px-4 py-3 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0" style={{ background:"var(--secondary)", border:"1px solid var(--border)" }}><Icon className="w-4 h-4" style={{ color }} /></div>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-sans)" }}>{title}</span>
          </div>
          {warn&&<span className="text-xs font-bold px-2 py-px rounded-sm shrink-0" style={{ background:"rgba(255,59,59,0.12)", color:"var(--destructive)", border:"1px solid rgba(255,59,59,0.3)", fontFamily:"var(--font-mono)" }}>⚠ {danger?"CRIT":"WARN"}</span>}
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold leading-none" style={{ fontSize:40, color:stroke, fontFamily:"var(--font-mono)", lineHeight:1 }}>{value}</span>
            <span className="text-base font-semibold" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{unit}</span>
            <span className="flex items-center gap-0.5 text-xs font-bold ml-1" style={{ color:deviation>0?"var(--destructive)":deviation<0?"var(--chart-2)":"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>
              {deviation>0?<ArrowUp className="w-3 h-3" />:deviation<0?<ArrowDown className="w-3 h-3" />:null}
              {deviation!==0?Math.abs(+deviation.toFixed(2)):"—"}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{desc}</p>
        </div>
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:4 }}>
          <p className="text-xs mb-1" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)", opacity:0.6 }}>趋势</p>
          <Spark values={history} color={stroke} />
        </div>
        <div>
          <div className="h-1 rounded-full mb-1" style={{ background:"var(--muted)" }}><div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.min(100,pct)}%`, background:stroke }} /></div>
          <div className="flex justify-between text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>
            <span>{rangeMin}</span><span style={{ color:stroke }}>{Math.round(pct)}%</span><span>{rangeMax}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Monitoring() {
  const [p, setP] = useState({ V:380.0, A:45.2, T:65.0, P:0.82 });
  const [tick, setTick] = useState(0);
  const hist = useRef({ V:[380], A:[45.2], T:[65], P:[0.82] });
  useEffect(() => {
    const t = setInterval(() => {
      setP(prev => {
        const next = {
          V: +(Math.max(370,Math.min(392,prev.V+(Math.random()-0.5)*1.2))).toFixed(1),
          A: +(Math.max(38, Math.min(56, prev.A+(Math.random()-0.5)*0.8))).toFixed(1),
          T: +(Math.max(58, Math.min(87, prev.T+(Math.random()-0.5)*0.5))).toFixed(1),
          P: +(Math.max(0.62,Math.min(0.98,prev.P+(Math.random()-0.5)*0.012))).toFixed(2),
        };
        (Object.keys(next) as (keyof typeof next)[]).forEach(k => { const arr=hist.current[k]; arr.push(+next[k]); if(arr.length>12)arr.shift(); });
        return next;
      });
      setTick(v => v+1);
    }, 1200);
    return () => clearInterval(t);
  }, []);
  const cards = [
    { title:"系统电压", Icon:Zap,        color:"var(--chart-3)", value:p.V.toFixed(1), unit:"V",   pct:((p.V-360)/32)*100, rangeMin:"360V", rangeMax:"392V", nominal:"380V", desc:`额定 380V · 偏差 ${(p.V-380>=0?"+":"")+(p.V-380).toFixed(1)}V`, history:[...hist.current.V] },
    { title:"运行电流", Icon:Activity,   color:"var(--chart-1)", value:p.A.toFixed(1), unit:"A",   pct:((p.A-38)/18)*100,  rangeMin:"38A",  rangeMax:"56A",  nominal:"50A",  desc:`额定 50A · 负载率 ${Math.round((p.A/50)*100)}%`, history:[...hist.current.A] },
    { title:"设备温度", Icon:Thermometer,color:"var(--chart-2)", value:p.T.toFixed(1), unit:"°C", pct:((p.T-58)/29)*100,  rangeMin:"58°C", rangeMax:"87°C", nominal:"65°C", desc:`阈值 80°C · ${p.T>75?"★ 偏高注意":"正常运行"}`, history:[...hist.current.T] },
    { title:"液压压力", Icon:Droplets,   color:"var(--chart-5)", value:p.P.toFixed(2), unit:"MPa", pct:((p.P-0.62)/0.36)*100,rangeMin:"0.62",rangeMax:"0.98",nominal:"0.8MPa",desc:`额定 0.8MPa · 偏差 ${(p.P-0.8>=0?"+":"")+(p.P-0.8).toFixed(2)}`, history:[...hist.current.P] },
  ];
  return (
    <div className="h-full w-full flex flex-col p-4 gap-3" style={{ background:"var(--background)", fontFamily:"var(--font-sans)" }}>
      <div className="flex items-center justify-between shrink-0">
        <div><h2 className="text-sm font-semibold tracking-[0.18em]" style={{ color:"var(--foreground)" }}>实时数据监控</h2><p className="text-xs tracking-widest mt-0.5" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>REAL-TIME PARAMETER MONITOR</p></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm" style={{ background:"var(--secondary)", border:"1px solid var(--border)" }}><RefreshCw className="w-3 h-3" style={{ color:"var(--muted-foreground)" }} /><span className="text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>#{tick}</span></div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm" style={{ background:"var(--secondary)", border:"1px solid var(--border)" }}><Cpu className="w-3 h-3" style={{ color:"var(--muted-foreground)" }} /><span className="text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>STM32F4</span></div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm" style={{ background:"rgba(0,255,136,0.08)", border:"1px solid rgba(0,255,136,0.25)" }}><div className="w-2 h-2 rounded-full" style={{ background:"var(--chart-2)" }} /><span className="text-xs font-bold" style={{ color:"var(--chart-2)", fontFamily:"var(--font-mono)" }}>RUN</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1 min-h-0">{cards.map((c,i) => <ParamCard key={i} {...c} />)}</div>
    </div>
  );
}