/* LVGL: lv_list contacts, lv_qrcode, lv_btn remote-assist, lv_label tickets */
import { Phone, Mail, Globe, ShieldCheck, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

function QRCode({ size = 120 }: { size?: number }) {
  const N = 21, CELL = size / N;
  const cells = Array.from({ length: N * N }, (_, i) => {
    const r = Math.floor(i / N), c = i % N;
    const corner = (r<7&&c<7)||(r<7&&c>=N-7)||(r>=N-7&&c<7);
    if (corner) {
      const edge = r===0||r===6||r===N-1||r===N-7||c===0||c===6||c===N-1||c===N-7;
      const inner = (r>=2&&r<=4&&c>=2&&c<=4)||(r>=2&&r<=4&&c>=N-5&&c<=N-3)||(r>=N-5&&r<=N-3&&c>=2&&c<=4);
      return edge||inner;
    }
    return ((i*53+r*7+c*11)%13)<6;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:"block" }}>
      <rect width={size} height={size} fill="white" />
      {cells.map((on, i) => { if (!on) return null; const r=Math.floor(i/N),c=i%N; return <rect key={i} x={c*CELL} y={r*CELL} width={CELL} height={CELL} fill="#0a0e1a" />; })}
    </svg>
  );
}

const CONTACTS = [
  { Icon:Phone, label:"全国服务热线", value:"400-888-9999",             color:"var(--chart-2)", border:"rgba(0,255,136,0.2)"   },
  { Icon:Mail,  label:"技术支持邮筱", value:"support@powerstation.com",  color:"var(--chart-1)", border:"rgba(0,212,255,0.2)"   },
  { Icon:Globe, label:"官方网站",     value:"www.powerstation.com",      color:"var(--chart-5)", border:"rgba(192,132,252,0.2)" },
];
const TICKETS = [
  { id:"#2401", title:"液压泵噪音异常",    status:"处理中", time:"2小时前", open:true  },
  { id:"#2398", title:"温控系统校准请求",  status:"已完成", time:"3天前",   open:false },
];

export function Service() {
  const [assist, setAssist] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!assist) { setElapsed(0); return; }
    const t = setInterval(() => setElapsed(v => v+1), 1000);
    return () => clearInterval(t);
  }, [assist]);
  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return (
    <div className="h-full w-full flex flex-col p-4 gap-3" style={{ background:"var(--background)", fontFamily:"var(--font-sans)" }}>
      <div className="flex items-center justify-between shrink-0">
        <div><h2 className="text-sm font-semibold tracking-[0.2em]" style={{ color:"var(--foreground)" }}>商家服务</h2><p className="text-xs tracking-widest mt-0.5" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>VENDOR SERVICE CENTER</p></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm" style={{ background:"rgba(0,255,136,0.08)", border:"1px solid rgba(0,255,136,0.25)" }}>
          <div className="w-2 h-2 rounded-full" style={{ background:"var(--chart-2)" }} />
          <span className="text-xs font-semibold" style={{ color:"var(--chart-2)", fontFamily:"var(--font-mono)" }}>7×24H 在线</span>
        </div>
      </div>
      <div className="flex gap-3 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="rounded-lg p-4 flex flex-col gap-2.5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <span className="text-xs font-semibold tracking-widest" style={{ color:"var(--muted-foreground)" }}>联系方式</span>
            {CONTACTS.map((c,i) => (<div key={i} className="flex items-center gap-3 px-4 py-3 rounded-sm" style={{ background:"var(--secondary)", border:`1px solid ${c.border}` }}><div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0" style={{ background:"var(--muted)", border:"1px solid var(--border)" }}><c.Icon className="w-4 h-4" style={{ color:c.color }} /></div><div className="min-w-0"><p className="text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{c.label}</p><p className="text-sm font-bold truncate" style={{ color:c.color, fontFamily:"var(--font-mono)" }}>{c.value}</p></div></div>))}
          </div>
          <div className="flex-1 rounded-lg p-4 flex flex-col gap-2 min-h-0" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold tracking-widest" style={{ color:"var(--muted-foreground)" }}>工单记录</span>
              <button className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-sm" style={{ background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)", color:"var(--primary)", fontFamily:"var(--font-sans)" }}><MessageSquare className="w-3 h-3" />新建工单</button>
            </div>
            {TICKETS.map(tk => (<div key={tk.id} className="flex items-center gap-3 px-3 py-2.5 rounded-sm" style={{ background:tk.open?"rgba(255,184,0,0.06)":"var(--secondary)", border:`1px solid ${tk.open?"rgba(255,184,0,0.25)":"var(--border)"}` }}><span className="text-xs font-bold w-12 shrink-0" style={{ color:tk.open?"var(--chart-3)":"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{tk.id}</span><span className="flex-1 text-sm font-medium" style={{ color:"var(--foreground)" }}>{tk.title}</span><div className="flex items-center gap-2 shrink-0">{tk.open?<span className="text-xs font-semibold px-2 py-0.5 rounded-sm" style={{ background:"rgba(255,184,0,0.1)", color:"var(--chart-3)", border:"1px solid rgba(255,184,0,0.3)" }}>{tk.status}</span>:<span className="flex items-center gap-1 text-xs font-semibold" style={{ color:"var(--chart-2)" }}><CheckCircle2 className="w-3 h-3" />{tk.status}</span>}<span className="flex items-center gap-1 text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}><Clock className="w-3 h-3" />{tk.time}</span></div></div>))}
          </div>
        </div>
        <div className="w-44 flex flex-col gap-3">
          <div className="rounded-lg p-3.5 flex flex-col items-center gap-2.5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <span className="text-xs font-semibold tracking-widest" style={{ color:"var(--muted-foreground)" }}>扫码报修</span>
            <div className="p-1.5 rounded-sm" style={{ background:"white" }}><QRCode size={120} /></div>
            <p className="text-xs text-center" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>微信扫码提交工单</p>
          </div>
          <button onClick={() => setAssist(v => !v)} className="flex-1 rounded-lg flex flex-col items-center justify-center gap-2" style={{ background:assist?"rgba(0,212,255,0.08)":"var(--card)", border:`1px solid ${assist?"rgba(0,212,255,0.4)":"var(--border)"}`, fontFamily:"var(--font-sans)" }}>
            <ShieldCheck className="w-9 h-9" style={{ color:assist?"var(--primary)":"var(--muted-foreground)" }} />
            <span className="text-sm font-semibold" style={{ color:assist?"var(--primary)":"var(--muted-foreground)" }}>{assist?"远程接入中":"请求远程协助"}</span>
            {assist?(<div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background:"var(--primary)" }} /><span className="text-xs font-bold" style={{ color:"var(--primary)", fontFamily:"var(--font-mono)" }}>{fmt(elapsed)}</span></div>):(<span className="text-xs text-center px-3" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>工程师将远程接入系统</span>)}
          </button>
        </div>
      </div>
    </div>
  );
}