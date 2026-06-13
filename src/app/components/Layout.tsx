/* LVGL: lv_obj root → top status bar + lv_tabview content + lv_tabview bottom nav */
import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Activity, AlertOctagon, Wrench, BarChart2, PhoneCall, Cloud, Wifi } from "lucide-react";

const TABS = [
  { path: "/monitoring",  label: "数据监控", Icon: Activity,     varColor: "var(--chart-1)" },
  { path: "/alarms",      label: "异常报警", Icon: AlertOctagon, varColor: "var(--destructive)", badge: 1 },
  { path: "/maintenance", label: "保养提醒", Icon: Wrench,       varColor: "var(--chart-3)" },
  { path: "/history",     label: "历史追溯", Icon: BarChart2,    varColor: "var(--chart-5)" },
  { path: "/service",     label: "商家服务", Icon: PhoneCall,    varColor: "var(--chart-2)" },
] as const;

export function Layout() {
  const [now, setNow]   = useState(new Date());
  const [blink, setBlink] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t1 = setInterval(() => setNow(new Date()), 1000);
    const t2 = setInterval(() => setBlink(v => !v), 750);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const timeStr = now.toLocaleTimeString("zh-CN", { hour12: false });
  const dateStr = now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
  const activeIdx = TABS.findIndex(t => location.pathname.startsWith(t.path));

  return (
    <div className="flex flex-col h-full w-full bg-background" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="h-12 shrink-0 flex items-center px-5" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 w-52">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--chart-2)", opacity: blink ? 1 : 0.3 }} />
          <span className="text-xs font-semibold tracking-[0.15em]" style={{ color: "var(--chart-2)", fontFamily: "var(--font-mono)" }}>STATION-01</span>
          <span className="text-xs px-1.5 py-0.5 rounded-sm ml-1" style={{ background: "var(--secondary)", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>在线</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center leading-none gap-0.5">
          <span className="text-lg font-bold tracking-widest" style={{ color: "var(--foreground)", fontFamily: "var(--font-mono)" }}>{timeStr}</span>
          <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{dateStr}</span>
        </div>
        <div className="flex items-center gap-3 w-52 justify-end">
          <div className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--primary)", fontFamily: "var(--font-mono)" }}>云端已连</span>
          </div>
          <Wifi className="w-3.5 h-3.5" style={{ color: "var(--chart-2)" }} />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-bold" style={{ background: "rgba(255,59,59,0.12)", border: "1px solid rgba(255,59,59,0.4)", color: "var(--destructive)", fontFamily: "var(--font-mono)", opacity: blink ? 1 : 0.4 }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--destructive)", display: "inline-block" }} />
            1报警
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0"><Outlet /></div>
      <div className="h-12 shrink-0 flex" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        {TABS.map((tab, i) => {
          const isActive = activeIdx === i;
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all"
              style={{ background: isActive ? "rgba(0,212,255,0.05)" : "transparent", fontFamily: "var(--font-sans)" }}
            >
              {isActive && <div className="absolute top-0 left-3 right-3 h-px" style={{ background: tab.varColor }} />}
              {"badge" in tab && tab.badge && (
                <div className="absolute top-1.5 right-[22%] w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "var(--destructive)" }}>
                  <span className="text-white font-bold" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>{tab.badge}</span>
                </div>
              )}
              <tab.Icon className="w-4 h-4" style={{ color: isActive ? tab.varColor : "var(--muted-foreground)" }} />
              <span className="text-xs font-medium" style={{ color: isActive ? tab.varColor : "var(--muted-foreground)" }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}