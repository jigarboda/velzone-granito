import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase";

const FACTORIES = ["Factory A - Morbi", "Factory B - Wankaner", "Factory C - Rajkot", "Factory D - Halvad"];
const SIZES = ["600x600mm", "600x1200mm", "800x800mm", "800x1600mm", "1200x1200mm", "1200x1800mm"];
const SURFACES = ["Glossy", "Matte", "Satin", "Carving", "Rustic", "Sugar", "High Gloss", "Lapato"];

const Ic = {
  dashboard: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  tiles: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>,
  transfer: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  history: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  report: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  analytics: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  search: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  logout: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  back: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
  check: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  factory: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 20h20V8l-6 4V8l-6 4V4H2z"/></svg>,
  menu: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  arrow: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  upload: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  chevRight: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  edit: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  restore: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  log: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  loading: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4m-8-10h4m12 0h4m-3.5-6.5L17 7m-10 10l-2.5 2.5M20.5 17.5L18 15M7 7L4.5 4.5"/></svg>,
};

const SC = { active: "#22c55e", damaged: "#f59e0b", lost: "#ef4444" };
const SL = { active: "Active", damaged: "Damaged", lost: "Lost" };
const FT = `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`;
const P = { bg: "#F5F0EB", card: "#FFF", primary: "#B8860B", primaryDark: "#8B6508", primaryLight: "#F5ECD7", text: "#1A1612", muted: "#8C8279", border: "#E8E0D8", accent: "#D4A853", sidebar: "#1A1612", sidebarHover: "#2A2520", danger: "#C0392B", success: "#27AE60", warning: "#F39C12" };
const todayStr = () => new Date().toISOString().split("T")[0];

// ─── Database helpers ───
const db = {
  async getMasters() {
    const { data, error } = await supabase.from("masters").select("*").order("name");
    if (error) throw error;
    return data || [];
  },
  async getTransfers() {
    const { data, error } = await supabase.from("transfers").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getLogs(limit) {
    let q = supabase.from("activity_logs").select("*").order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async addMaster(m) {
    const { data, error } = await supabase.from("masters").insert({
      name: m.name, manufacturing_date: m.date, factory: m.factory,
      size: m.size, surface: m.surface, status: "active", current_location: m.factory,
    }).select().single();
    if (error) throw error;
    return data;
  },
  async updateMaster(id, fields) {
    const { error } = await supabase.from("masters").update(fields).eq("id", id);
    if (error) throw error;
  },
  async deleteMaster(id) {
    const { error } = await supabase.from("masters").delete().eq("id", id);
    if (error) throw error;
  },
  async addTransfer(t) {
    const { error } = await supabase.from("transfers").insert(t);
    if (error) throw error;
  },
  async addLog(log) {
    const { error } = await supabase.from("activity_logs").insert(log);
    if (error) throw error;
  },
  async getProfile(uid) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (error) throw error;
    return data;
  },
};

// ─── Normalize master from DB format ───
function norm(m) {
  return {
    id: m.id, name: m.name, date: m.manufacturing_date, factory: m.factory,
    size: m.size, surface: m.surface, status: m.status, currentLocation: m.current_location,
    damageReportDate: m.damage_report_date, damageReportNote: m.damage_report_note,
  };
}

// ═══════════════════════════════
//  APP ROOT
// ═══════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [masters, setMasters] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [drill, setDrill] = useState(null);

  const showToast = useCallback((m, t = "success") => { setToast({ m, t }); setTimeout(() => setToast(null), 3000); }, []);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid) => {
    try {
      const p = await db.getProfile(uid);
      setProfile(p);
    } catch (e) { console.error("Profile error:", e); }
    setLoading(false);
  };

  // Load data when logged in
  useEffect(() => {
    if (user && profile) loadData();
  }, [user, profile]);

  const loadData = async () => {
    try {
      const [m, t, l] = await Promise.all([db.getMasters(), db.getTransfers(), db.getLogs()]);
      setMasters(m.map(norm));
      setTransfers(t);
      setLogs(l);
    } catch (e) { console.error("Load error:", e); showToast("Error loading data", "error"); }
  };

  const addLog = useCallback(async (type, desc, count, detail, icon, color, masterDetails = []) => {
    const log = {
      type, description: desc, master_count: count, detail,
      icon, color, master_details: masterDetails,
      user_id: user?.id, user_name: profile?.name || "Unknown",
    };
    try {
      await db.addLog(log);
      const updated = await db.getLogs();
      setLogs(updated);
    } catch (e) { console.error("Log error:", e); }
  }, [user, profile]);

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setPage("dashboard"); setSidebarOpen(false);
  };

  // Loading state
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: P.bg, fontFamily: FT }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center" }}>
        <div style={{ animation: "spin 1s linear infinite", color: P.primary, marginBottom: 16 }}>{Ic.loading}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: P.primary }}>VELZONE GRANITO</div>
        <div style={{ fontSize: 12, color: P.muted, marginTop: 4 }}>Loading...</div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user || !profile) return <Login onLogin={handleLogin} />;

  const nav = (p) => { setPage(p); setSidebarOpen(false); setDrill(null); };
  const adm = profile.role === "admin";

  // Attach transfers to masters for display
  const mastersWithTransfers = masters.map(m => ({
    ...m,
    transfers: transfers.filter(t => t.master_id === m.id).sort((a, b) => new Date(a.transfer_date) - new Date(b.transfer_date)),
  }));

  const navItems = adm ? [
    { id: "dashboard", icon: Ic.dashboard, label: "Dashboard" }, { id: "masters", icon: Ic.tiles, label: "Master Tiles" },
    { id: "add-master", icon: Ic.plus, label: "Add Master" }, { id: "transfer", icon: Ic.transfer, label: "Transfer" },
    { id: "history", icon: Ic.history, label: "Track Master" }, { id: "report", icon: Ic.report, label: "Report Damage" },
    { id: "analytics", icon: Ic.analytics, label: "Analytics" },
  ] : [
    { id: "transfer", icon: Ic.transfer, label: "Transfer" }, { id: "add-master", icon: Ic.plus, label: "Add Master" },
    { id: "report", icon: Ic.report, label: "Report Damage" }, { id: "history", icon: Ic.history, label: "Track Master" },
  ];
  const cp = navItems.find(n => n.id === page) ? page : navItems[0].id;

  return (
    <div style={{ fontFamily: FT, background: P.bg, minHeight: "100vh", display: "flex", color: P.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 998 }} />}
      <aside style={{ width: 260, background: P.sidebar, color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: sidebarOpen ? 0 : -260, bottom: 0, zIndex: 999, transition: "left 0.3s ease", boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.3)" : "none" }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #333" }}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: P.accent, letterSpacing: 1 }}>VELZONE</div><div style={{ fontSize: 11, color: "#888", letterSpacing: 3, marginTop: 2 }}>GRANITO</div></div>
        <nav style={{ flex: 1, padding: "12px 0" }}>{navItems.map(item => (<button key={item.id} onClick={() => nav(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 20px", border: "none", background: cp === item.id ? P.sidebarHover : "transparent", color: cp === item.id ? P.accent : "#aaa", cursor: "pointer", fontSize: 14, fontFamily: FT, borderLeft: cp === item.id ? `3px solid ${P.accent}` : "3px solid transparent" }}>{item.icon}<span>{item.label}</span></button>))}</nav>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #333" }}><div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Logged in as</div><div style={{ fontSize: 14, fontWeight: 600, color: "#ccc" }}>{profile.name}</div><div style={{ fontSize: 11, color: P.accent, textTransform: "uppercase", letterSpacing: 1 }}>{adm ? "Admin" : "Team Member"}</div></div>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", border: "none", borderTop: "1px solid #333", background: "transparent", color: "#888", cursor: "pointer", fontSize: 14, fontFamily: FT }}>{Ic.logout}<span>Logout</span></button>
      </aside>
      <main style={{ flex: 1, minHeight: "100vh" }}>
        <header style={{ background: P.card, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${P.border}`, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: P.text, padding: 4 }}>{Ic.menu}</button><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: P.primary }}>VELZONE GRANITO</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: adm ? P.primaryLight : "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: adm ? P.primary : P.success }}>{profile.name.charAt(0)}</div><div style={{ fontSize: 13 }}><div style={{ fontWeight: 600 }}>{profile.name}</div><div style={{ fontSize: 11, color: P.muted }}>{adm ? "Admin" : "Team"}</div></div></div>
        </header>
        <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
          {cp === "dashboard" && <Dashboard masters={mastersWithTransfers} onNav={nav} drill={drill} setDrill={setDrill} showToast={showToast} logs={logs} adm={adm} profile={profile} user={user} loadData={loadData} addLog={addLog} />}
          {cp === "masters" && <Masters masters={mastersWithTransfers} adm={adm} showToast={showToast} loadData={loadData} addLog={addLog} profile={profile} user={user} />}
          {cp === "add-master" && <AddMaster showToast={showToast} loadData={loadData} addLog={addLog} masters={masters} />}
          {cp === "transfer" && <Transfer masters={mastersWithTransfers} showToast={showToast} loadData={loadData} addLog={addLog} user={user} />}
          {cp === "history" && <History masters={mastersWithTransfers} adm={adm} showToast={showToast} loadData={loadData} addLog={addLog} profile={profile} user={user} />}
          {cp === "report" && <ReportPage masters={mastersWithTransfers} showToast={showToast} loadData={loadData} addLog={addLog} />}
          {cp === "analytics" && <Analytics masters={mastersWithTransfers} logs={logs} />}
        </div>
      </main>
      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.t === "success" ? P.success : P.danger, color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999, animation: "slideUp 0.3s ease", fontFamily: FT, maxWidth: "90%", textAlign: "center" }}>{toast.m}</div>}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}input,select,textarea{font-family:${FT}}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}`}</style>
    </div>
  );
}

// ═══════════════════════════════
//  LOGIN
// ═══════════════════════════════
function Login({ onLogin }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [ld, setLd] = useState(false);
  const go = async () => {
    setLd(true); setErr("");
    try { await onLogin(email, pw); }
    catch (e) { setErr(e.message || "Login failed"); setLd(false); }
  };
  const inp = { width: "100%", padding: "12px 14px", border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 14, outline: "none", background: "#FAFAF8" };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${P.sidebar} 0%, #2C2418 50%, ${P.primaryDark} 100%)`, fontFamily: FT, padding: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <div style={{ background: P.card, borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}><div style={{ width: 64, height: 64, borderRadius: 16, background: P.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{Ic.tiles}</div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: P.primary, letterSpacing: 1 }}>VELZONE</div><div style={{ fontSize: 12, color: P.muted, letterSpacing: 4, marginTop: 2 }}>GRANITO</div><div style={{ fontSize: 13, color: P.muted, marginTop: 12 }}>Master Tile Management</div></div>
        <div style={{ marginBottom: 18 }}><label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6 }}>EMAIL</label><input value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="Enter email" style={inp} onFocus={e => e.target.style.borderColor = P.primary} onBlur={e => e.target.style.borderColor = P.border} /></div>
        <div style={{ marginBottom: 24 }}><label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6 }}>PASSWORD</label><input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} placeholder="Enter password" onKeyDown={e => e.key === "Enter" && go()} style={inp} onFocus={e => e.target.style.borderColor = P.primary} onBlur={e => e.target.style.borderColor = P.border} /></div>
        {err && <div style={{ color: P.danger, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{err}</div>}
        <button onClick={go} disabled={ld} style={{ width: "100%", padding: 13, background: P.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FT, opacity: ld ? 0.7 : 1 }}>{ld ? "Signing in..." : "Sign In"}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════
//  REUSABLE COMPONENTS
// ═══════════════════════════════
function MCard({ master: m, onClick }) {
  return (<div onClick={onClick} style={{ background: P.card, borderRadius: 12, padding: "14px 16px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", transition: "all 0.2s", borderLeft: `4px solid ${SC[m.status]}` }} onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"; }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{m.name}</div><div style={{ fontSize: 12, color: P.muted }}>{m.size} · {m.surface} · {m.date}</div></div><span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: SC[m.status] + "18", color: SC[m.status], textTransform: "uppercase" }}>{SL[m.status]}</span></div>
    <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 12, color: P.primary, fontWeight: 600 }}>📍 {m.currentLocation}</div><div style={{ fontSize: 12, color: P.muted }}>{(m.transfers || []).length} transfers</div></div>
  </div>);
}

function ActivityLog({ logs, showAll }) {
  const [expanded, setExpanded] = useState(null);
  const display = showAll ? logs : logs.slice(0, 10);
  const toggle = (id) => setExpanded(prev => prev === id ? null : id);
  return (
    <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>{Ic.log}<h3 style={{ fontSize: 17, fontWeight: 700 }}>Recent Activity</h3><span style={{ fontSize: 12, color: P.muted }}>({showAll ? "all" : "last 10"})</span></div>
      {display.length === 0 && <div style={{ textAlign: "center", padding: 30, color: P.muted, fontSize: 13 }}>No activity yet</div>}
      {display.map((log, i) => {
        const isOpen = expanded === log.id;
        const md = log.master_details || [];
        const hasMasters = md.length > 0;
        return (
          <div key={log.id}>
            <div onClick={() => hasMasters && toggle(log.id)} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: !isOpen && i < display.length - 1 ? `1px solid ${P.border}` : "none", cursor: hasMasters ? "pointer" : "default" }}>
              <div style={{ width: 36, flexShrink: 0, paddingTop: 2 }}><div style={{ width: 32, height: 32, borderRadius: 10, background: (log.color || P.primary) + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{log.icon}</div></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{log.description}</div>
                <div style={{ fontSize: 12, color: P.muted, marginBottom: 4 }}>
                  {(log.master_count || 1) > 1 && <span style={{ fontWeight: 600, color: log.color || P.primary }}>{log.master_count} masters · </span>}
                  {log.detail}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: P.muted, alignItems: "center", flexWrap: "wrap" }}>
                  <span>📅 {(log.created_at || "").split("T")[0]}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: P.primaryLight, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: P.primary }}>{(log.user_name || "?").charAt(0)}</span>
                    {log.user_name}
                  </span>
                  {hasMasters && <span style={{ marginLeft: "auto", color: P.primary, fontWeight: 600 }}>{isOpen ? "Hide" : `View ${md.length} master${md.length > 1 ? "s" : ""}`} <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", verticalAlign: "middle" }}><polyline points="6 9 12 15 18 9"/></svg></span>}
                </div>
              </div>
            </div>
            {isOpen && md.length > 0 && (
              <div style={{ marginLeft: 50, marginBottom: 14, padding: "14px 16px", background: "#F9F7F4", borderRadius: "0 0 12px 12px", borderTop: `1px dashed ${P.border}`, animation: "fadeIn 0.2s ease" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Masters ({md.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 0, fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 0.5, padding: "0 10px 8px", borderBottom: `1px solid ${P.border}` }}><div style={{ width: 28 }}>#</div><div>Name</div><div>Size</div><div>Surface</div></div>
                {md.map((m, j) => (
                  <div key={j} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 0, padding: "10px", fontSize: 13, background: j % 2 === 0 ? "transparent" : "#F3F0EC", borderBottom: j < md.length - 1 ? `1px solid ${P.border}40` : "none" }}>
                    <div style={{ width: 28, color: P.muted, fontSize: 12, fontWeight: 600 }}>{j + 1}</div>
                    <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: log.color || P.primary }} />{m.name}</div>
                    <div style={{ color: P.muted, fontSize: 12 }}>{m.size}</div>
                    <div style={{ color: P.muted, fontSize: 12 }}>{m.surface}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Detail({ master: m, onBack, adm, showToast, loadData, addLog, profile, user }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: m.name, date: m.date, factory: m.factory, size: m.size, surface: m.surface });
  const [confirmDel, setConfirmDel] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name || !form.date || !form.factory || !form.size || !form.surface) { showToast("All fields required", "error"); return; }
    setSaving(true);
    try {
      await db.updateMaster(m.id, { name: form.name, manufacturing_date: form.date, factory: form.factory, size: form.size, surface: form.surface });
      await addLog("edit", `Edited master "${form.name}"`, 1, "Updated details", "✏️", "#6366f1", [{ name: form.name, size: form.size, surface: form.surface }]);
      await loadData(); showToast(`"${form.name}" updated!`); setEdit(false);
    } catch (e) { showToast(e.message || "Error", "error"); }
    setSaving(false);
  };

  const restore = async () => {
    setSaving(true);
    try {
      await db.updateMaster(m.id, { status: "active", damage_report_date: null, damage_report_note: null });
      await addLog("restore", `Restored "${m.name}" to Active`, 1, `Previously ${SL[m.status]}`, "♻️", P.success, [{ name: m.name, size: m.size, surface: m.surface }]);
      await loadData(); showToast(`"${m.name}" restored!`);
    } catch (e) { showToast(e.message || "Error", "error"); }
    setSaving(false);
  };

  const remove = async () => {
    setSaving(true);
    try {
      await addLog("delete", `Removed "${m.name}" permanently`, 1, `Was ${SL[m.status]} at ${m.currentLocation}`, "🗑️", P.danger, [{ name: m.name, size: m.size, surface: m.surface }]);
      await db.deleteMaster(m.id);
      await loadData(); showToast(`"${m.name}" removed`); onBack();
    } catch (e) { showToast(e.message || "Error", "error"); }
    setSaving(false);
  };

  const inp = { width: "100%", padding: "10px 12px", border: `1.5px solid ${P.border}`, borderRadius: 8, fontSize: 13, outline: "none", background: "#FAFAF8" };
  const transfers = m.transfers || [];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: P.primary, cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 20, fontFamily: FT, padding: 0 }}>{Ic.back} Back</button>
      <div style={{ background: P.card, borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>{edit ? "Edit Master" : m.name}</h2><div style={{ color: P.primary, fontWeight: 600, fontSize: 13, marginTop: 4 }}>📍 {m.currentLocation}</div></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20, background: SC[m.status] + "18", color: SC[m.status], textTransform: "uppercase" }}>{SL[m.status]}</span>
            {adm && !edit && <button onClick={() => setEdit(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${P.primary}`, background: "transparent", color: P.primary, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: FT }}>{Ic.edit} Edit</button>}
          </div>
        </div>
        {!edit ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{[{ l: "Manufactured", v: m.date }, { l: "Origin Factory", v: m.factory }, { l: "Size", v: m.size }, { l: "Surface", v: m.surface }].map((d, i) => (<div key={i} style={{ padding: "10px 14px", background: "#F9F7F4", borderRadius: 10 }}><div style={{ fontSize: 11, color: P.muted, fontWeight: 600, marginBottom: 4 }}>{d.l}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{d.v}</div></div>))}</div>
        ) : (
          <div>
            {[{ k: "name", l: "Design Name", t: "text" }, { k: "date", l: "Date", t: "date" }, { k: "factory", l: "Factory", t: "select", o: FACTORIES }, { k: "size", l: "Size", t: "select", o: SIZES }, { k: "surface", l: "Surface", t: "select", o: SURFACES }].map(f => (<div key={f.k} style={{ marginBottom: 14 }}><label style={{ fontSize: 11, fontWeight: 600, color: P.muted, display: "block", marginBottom: 4, textTransform: "uppercase" }}>{f.l}</label>{f.t === "select" ? <select value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} style={inp}>{f.o.map(o => <option key={o} value={o}>{o}</option>)}</select> : <input type={f.t} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} style={inp} />}</div>))}
            <div style={{ display: "flex", gap: 10 }}><button onClick={save} disabled={saving} style={{ flex: 1, padding: 12, background: P.success, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FT, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save"}</button><button onClick={() => setEdit(false)} style={{ flex: 1, padding: 12, background: "#F3F0EC", color: P.text, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FT }}>Cancel</button></div>
          </div>
        )}
      </div>
      {adm && (m.status === "damaged" || m.status === "lost") && !edit && (
        <div style={{ background: P.card, borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `4px solid ${SC[m.status]}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Admin Actions</h3>
          <p style={{ fontSize: 13, color: P.muted, marginBottom: 16 }}>This master is <b style={{ color: SC[m.status] }}>{SL[m.status]}</b>.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={restore} disabled={saving} style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 16px", background: P.success, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FT }}>{Ic.restore} Restore to Active</button>
            {!confirmDel ? <button onClick={() => setConfirmDel(true)} style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 16px", background: "transparent", color: P.danger, border: `1.5px solid ${P.danger}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FT }}>{Ic.trash} Remove</button>
              : <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 12, color: P.danger, fontWeight: 600, textAlign: "center", marginBottom: 8 }}>Are you sure?</div><div style={{ display: "flex", gap: 8 }}><button onClick={remove} disabled={saving} style={{ flex: 1, padding: 10, background: P.danger, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FT }}>Yes</button><button onClick={() => setConfirmDel(false)} style={{ flex: 1, padding: 10, background: "#F3F0EC", color: P.text, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FT }}>No</button></div></div>}
          </div>
        </div>
      )}
      <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Transfer History ({transfers.length})</h3>
        <div style={{ display: "flex", gap: 14 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: P.success, border: "2px solid #fff", boxShadow: `0 0 0 2px ${P.success}` }} />{transfers.length > 0 && <div style={{ flex: 1, width: 2, background: P.border, marginTop: 4 }} />}</div><div style={{ paddingBottom: 20 }}><div style={{ fontSize: 13, fontWeight: 700 }}>Manufactured at {m.factory}</div><div style={{ fontSize: 12, color: P.muted }}>{m.date}</div></div></div>
        {transfers.map((t, i) => (<div key={i} style={{ display: "flex", gap: 14 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: P.primary, border: "2px solid #fff", boxShadow: `0 0 0 2px ${P.accent}` }} />{i < transfers.length - 1 && <div style={{ flex: 1, width: 2, background: P.border, marginTop: 4 }} />}</div><div style={{ paddingBottom: 20 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{t.from_factory} → {t.to_factory}</div><div style={{ fontSize: 12, color: P.muted }}>{t.transfer_date}</div></div></div>))}
        {!transfers.length && <div style={{ color: P.muted, fontSize: 13, fontStyle: "italic" }}>No transfers yet</div>}
      </div>
      {m.damageReportNote && <div style={{ background: P.card, borderRadius: 16, padding: 24, marginTop: 20, borderLeft: `4px solid ${SC[m.status]}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: SC[m.status] }}>{m.status === "damaged" ? "⚠️ Damage Report" : "🔴 Lost Report"}</h3><div style={{ fontSize: 13, marginBottom: 6 }}><b>Date:</b> {m.damageReportDate}</div><div style={{ fontSize: 13 }}><b>Note:</b> {m.damageReportNote}</div></div>}
    </div>
  );
}

// ═══════════════════════════════
//  DASHBOARD
// ═══════════════════════════════
function Dashboard({ masters, onNav, drill, setDrill, showToast, logs, adm, loadData, addLog, profile, user }) {
  const fc = FACTORIES.map(f => ({ name: f, total: masters.filter(m => m.currentLocation === f).length, active: masters.filter(m => m.currentLocation === f && m.status === "active").length, damaged: masters.filter(m => m.currentLocation === f && m.status === "damaged").length, lost: masters.filter(m => m.currentLocation === f && m.status === "lost").length }));

  if (drill) {
    let list, label;
    if (drill.type === "status") { list = drill.status === "all" ? masters : masters.filter(m => m.status === drill.status); label = drill.status === "all" ? "All Masters" : `${SL[drill.status]} Masters`; }
    else { list = masters.filter(m => m.currentLocation === drill.factory); label = drill.factory; }
    return <DrillList list={list} title={label} sub={`${list.length} tiles`} onBack={() => setDrill(null)} adm={adm} showToast={showToast} loadData={loadData} addLog={addLog} profile={profile} user={user} />;
  }

  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1><p style={{ color: P.muted, fontSize: 14 }}>Welcome back</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
      {[{ l: "Total", v: masters.length, c: P.primary, s: "all" }, { l: "Active", v: masters.filter(m => m.status === "active").length, c: P.success, s: "active" }, { l: "Damaged", v: masters.filter(m => m.status === "damaged").length, c: P.warning, s: "damaged" }, { l: "Lost", v: masters.filter(m => m.status === "lost").length, c: P.danger, s: "lost" }].map((c, i) => (
        <div key={i} onClick={() => setDrill({ type: "status", status: c.s })} style={{ background: P.card, borderRadius: 14, padding: "18px 16px", borderLeft: `4px solid ${c.c}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 28, fontWeight: 700, color: c.c }}>{c.v}</div><div style={{ fontSize: 12, color: P.muted, marginTop: 4 }}>{c.l}</div></div><div style={{ color: c.c, opacity: 0.4 }}>{Ic.chevRight}</div></div>
          <div style={{ fontSize: 11, color: P.primary, marginTop: 8, fontWeight: 500 }}>Tap to view →</div>
        </div>))}
    </div>
    <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>{Ic.factory} Factory Inventory</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
      {fc.map((f, i) => (<div key={i} onClick={() => setDrill({ type: "factory", factory: f.name })} style={{ background: P.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginBottom: 8 }}>{f.name}</div><div style={{ color: P.primary, opacity: 0.4 }}>{Ic.chevRight}</div></div>
        <div style={{ fontSize: 32, fontWeight: 700, color: P.primary, marginBottom: 10 }}>{f.total}</div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, flexWrap: "wrap" }}><span style={{ color: SC.active }}>● {f.active}</span>{f.damaged > 0 && <span style={{ color: SC.damaged }}>● {f.damaged}</span>}{f.lost > 0 && <span style={{ color: SC.lost }}>● {f.lost}</span>}</div>
      </div>))}
    </div>
    <div style={{ marginBottom: 28 }}><ActivityLog logs={logs} showAll={false} /></div>
    <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
      {[{ l: "Add Master", i: Ic.plus, p: "add-master", c: P.success }, { l: "Transfer", i: Ic.transfer, p: "transfer", c: P.primary }, { l: "Track", i: Ic.history, p: "history", c: "#6366f1" }, { l: "Report", i: Ic.report, p: "report", c: P.danger }].map((a, j) => (
        <button key={j} onClick={() => onNav(a.p)} style={{ background: P.card, border: `1.5px solid ${P.border}`, borderRadius: 14, padding: "18px 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: FT }} onMouseEnter={e => { e.currentTarget.style.borderColor = a.c; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; }}>
          <div style={{ color: a.c }}>{a.i}</div><span style={{ fontSize: 13, fontWeight: 600 }}>{a.l}</span>
        </button>))}
    </div>
  </div>);
}

function DrillList({ list, title, sub, onBack, adm, showToast, loadData, addLog, profile, user }) {
  const [q, setQ] = useState(""); const [sel, setSel] = useState(null);
  const f = list.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
  if (sel) { const live = list.find(m => m.id === sel.id); if (!live) { setSel(null); return null; } return <Detail master={live} onBack={() => setSel(null)} adm={adm} showToast={showToast} loadData={loadData} addLog={addLog} profile={profile} user={user} />; }
  return (<div style={{ animation: "fadeIn 0.3s ease" }}>
    {onBack && <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: P.primary, cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 16, fontFamily: FT, padding: 0 }}>{Ic.back} Back</button>}
    <div style={{ marginBottom: 16 }}><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{title}</h2>{sub && <p style={{ color: P.muted, fontSize: 13, marginTop: 2 }}>{sub}</p>}</div>
    <div style={{ position: "relative", marginBottom: 14 }}><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: P.muted }}>{Ic.search}</div><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "11px 14px 11px 42px", border: `1.5px solid ${P.border}`, borderRadius: 12, fontSize: 14, outline: "none", background: P.card }} /></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{f.map(m => <MCard key={m.id} master={m} onClick={() => setSel(m)} />)}{!f.length && <div style={{ textAlign: "center", padding: 40, color: P.muted }}>No masters found</div>}</div>
  </div>);
}

// ═══════════════════════════════
//  MASTER TILES LIST
// ═══════════════════════════════
function Masters({ masters, adm, showToast, loadData, addLog, profile, user }) {
  const [q, setQ] = useState(""); const [ff, setFF] = useState(""); const [fs, setFS] = useState(""); const [fz, setFZ] = useState(""); const [fu, setFU] = useState(""); const [sel, setSel] = useState(null);
  const filtered = masters.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) && (!ff || m.currentLocation === ff) && (!fs || m.status === fs) && (!fz || m.size === fz) && (!fu || m.surface === fu));
  const af = [ff, fs, fz, fu].filter(Boolean).length;
  if (sel) { const live = masters.find(m => m.id === sel.id); if (!live) { setSel(null); return null; } return <Detail master={live} onBack={() => setSel(null)} adm={adm} showToast={showToast} loadData={loadData} addLog={addLog} profile={profile} user={user} />; }
  const ss = a => ({ padding: "9px 12px", border: `1.5px solid ${a ? P.primary : P.border}`, borderRadius: 10, fontSize: 13, background: a ? P.primaryLight : P.card, outline: "none", color: P.text, width: "100%" });
  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <div style={{ marginBottom: 20 }}><h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Master Tiles</h1><p style={{ color: P.muted, fontSize: 14 }}>{filtered.length} of {masters.length}{af > 0 && <span style={{ color: P.primary }}> · {af} filter{af > 1 ? "s" : ""}</span>}</p></div>
    <div style={{ position: "relative", marginBottom: 14 }}><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: P.muted }}>{Ic.search}</div><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "12px 14px 12px 42px", border: `1.5px solid ${P.border}`, borderRadius: 12, fontSize: 14, outline: "none", background: P.card }} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      <select value={ff} onChange={e => setFF(e.target.value)} style={ss(ff)}><option value="">All Factories</option>{FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}</select>
      <select value={fs} onChange={e => setFS(e.target.value)} style={ss(fs)}><option value="">All Status</option><option value="active">Active</option><option value="damaged">Damaged</option><option value="lost">Lost</option></select>
      <select value={fz} onChange={e => setFZ(e.target.value)} style={ss(fz)}><option value="">All Sizes</option>{SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select>
      <select value={fu} onChange={e => setFU(e.target.value)} style={ss(fu)}><option value="">All Surfaces</option>{SURFACES.map(s => <option key={s} value={s}>{s}</option>)}</select>
    </div>
    {af > 0 && <button onClick={() => { setFF(""); setFS(""); setFZ(""); setFU(""); }} style={{ fontSize: 12, color: P.danger, background: "none", border: "none", cursor: "pointer", fontFamily: FT, fontWeight: 600, marginBottom: 14, padding: 0 }}>✕ Clear</button>}
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{filtered.map(m => <MCard key={m.id} master={m} onClick={() => setSel(m)} />)}{!filtered.length && <div style={{ textAlign: "center", padding: 40, color: P.muted }}>No masters found</div>}</div>
  </div>);
}

// ═══════════════════════════════
//  ADD MASTER
// ═══════════════════════════════
function AddMaster({ showToast, loadData, addLog, masters }) {
  const [mode, setMode] = useState("single");
  const [form, setForm] = useState({ name: "", date: "", factory: "", size: "", surface: "" });
  const [saving, setSaving] = useState(false);
  const [ed, setEd] = useState([]); const [ep, setEp] = useState(false); const fr = useRef(null);

  const add = async () => {
    if (!form.name || !form.date || !form.factory || !form.size || !form.surface) { showToast("Fill all fields", "error"); return; }
    setSaving(true);
    try {
      await db.addMaster(form);
      await addLog("add", `Added new master "${form.name}"`, 1, `at ${form.factory}`, "➕", P.success, [{ name: form.name, size: form.size, surface: form.surface }]);
      await loadData();
      showToast(`"${form.name}" added!`);
      setForm({ name: "", date: "", factory: "", size: "", surface: "" });
    } catch (e) { showToast(e.message || "Error adding master", "error"); }
    setSaving(false);
  };

  const upload = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = evt => {
      try {
        const ls = evt.target.result.split("\n").filter(l => l.trim());
        if (ls.length < 2) { showToast("Need header + data", "error"); return; }
        const h = ls[0].split(",").map(x => x.trim().toLowerCase());
        const ni = h.findIndex(x => x.includes("name") || x.includes("design"));
        if (ni === -1) { showToast("Name column not found", "error"); return; }
        const di = h.findIndex(x => x.includes("date")); const fi = h.findIndex(x => x.includes("factory"));
        const si = h.findIndex(x => x.includes("size")); const ui = h.findIndex(x => x.includes("surface"));
        const rows = [];
        for (let i = 1; i < ls.length; i++) {
          const c = ls[i].split(",").map(x => x.trim()); if (!c[ni]) continue;
          const row = { name: c[ni], date: di >= 0 ? c[di] || todayStr() : todayStr(), factory: fi >= 0 ? c[fi] || FACTORIES[0] : FACTORIES[0], size: si >= 0 ? c[si] || SIZES[0] : SIZES[0], surface: ui >= 0 ? c[ui] || SURFACES[0] : SURFACES[0], valid: true, error: "" };
          if (masters.some(m => m.name.toLowerCase() === row.name.toLowerCase())) { row.valid = false; row.error = "Exists"; }
          if (rows.some(x => x.name.toLowerCase() === row.name.toLowerCase())) { row.valid = false; row.error = "Duplicate"; }
          rows.push(row);
        }
        setEd(rows); setEp(true);
      } catch { showToast("Error reading file", "error"); }
    };
    r.readAsText(file); e.target.value = "";
  };

  const bulkAdd = async () => {
    const v = ed.filter(r => r.valid); if (!v.length) { showToast("No valid rows", "error"); return; }
    setSaving(true);
    try {
      for (const r of v) await db.addMaster(r);
      await addLog("bulk_add", `Bulk added ${v.length} masters via CSV`, v.length, `${v.map(r => r.name).slice(0, 3).join(", ")}${v.length > 3 ? "..." : ""}`, "📄", P.success, v.map(r => ({ name: r.name, size: r.size, surface: r.surface })));
      await loadData();
      showToast(`${v.length} added!`); setEd([]); setEp(false);
    } catch (e) { showToast(e.message || "Error", "error"); }
    setSaving(false);
  };

  const inp = { width: "100%", padding: "12px 14px", border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 14, outline: "none", background: "#FAFAF8" };

  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Add New Master</h1><p style={{ color: P.muted, fontSize: 14, marginBottom: 20 }}>Register new master tiles</p>
    <div style={{ display: "flex", background: P.card, borderRadius: 12, padding: 4, marginBottom: 20, border: `1.5px solid ${P.border}` }}>{[{ id: "single", l: "Single Entry", i: Ic.plus }, { id: "excel", l: "Upload CSV", i: Ic.upload }].map(m => (<button key={m.id} onClick={() => { setMode(m.id); setEp(false); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: FT, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: mode === m.id ? P.primary : "transparent", color: mode === m.id ? "#fff" : P.muted }}>{m.i} {m.l}</button>))}</div>
    {mode === "single" && <div style={{ background: P.card, borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {[{ k: "name", l: "Design Name", t: "text", p: "e.g. Statuario White" }, { k: "date", l: "Date", t: "date" }, { k: "factory", l: "Factory", t: "select", o: FACTORIES }, { k: "size", l: "Size", t: "select", o: SIZES }, { k: "surface", l: "Surface", t: "select", o: SURFACES }].map(f => (<div key={f.k} style={{ marginBottom: 18 }}><label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6, textTransform: "uppercase" }}>{f.l} *</label>{f.t === "select" ? <select value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} style={{ ...inp, color: form[f.k] ? P.text : "#aaa" }}><option value="">Select</option>{f.o.map(o => <option key={o} value={o}>{o}</option>)}</select> : <input type={f.t} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.p || ""} style={inp} />}</div>))}
      <button onClick={add} disabled={saving} style={{ width: "100%", padding: 14, background: P.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FT, opacity: saving ? 0.7 : 1 }}>{saving ? "Adding..." : "+ Add Master"}</button>
    </div>}
    {mode === "excel" && !ep && <div style={{ background: P.card, borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>CSV Format</h3>
      <div style={{ background: "#F9F7F4", borderRadius: 10, padding: 14, fontSize: 12, fontFamily: "monospace", lineHeight: 1.8, marginBottom: 20 }}><div style={{ fontWeight: 700, color: P.primary }}>Design Name, Date, Factory, Size, Surface</div><div style={{ color: P.muted }}>Statuario White, 2024-01-15, Factory A - Morbi, 600x1200mm, Glossy</div></div>
      <input ref={fr} type="file" accept=".csv,.txt" onChange={upload} style={{ display: "none" }} /><button onClick={() => fr.current?.click()} style={{ width: "100%", padding: "40px 20px", background: P.primaryLight, color: P.primary, border: `2px dashed ${P.primary}`, borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FT, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>{Ic.upload}<span>Upload CSV</span></button>
    </div>}
    {mode === "excel" && ep && <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div><h3 style={{ fontSize: 16, fontWeight: 700 }}>Preview ({ed.length})</h3><p style={{ fontSize: 12, color: P.muted }}>{ed.filter(r => r.valid).length} valid · {ed.filter(r => !r.valid).length} errors</p></div><button onClick={() => { setEp(false); setEd([]); }} style={{ fontSize: 12, color: P.danger, background: "none", border: "none", cursor: "pointer", fontFamily: FT, fontWeight: 600 }}>✕</button></div>
      <div style={{ maxHeight: 350, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>{ed.map((r, i) => (<div key={i} style={{ padding: "12px 14px", borderRadius: 10, fontSize: 13, background: r.valid ? "#F0FFF4" : "#FFF5F5", border: `1px solid ${r.valid ? "#C6F6D5" : "#FED7D7"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: P.muted }}>{r.size} · {r.surface}</div></div>{r.valid ? <span style={{ color: P.success, fontSize: 12, fontWeight: 600 }}>✓</span> : <span style={{ color: P.danger, fontSize: 12, fontWeight: 600 }}>{r.error}</span>}</div>))}</div>
      {ed.filter(r => r.valid).length > 0 && <button onClick={bulkAdd} disabled={saving} style={{ width: "100%", padding: 14, background: P.success, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FT, opacity: saving ? 0.7 : 1 }}>{saving ? "Adding..." : `+ Add ${ed.filter(r => r.valid).length} Masters`}</button>}
    </div>}
  </div>);
}

// ═══════════════════════════════
//  TRANSFER
// ═══════════════════════════════
function Transfer({ masters, showToast, loadData, addLog, user }) {
  const [ff, setFF] = useState(""); const [tf, setTF] = useState(""); const [sel, setSel] = useState([]); const [q, setQ] = useState(""); const [saving, setSaving] = useState(false);
  const av = masters.filter(m => m.currentLocation === ff && m.status === "active" && m.name.toLowerCase().includes(q.toLowerCase()));
  const tog = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const go = async () => {
    if (!ff || !tf || !sel.length) { showToast("Select factories & masters", "error"); return; }
    if (ff === tf) { showToast("Same factory!", "error"); return; }
    setSaving(true);
    try {
      const d = todayStr();
      const selMasters = masters.filter(m => sel.includes(m.id));
      // Insert transfers and update masters
      for (const m of selMasters) {
        await db.addTransfer({ master_id: m.id, from_factory: ff, to_factory: tf, transfer_date: d, transferred_by: user.id });
        await db.updateMaster(m.id, { current_location: tf });
      }
      await addLog("transfer", `Transfer: ${ff.split(" - ")[1]} → ${tf.split(" - ")[1]}`, sel.length,
        `${selMasters.map(m => m.name).slice(0, 3).join(", ")}${selMasters.length > 3 ? ` +${selMasters.length - 3} more` : ""}`,
        "🔄", P.primary, selMasters.map(m => ({ name: m.name, size: m.size, surface: m.surface })));
      await loadData();
      showToast(`${sel.length} transferred!`); setSel([]); setQ("");
    } catch (e) { showToast(e.message || "Error", "error"); }
    setSaving(false);
  };

  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Transfer Masters</h1><p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>Move between factories</p>
    <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end" }}>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6 }}>FROM</label><select value={ff} onChange={e => { setFF(e.target.value); setSel([]); }} style={{ width: "100%", padding: 12, border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 13, background: "#FAFAF8", outline: "none" }}><option value="">Select</option>{FACTORIES.map(f => <option key={f} value={f}>{f.split(" - ")[1]}</option>)}</select></div>
        <div style={{ color: P.primary, paddingBottom: 8 }}>{Ic.arrow}</div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6 }}>TO</label><select value={tf} onChange={e => setTF(e.target.value)} style={{ width: "100%", padding: 12, border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 13, background: "#FAFAF8", outline: "none" }}><option value="">Select</option>{FACTORIES.filter(f => f !== ff).map(f => <option key={f} value={f}>{f.split(" - ")[1]}</option>)}</select></div>
      </div>
    </div>
    {ff && <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><div style={{ fontSize: 14, fontWeight: 700 }}>Available ({av.length})</div>{av.length > 0 && <button onClick={() => sel.length === av.length ? setSel([]) : setSel(av.map(m => m.id))} style={{ fontSize: 12, fontWeight: 600, color: P.primary, background: "none", border: `1.5px solid ${P.primary}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: FT }}>{sel.length === av.length ? "Deselect" : "Select All"}</button>}</div>
      <div style={{ position: "relative", marginBottom: 14 }}><div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: P.muted }}>{Ic.search}</div><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "10px 10px 10px 38px", border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 13, outline: "none", background: "#FAFAF8" }} /></div>
      <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>{av.map(m => { const s = sel.includes(m.id); return (<div key={m.id} onClick={() => tog(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, cursor: "pointer", background: s ? P.primaryLight : "#F9F7F4", border: s ? `1.5px solid ${P.primary}` : "1.5px solid transparent" }}><div style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: s ? "none" : `2px solid ${P.border}`, background: s ? P.primary : "transparent", color: "#fff", flexShrink: 0 }}>{s && Ic.check}</div><div><div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11, color: P.muted }}>{m.size} · {m.surface}</div></div></div>); })}{!av.length && <div style={{ textAlign: "center", padding: 30, color: P.muted, fontSize: 13 }}>No masters here</div>}</div>
      {sel.length > 0 && tf && <button onClick={go} disabled={saving} style={{ width: "100%", padding: 14, background: P.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FT, marginTop: 18, opacity: saving ? 0.7 : 1 }}>{saving ? "Transferring..." : `Transfer ${sel.length} →`}</button>}
    </div>}
  </div>);
}

// ═══════════════════════════════
//  TRACK MASTER
// ═══════════════════════════════
function History({ masters, adm, showToast, loadData, addLog, profile, user }) {
  const [q, setQ] = useState(""); const [sel, setSel] = useState(null);
  const f = masters.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
  if (sel) { const live = masters.find(m => m.id === sel.id); if (!live) { setSel(null); return null; } return <Detail master={live} onBack={() => setSel(null)} adm={adm} showToast={showToast} loadData={loadData} addLog={addLog} profile={profile} user={user} />; }
  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Track Master</h1><p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>View complete journey</p>
    <div style={{ position: "relative", marginBottom: 20 }}><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: P.muted }}>{Ic.search}</div><input value={q} onChange={e => { setQ(e.target.value); setSel(null); }} placeholder="Type design name..." style={{ width: "100%", padding: "14px 14px 14px 42px", border: `1.5px solid ${P.border}`, borderRadius: 12, fontSize: 15, outline: "none", background: P.card }} /></div>
    {q && !sel && <div style={{ background: P.card, borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>{f.map(m => (<div key={m.id} onClick={() => setSel(m)} style={{ padding: "14px 18px", cursor: "pointer", borderBottom: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }} onMouseEnter={e => e.currentTarget.style.background = "#F9F7F4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 12, color: P.muted }}>{m.size} · {m.surface}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: P.primary, fontWeight: 600 }}>📍 {m.currentLocation?.split(" - ")[1]}</div><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: SC[m.status] + "18", color: SC[m.status], textTransform: "uppercase" }}>{SL[m.status]}</span></div></div>))}{!f.length && <div style={{ padding: 30, textAlign: "center", color: P.muted }}>Not found</div>}</div>}
  </div>);
}

// ═══════════════════════════════
//  REPORT
// ═══════════════════════════════
function ReportPage({ masters, showToast, loadData, addLog }) {
  const [q, setQ] = useState(""); const [sid, setSid] = useState(null); const [rt, setRt] = useState("damaged"); const [note, setNote] = useState(""); const [saving, setSaving] = useState(false);
  const ac = masters.filter(m => m.status === "active" && m.name.toLowerCase().includes(q.toLowerCase()));
  const go = async () => {
    if (!sid || !note) { showToast("Select master & add note", "error"); return; }
    setSaving(true);
    try {
      const mstr = masters.find(m => m.id === sid);
      await db.updateMaster(sid, { status: rt, damage_report_date: todayStr(), damage_report_note: note });
      await addLog("report", `Reported "${mstr.name}" as ${rt}`, 1, `at ${mstr.currentLocation}`, rt === "damaged" ? "⚠️" : "🔴", SC[rt], [{ name: mstr.name, size: mstr.size, surface: mstr.surface }]);
      await loadData();
      showToast(`Reported as ${rt}`); setSid(null); setNote(""); setQ("");
    } catch (e) { showToast(e.message || "Error", "error"); }
    setSaving(false);
  };
  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Report Damage / Loss</h1><p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>Report master as damaged or lost</p>
    <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 8 }}>TYPE</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>{["damaged", "lost"].map(t => (<button key={t} onClick={() => setRt(t)} style={{ flex: 1, padding: 12, borderRadius: 10, fontFamily: FT, fontSize: 14, fontWeight: 600, cursor: "pointer", border: rt === t ? `2px solid ${SC[t]}` : `2px solid ${P.border}`, background: rt === t ? SC[t] + "15" : "transparent", color: rt === t ? SC[t] : P.muted }}>{t === "damaged" ? "⚠️ Damaged" : "🔴 Lost"}</button>))}</div>
      <label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6 }}>SELECT MASTER</label>
      <input value={q} onChange={e => { setQ(e.target.value); setSid(null); }} placeholder="Search..." style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 14, outline: "none", background: "#FAFAF8", marginBottom: 8 }} />
      {q && !sid && <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${P.border}`, borderRadius: 10, marginBottom: 16 }}>{ac.map(m => (<div key={m.id} onClick={() => { setSid(m.id); setQ(m.name); }} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${P.border}`, fontSize: 13 }} onMouseEnter={e => e.currentTarget.style.background = "#F9F7F4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><div style={{ fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11, color: P.muted }}>📍 {m.currentLocation}</div></div>))}</div>}
      {sid && <div style={{ padding: "10px 14px", background: P.primaryLight, borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 600, color: P.primary }}>✓ {masters.find(m => m.id === sid)?.name}</div>}
      <label style={{ fontSize: 12, fontWeight: 600, color: P.muted, display: "block", marginBottom: 6 }}>NOTE *</label>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Describe..." rows={3} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${P.border}`, borderRadius: 10, fontSize: 14, outline: "none", background: "#FAFAF8", resize: "vertical", fontFamily: FT }} />
      <button onClick={go} disabled={saving} style={{ width: "100%", padding: 14, background: SC[rt], color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FT, marginTop: 18, opacity: saving ? 0.7 : 1 }}>{saving ? "Submitting..." : "Submit Report"}</button>
    </div>
  </div>);
}

// ═══════════════════════════════
//  ANALYTICS
// ═══════════════════════════════
function Analytics({ masters, logs }) {
  const tt = masters.reduce((a, m) => a + (m.transfers || []).length, 0);
  const avg = masters.length ? (tt / masters.length).toFixed(1) : 0;
  const ft = FACTORIES.map(f => {
    let o = 0, i = 0;
    masters.forEach(m => (m.transfers || []).forEach(t => { if (t.from_factory === f) o++; if (t.to_factory === f) i++; }));
    return { n: f, o, i, t: o + i };
  });
  const t5 = [...masters].sort((a, b) => (b.transfers || []).length - (a.transfers || []).length).slice(0, 5);
  const sd = {}; masters.forEach(m => { sd[m.size] = (sd[m.size] || 0) + 1; });
  const sf = {}; masters.forEach(m => { sf[m.surface] = (sf[m.surface] || 0) + 1; });

  return (<div style={{ animation: "fadeIn 0.4s ease" }}>
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Analytics</h1><p style={{ color: P.muted, fontSize: 14, marginBottom: 24 }}>Insights</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>{[{ l: "Total Transfers", v: tt, c: P.primary }, { l: "Avg/Master", v: avg, c: "#6366f1" }, { l: "Never Moved", v: masters.filter(m => !(m.transfers || []).length).length, c: P.warning }, { l: "Damaged/Lost", v: masters.filter(m => m.status !== "active").length, c: P.danger }].map((x, i) => (<div key={i} style={{ background: P.card, borderRadius: 14, padding: "18px 16px", borderLeft: `4px solid ${x.c}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}><div style={{ fontSize: 28, fontWeight: 700, color: x.c }}>{x.v}</div><div style={{ fontSize: 12, color: P.muted, marginTop: 4 }}>{x.l}</div></div>))}</div>
    <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Factory Activity</h3>
      {ft.map((f, i) => { const mx = Math.max(...ft.map(x => x.t), 1); return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}><div style={{ width: 90, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{f.n.split(" - ")[1]}</div><div style={{ flex: 1, height: 28, background: "#F3F0EC", borderRadius: 8, overflow: "hidden", display: "flex" }}><div style={{ width: `${(f.o / mx) * 100}%`, background: P.danger + "CC", borderRadius: "8px 0 0 8px", minWidth: f.o > 0 ? 24 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>{f.o > 0 ? f.o : ""}</div><div style={{ width: `${(f.i / mx) * 100}%`, background: P.success + "CC", minWidth: f.i > 0 ? 24 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>{f.i > 0 ? f.i : ""}</div></div></div>); })}
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: P.muted, marginTop: 8 }}><span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: P.danger + "CC", marginRight: 4 }} />Out</span><span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: P.success + "CC", marginRight: 4 }} />In</span></div>
    </div>
    <div style={{ background: P.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Most Transferred</h3>{t5.map((m, i) => (<div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? `1px solid ${P.border}` : "none" }}><div><span style={{ display: "inline-block", width: 22, height: 22, borderRadius: "50%", background: i === 0 ? P.primary : "#F3F0EC", color: i === 0 ? "#fff" : P.text, textAlign: "center", lineHeight: "22px", fontSize: 11, fontWeight: 700, marginRight: 10 }}>{i + 1}</span><span style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span></div><span style={{ fontSize: 13, fontWeight: 700, color: P.primary }}>{(m.transfers || []).length}</span></div>))}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
      <div style={{ background: P.card, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>By Size</h3>{Object.entries(sd).sort((a, b) => b[1] - a[1]).map(([s, c]) => <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, borderBottom: `1px solid ${P.border}` }}><span style={{ fontWeight: 600 }}>{s}</span><span style={{ color: P.primary, fontWeight: 700 }}>{c}</span></div>)}</div>
      <div style={{ background: P.card, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>By Surface</h3>{Object.entries(sf).sort((a, b) => b[1] - a[1]).map(([s, c]) => <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, borderBottom: `1px solid ${P.border}` }}><span style={{ fontWeight: 600 }}>{s}</span><span style={{ color: P.primary, fontWeight: 700 }}>{c}</span></div>)}</div>
    </div>
    <ActivityLog logs={logs} showAll={true} />
  </div>);
}
