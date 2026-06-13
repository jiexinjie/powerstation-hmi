/* LVGL: lv_list items, lv_led blink, lv_btn ack, lv_label stats */
import { AlertOctagon, AlertTriangle, CheckCircle2, BellOff, Info, Filter } from "lucide-react";
import { useEffect, useState } from "react";

type AlarmType = "fault" | "warn" | "info";
interface Alarm { id: number; type: AlarmType; code: string; msg: string; detail: string; time: string; ack: boolean; }

const INIT: Alarm[] = [
  { id:1, type:"fault", code:"E-042", msg:"液压泵过载保护",  detail:"输入功率超额定值120%，触发电机保护继电器动作",   time:"10:42:15", ack:false },
  { id:2, type:"warn",  code:"W-015", msg:"冷却液温度偏高",  detail:"冷却液出口温度79°C，超过预警阀值75°C",          time:"09:15:30", ack:false },
  { id:3, type:"warn",  code:"W-033", msg:"液压油位偏低",    detail:"油箱液位传感器读値低于最小工作液位刻度线",       time:"08:50:07", ack:true  },
  { id:4, type:"info",  code:"I-001", msg:"系统上电自检通过", detail:"上电自检通过，所有传感器与执行器响应正常",       time:"08:00:01", ack:true  },
];

const T = {
  fault: { label:"故障", iconColor:"var(--destructive)", borderColor:"rgba(255,59,59,0.5)",   ledColor:"var(--destructive)", bg:"rgba(255,59,59,0.06)",  Icon: AlertOctagon  },
  warn:  { label:"警告", iconColor:"var(--chart-3)",     borderColor:"rgba(255,184,0,0.4)",   ledColor:"var(--chart-3)",     bg:"rgba(255,184,0,0.05)",  Icon: AlertTriangle },
  info:  { label:"信息", iconColor:"var(--chart-1)",     borderColor:"rgba(0,212,255,0.2)",   ledColor:"var(--chart-1)",     bg:"transparent",           Icon: Info          },
} as const;

export function Alarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(INIT);
  const [blink, setBlink]   = useState(true);
  const [filter, setFilter] = useState<"all"|AlarmType>("all");

  useEffect(() => {
    const t = setInterval(() => setBlink(v => !v), 650);
    return () => clearInterval(t);
  }, []);

  const counts = {
    all:   alarms.length,
    fault: alarms.filter(a => a.type==="fault").length,
    warn:  alarms.filter(a => a.type==="warn").length,
    info:  alarms.filter(a => a.type==="info").length,
    unack: alarms.filter(a => !a.ack).length,
  };
  const visible = alarms.filter(a => filter==="all" || a.type===filter);

  return (
    <div className="h-full w-full flex flex-col p-4 gap-3" style={{ background:"var(--background)", fontFamily:"var(--font-sans)" }}>
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold tracking-[0.2em]" style={{ color:"var(--foreground)" }}>异常报警</h2>
          {counts.unack > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-bold"
              style={{ background:"rgba(255,59,59,0.12)", border:"1px solid rgba(255,59,59,0.4)", color:"var(--destructive)", opacity: blink ? 1 : 0.35, fontFamily:"var(--font-mono)" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"var(--destructive)" }} />
              {counts.unack} 未确认
            </div>
          )}
        </div>
        <button onClick={() => setAlarms(p => p.filter(a => !a.ack))}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-sm"
          style={{ background:"var(--secondary)", border:"1px solid var(--border)", color:"var(--muted-foreground)" }}>
          <BellOff className="w-3.5 h-3.5" />清除已处理
        </button>
      </div>
      <div className="flex gap-2 shrink-0">
        {([{key:"all",label:"全部",val:counts.all,color:"var(--muted-foreground)"},{key:"fault",label:"故障",val:counts.fault,color:"var(--destructive)"},{key:"warn",label:"警告",val:counts.warn,color:"var(--chart-3)"},{key:"info",label:"信息",val:counts.info,color:"var(--chart-1)"}] as const).map(s => (
          <button key={s.key} onClick={() => setFilter(s.key as any)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-xs font-semibold"
            style={{ background:filter===s.key?"var(--secondary)":"var(--card)", border:`1px solid ${filter===s.key?s.color:"var(--border)"}`, color:s.color, fontFamily:"var(--font-sans)" }}>
            <Filter className="w-3 h-3" />{s.label}<span style={{ fontFamily:"var(--font-mono)", fontWeight:700 }}>{s.val}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0" style={{ scrollbarWidth:"none" }}>
        {visible.length === 0 && (<div className="flex-1 flex flex-col items-center justify-center gap-3"><BellOff className="w-10 h-10" style={{ color:"var(--muted-foreground)", opacity:0.3 }} /><span className="text-xs" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>无报警记录</span></div>)}
        {visible.map(alarm => {
          const cfg = T[alarm.type];
          return (
            <div key={alarm.id} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background:alarm.ack?"var(--card)":cfg.bg, border:`1px solid ${alarm.ack?"var(--border)":cfg.borderColor}`, borderLeft:`3px solid ${alarm.ack?"var(--border)":cfg.iconColor}`, opacity:alarm.ack?0.5:1, fontFamily:"var(--font-sans)" }}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background:cfg.ledColor, opacity:!alarm.ack&&blink?1:(!alarm.ack?0.2:0.3) }} />
              <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0" style={{ background:"var(--secondary)", border:"1px solid var(--border)" }}>
                <cfg.Icon className="w-5 h-5" style={{ color:cfg.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold" style={{ color:cfg.iconColor, fontFamily:"var(--font-mono)" }}>{alarm.code}</span>
                  <span className="text-xs font-semibold px-1.5 py-px rounded-sm" style={{ background:cfg.bg, color:cfg.iconColor, border:`1px solid ${cfg.borderColor}` }}>{cfg.label}</span>
                  <span className="text-xs ml-auto" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{alarm.time}</span>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color:"var(--foreground)" }}>{alarm.msg}</p>
                <p className="text-xs leading-relaxed" style={{ color:"var(--muted-foreground)", fontFamily:"var(--font-mono)" }}>{alarm.detail}</p>
              </div>
              <div className="shrink-0 self-center ml-1">
                {!alarm.ack
                  ? <button onClick={() => setAlarms(p => p.map(a => a.id===alarm.id?{...a,ack:true}:a))} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-sm" style={{ background:"rgba(255,59,59,0.12)", border:"1px solid rgba(255,59,59,0.4)", color:"var(--destructive)" }}><CheckCircle2 className="w-3.5 h-3.5" />复位</button>
                  : <div className="flex items-center gap-1 px-2" style={{ color:"var(--muted-foreground)" }}><CheckCircle2 className="w-3.5 h-3.5" /><span className="text-xs" style={{ fontFamily:"var(--font-mono)" }}>已确认</span></div>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}