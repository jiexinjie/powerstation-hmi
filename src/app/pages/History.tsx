/* LVGL: lv_chart (LV_CHART_TYPE_LINE, 3 series), lv_btnmatrix range selector, lv_label stats */
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const DATA = {
  today: [
    {id:"t0",t:"08:00",V:380,A:42,T:63},{id:"t1",t:"09:00",V:382,A:45,T:65},
    {id:"t2",t:"10:00",V:379,A:48,T:68},{id:"t3",t:"11:00",V:385,A:41,T:71},
    {id:"t4",t:"12:00",V:381,A:44,T:70},{id:"t5",t:"13:00",V:380,A:43,T:67},
    {id:"t6",t:"14:00",V:378,A:46,T:65},{id:"t7",t:"15:00",V:383,A:49,T:69},
  ],
  week: [
    {id:"w0",t:"周一",V:381,A:44,T:66},{id:"w1",t:"周二",V:379,A:46,T:68},
    {id:"w2",t:"周三",V:383,A:43,T:64},{id:"w3",t:"周四",V:380,A:47,T:70},
    {id:"w4",t:"周五",V:382,A:45,T:67},{id:"w5",t:"周六",V:378,A:42,T:63},
    {id:"w6",t:"周日",V:384,A:48,T:69},
  ],
  month: [
    {id:"m0",t:"第1周",V:380,A:44,T:65},{id:"m1",t:"第2周",V:382,A:46,T:67},
    {id:"m2",t:"第3周",V:379,A:43,T:64},{id:"m3",t:"第4周",V:383,A:48,T:70},
  ],
};

const SERIES = [
  { key:"V", label:"电压", unit:"V",  color:"var(--chart-3)", hex:"#ffb800" },
  { key:"A", label:"电流", unit:"A",  color:"var(--chart-1)", hex:"#00d4ff" },
  { key:"T", label:"温度", unit:"°C", color:"var(--chart-2)", hex:"#00ff88" },
];

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", padding:"10px 14px", borderRadius:"var(--radius-sm)", fontFamily:"var(--font-mono)" }}>
      <p style={{ color:"var(--muted-foreground)", fontSize:11, marginBottom:6 }}>{label}</p>
      {payload.map((e: any, i: number) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:e.color }} />
          <span style={{ color:"var(--muted-foreground)", fontSize:11 }}>{e.name}</span>
          <span style={{ color:"var(--foreground)", fontWeight:700, fontSize:12, marginLeft:"auto", paddingLeft:12 }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
}

export function History() {
  const [range, setRange] = useState<"today"|"week"|"month">("today");
  const [active, setActive] = useState(new Set(["V","A"]));
  const data = DATA[range];
  const toggle = (k: string) => setActive(p => { const n = new Set(p); n.has(k)?n.delete(k):n.add(k); return n; });
  const stats = SERIES.map(s => {
    const vals = data.map(d => (d as any)[s.key] as number);
    const max = Math.max(...vals), min = Math.min(...vals);
    return { ...s, max, min, avg:+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1), trend:vals[vals.length-1]-vals[0] };
  });
  return (
    <div className="h-full w-full flex flex-col p-4 gap-3" style={{ background:"var(--background)", fontFamily:"var(--font-sans)" }}>
      <div className="flex items-center justify-between shrink-0">
        <div><h2 className="text-sm font-semibold tracking-[0.2em]" style={{ color:"var(--foreground)" }}>历史数据追溯</h2><p className="text-xs tracking-widest mt-0.5" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>HISTORICAL TREND ANALYSIS</p></div>
        <div className="flex gap-1.5">
          {(["today","week","month"] as const).map((r,i) => (<button key={r} onClick={() => setRange(r)} className="px-4 py-1.5 rounded-sm text-xs font-semibold" style={{ background:range===r?"var(--secondary)":"var(--card)", border:`1px solid ${range===r?"var(--primary)":"var(--border)"}`, color:range===r?"var(--primary)":"var(--muted-foreground)", fontFamily:"var(--font-sans)" }}>{["今日","本周","本月"][i]}</button>))}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        {SERIES.map(s => (<button key={s.key} onClick={() => toggle(s.key)} className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-semibold" style={{ background:active.has(s.key)?"var(--secondary)":"var(--card)", border:`1px solid ${active.has(s.key)?s.color:"var(--border)"}`, color:active.has(s.key)?"var(--foreground)":"var(--muted-foreground)", fontFamily:"var(--font-sans)" }}><div className="w-6 h-1 rounded-full" style={{ background:active.has(s.key)?s.color:"var(--muted)" }} />{s.label}（{s.unit}）</button>))}
      </div>
      <div className="flex-1 rounded-lg min-h-0" style={{ background:"var(--card)", border:"1px solid var(--border)", padding:"12px 8px 8px 4px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top:4, right:8, left:-18, bottom:0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="t" stroke="transparent" tick={{ fill:"#7a92b0", fontFamily:"var(--font-mono)", fontSize:11 }} tickLine={false} />
            <YAxis stroke="transparent" tick={{ fill:"#7a92b0", fontFamily:"var(--font-mono)", fontSize:11 }} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine key="ref-vmax" y={384} stroke="rgba(255,59,59,0.4)" strokeDasharray="6 3" strokeWidth={1} label={{ value:"上限", fill:"#7a92b0", fontSize:10, fontFamily:"var(--font-mono)", position:"insideTopRight" }} />
            {SERIES.map(s => active.has(s.key) ? (<Line key={`line-${s.key}`} type="monotone" dataKey={s.key} name={s.label} stroke={s.hex} strokeWidth={2} dot={false} activeDot={{ r:5, fill:s.hex, strokeWidth:0 }} isAnimationActive={false} />) : null)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 shrink-0">
        {stats.map(s => {
          const Icon = s.trend>0?TrendingUp:s.trend<0?TrendingDown:Minus;
          const tc = s.trend>0?"var(--destructive)":s.trend<0?"var(--chart-2)":"var(--muted-foreground)";
          return (
            <div key={s.key} className="rounded-sm px-3 py-2.5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background:s.color }} /><span className="text-xs font-semibold" style={{ color:"var(--muted-foreground)" }}>{s.label}（{s.unit}）</span><Icon className="w-3.5 h-3.5 ml-auto" style={{ color:tc }} /></div>
              <div className="grid grid-cols-3 gap-1 text-center">
                {([["最高",s.max],["均値",s.avg],["最低",s.min]] as [string,number][]).map(([l,v],i) => (<div key={i}><p className="text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{l}</p><p className="text-sm font-bold" style={{ color:"var(--foreground)", fontFamily:"var(--font-mono)" }}>{v}</p></div>))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}