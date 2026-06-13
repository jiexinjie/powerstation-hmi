/**
 * LVGL 8.x: DualRingGauge (two concentric lv_arc)
 * Outer ring = consumed, Inner ring = remaining
 */
import { Wrench, Settings, Droplet, Filter, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

const toRad=(d:number)=>(d*Math.PI)/180;
const ptOn=(cx:number,cy:number,r:number,deg:number)=>({x:cx+r*Math.cos(toRad(deg)),y:cy+r*Math.sin(toRad(deg))});
const arc=(cx:number,cy:number,r:number,a:number,b:number)=>{const s=ptOn(cx,cy,r,a),e=ptOn(cx,cy,r,b);return `M${s.x.toFixed(3)} ${s.y.toFixed(3)} A${r} ${r} 0 ${b-a>180?1:0} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;};

function DualRingGauge({pct,color,isDone,isWarn}:{pct:number;color:string;isDone:boolean;isWarn:boolean}) {
  const CX=90,CY=90,Ro=71,Ri=52,START=135,SWEEP=270;
  const c=Math.min(100,Math.max(0,pct)), rem=100-c;
  const vEnd=START+SWEEP*c/100, remEnd=START+SWEEP*rem/100;
  const outerStroke=isDone?"var(--chart-2)":isWarn?"var(--chart-3)":color;
  const innerStroke=isDone?"rgba(0,255,136,0.35)":isWarn?"rgba(255,184,0,0.35)":`${color}55`;
  const z1=START+SWEEP*0.70, z2=START+SWEEP*0.85, z3=START+SWEEP;
  const ticks=Array.from({length:9},(_,i)=>{const deg=START+SWEEP*i/8,isMajor=i===0||i===4||i===8;return{inner:ptOn(CX,CY,Ro-(isMajor?13:7),deg),outer:ptOn(CX,CY,Ro+(isMajor?4:2),deg),isMajor};});
  const outerTip=ptOn(CX,CY,Ro+5,vEnd), innerTip=ptOn(CX,CY,Ri+4,START+SWEEP*rem/100);
  return (
    <svg viewBox="0 0 180 180" width={180} height={180} style={{display:"block"}}>
      <circle cx={CX} cy={CY} r={Ro+16} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
      <circle cx={CX} cy={CY} r={Ro+8}  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"  />
      <path d={arc(CX,CY,Ro,START,z1)} fill="none" stroke="rgba(0,255,136,0.12)"  strokeWidth="13" strokeLinecap="butt" />
      <path d={arc(CX,CY,Ro,z1,z2)}   fill="none" stroke="rgba(255,184,0,0.15)"  strokeWidth="13" strokeLinecap="butt" />
      <path d={arc(CX,CY,Ro,z2,z3)}   fill="none" stroke="rgba(255,59,59,0.18)"  strokeWidth="13" strokeLinecap="butt" />
      <circle cx={CX} cy={CY} r={Ro-7} fill="var(--background)" />
      {[z1,z2].map((deg,i)=>(<line key={i} x1={ptOn(CX,CY,Ro-10,deg).x} y1={ptOn(CX,CY,Ro-10,deg).y} x2={ptOn(CX,CY,Ro+8,deg).x} y2={ptOn(CX,CY,Ro+8,deg).y} stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" />))}
      {ticks.map((tk,i)=>(<line key={i} x1={tk.inner.x} y1={tk.inner.y} x2={tk.outer.x} y2={tk.outer.y} stroke={tk.isMajor?"rgba(255,255,255,0.40)":"rgba(255,255,255,0.12)"} strokeWidth={tk.isMajor?1.8:1} strokeLinecap="round" />))}
      {c>0.5&&<path d={arc(CX,CY,Ro,START,vEnd)} fill="none" stroke={outerStroke} strokeWidth="11" strokeLinecap="round" />}
      {c>0.5&&<><circle cx={outerTip.x} cy={outerTip.y} r={6} fill={outerStroke} opacity={0.16}/><circle cx={outerTip.x} cy={outerTip.y} r={3.5} fill={outerStroke} opacity={0.9}/></>}
      <path d={arc(CX,CY,Ri,START,z3)} fill="none" stroke="var(--muted)" strokeWidth="8" strokeLinecap="butt" />
      {rem>0.5&&<path d={arc(CX,CY,Ri,START,remEnd)} fill="none" stroke={innerStroke} strokeWidth="7" strokeLinecap="round" />}
      {rem>0.5&&<circle cx={innerTip.x} cy={innerTip.y} r={3} fill={innerStroke} opacity={0.9}/>}
      {[0,3,6].map(i=>{const deg=START+SWEEP*i/8,a=ptOn(CX,CY,Ri-5,deg),b=ptOn(CX,CY,Ro-6,deg);return<line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;})}
      <circle cx={CX} cy={CY} r={38} fill="var(--muted)" />
      <circle cx={CX} cy={CY} r={36} fill="var(--card)" />
      <circle cx={CX} cy={CY} r={35} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x={CX} y={CY-8} textAnchor="middle" fill={isDone?"var(--chart-2)":outerStroke} fontSize="20" fontFamily="var(--font-mono)" fontWeight="700">{isDone?"✓":`${Math.round(c)}%`}</text>
      <text x={CX} y={CY+9} textAnchor="middle" fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-mono)">{isDone?"已完成":"已消耗"}</text>
      {!isDone&&<text x={CX} y={CY+22} textAnchor="middle" fill={isWarn?outerStroke:"var(--muted-foreground)"} fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">余 {Math.round(rem)}%</text>}
    </svg>
  );
}

const TASKS = [
  {id:0,name:"液压油更换",   sub:"Oil Change",     cycle:3000,Icon:Droplet, color:"var(--chart-1)"},
  {id:1,name:"空气滤芯清洁",sub:"Air Filter",     cycle:500, Icon:Filter,  color:"var(--chart-3)"},
  {id:2,name:"电机轴承润滑",sub:"Bearing Grease", cycle:2000,Icon:Settings,color:"var(--chart-5)"},
  {id:3,name:"全面系统检查",sub:"Full Inspection",cycle:5000,Icon:Wrench,  color:"var(--chart-2)"},
] as const;
const TOTAL=2450;

export function Maintenance() {
  const [done,setDone]=useState<Set<number>>(new Set());
  const toggle=(id:number)=>setDone(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  return (
    <div className="h-full w-full flex flex-col p-4 gap-3" style={{background:"var(--background)",fontFamily:"var(--font-sans)"}}>
      <div className="flex items-center justify-between shrink-0">
        <div><h2 className="text-sm font-semibold tracking-[0.18em]" style={{color:"var(--foreground)"}}>保养提醒</h2><p className="text-xs tracking-widest mt-0.5" style={{color:"var(--muted-foreground)",fontFamily:"var(--font-mono)"}}>MAINTENANCE SCHEDULE</p></div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{background:"var(--card)",border:"1px solid var(--border)"}}>  <Clock className="w-3.5 h-3.5" style={{color:"var(--muted-foreground)"}} /><span className="text-xs" style={{color:"var(--muted-foreground)",fontFamily:"var(--font-mono)"}}>累计运行</span><span className="text-xl font-bold tracking-wider" style={{color:"var(--foreground)",fontFamily:"var(--font-mono)"}}>{TOTAL.toLocaleString()}</span><span className="text-xs font-bold" style={{color:"var(--muted-foreground)",fontFamily:"var(--font-mono)"}}>H</span></div>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {TASKS.map(task=>{
          const used=TOTAL%task.cycle, rem=task.cycle-used, pct=(used/task.cycle)*100, isWarn=pct>85, isDone=done.has(task.id);
          const stroke=isDone?"var(--chart-2)":isWarn?"var(--chart-3)":task.color;
          return (
            <div key={task.id} className="flex overflow-hidden rounded-lg" style={{background:"var(--card)",border:`1px solid ${isDone?"rgba(0,255,136,0.22)":isWarn?"rgba(255,184,0,0.28)":"var(--border)"}`,backgroundImage:"linear-gradient(135deg, var(--card) 60%, var(--muted) 100%)"}}>
              <div className="flex items-center justify-center shrink-0" style={{width:180,borderRight:"1px solid var(--border)"}}><DualRingGauge pct={pct} color={task.color} isDone={isDone} isWarn={isWarn} /></div>
              <div className="flex-1 flex flex-col justify-between px-4 py-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0" style={{background:"var(--secondary)",border:"1px solid var(--border)"}}><task.Icon className="w-4 h-4" style={{color:isDone?"var(--chart-2)":task.color}} /></div>
                    <div><p className="text-sm font-semibold" style={{color:"var(--foreground)"}}>{task.name}</p><p className="text-xs" style={{color:"var(--muted-foreground)",fontFamily:"var(--font-mono)"}}>{task.sub}</p></div>
                  </div>
                  {isDone?(<span className="text-xs font-bold px-2 py-px rounded-sm shrink-0" style={{background:"rgba(0,255,136,0.10)",color:"var(--chart-2)",border:"1px solid rgba(0,255,136,0.25)"}}>✓ 完成</span>):isWarn?(<span className="flex items-center gap-1 text-xs font-bold px-2 py-px rounded-sm shrink-0" style={{background:"rgba(255,184,0,0.10)",color:"var(--chart-3)",border:"1px solid rgba(255,184,0,0.28)"}}><AlertTriangle className="w-3 h-3" />到期</span>):null}
                </div>
                <div className="flex flex-col gap-1">
                  {[{label:"本周期已用",val:`${used} H`,c:stroke},{label:"剩余寿命",val:`${rem} H`,c:isDone?"var(--muted-foreground)":stroke},{label:"保养周期",val:`${task.cycle.toLocaleString()} H`,c:"var(--muted-foreground)"}].map((row,i)=>(<div key={i} className="flex justify-between items-center py-0.5" style={{borderBottom:"1px solid var(--border)"}}><span className="text-xs" style={{color:"var(--muted-foreground)",fontFamily:"var(--font-mono)"}}>{row.label}</span><span className="text-sm font-bold" style={{color:row.c,fontFamily:"var(--font-mono)"}}>{row.val}</span></div>))}
                </div>
                <div><div className="flex justify-between text-xs mb-1" style={{color:"var(--muted-foreground)",fontFamily:"var(--font-mono)"}}><span>消耗进度</span><span style={{color:stroke}}>{pct.toFixed(1)}%</span></div><div className="h-1.5 rounded-full" style={{background:"var(--muted)"}}><div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:stroke}} /></div></div>
                <button onClick={()=>toggle(task.id)} className="w-full py-2 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5" style={{background:isDone?"rgba(0,255,136,0.08)":"var(--secondary)",border:`1px solid ${isDone?"rgba(0,255,136,0.22)":"var(--border)"}`,color:isDone?"var(--chart-2)":"var(--muted-foreground)",fontFamily:"var(--font-sans)"}}><CheckCircle2 className="w-3.5 h-3.5" />{isDone?"撒销保养记录":"标记为已保养"}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}