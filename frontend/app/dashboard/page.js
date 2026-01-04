"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  BookOpen, Users, UserCheck, ShieldCheck, TrendingUp,
  Info, Phone, Mail, MapPin, Globe, CheckCircle,
  Building2, Settings2, LayoutDashboard
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    instructors: 0,
    enrollments: 0
  });

  const topRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };
    fetchAdminStats();
  }, []);

  const chartData = [
    { name: "Students", value: stats.students },
    { name: "Courses", value: stats.courses },
    { name: "Instructors", value: stats.instructors },
    { name: "Enrollments", value: stats.enrollments },
  ];

  const COLORS = ["#3b82f6", "#a855f7", "#6366f1", "#ec4899"];

  return (
    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
      <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900">
        
        {/* --- STICKY SIDEBAR --- */}
        <aside className="w-64 bg-slate-950 text-white hidden lg:flex flex-col shadow-2xl">
          <div className="p-8 text-2xl font-black tracking-tighter text-indigo-500 border-b border-slate-900">
            ADMIN<span className="text-white">CORE</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-slate-500 text-[10px] font-bold uppercase p-2 tracking-[0.2em]">Main Menu</p>
            <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" onClick={() => scrollTo(topRef)} />
            <SidebarLink icon={<BookOpen size={18}/>} label="Courses" href="/courses" />
            <SidebarLink icon={<Building2 size={18}/>} label="Departments" href="/departments" />
            <SidebarLink icon={<CheckCircle size={18}/>} label="Enrollments" href="/enrollments" />
            
            <p className="text-slate-500 text-[10px] font-bold uppercase p-2 mt-6 tracking-[0.2em]">User Control</p>
            <SidebarLink icon={<Users size={18}/>} label="Students" href="/students" />
            <SidebarLink icon={<UserCheck size={18}/>} label="Instructors" href="/instructors" />
            <SidebarLink icon={<Settings2 size={18}/>} label="User Management" href="/users" />
            
            <p className="text-slate-500 text-[10px] font-bold uppercase p-2 mt-6 tracking-[0.2em]">Support</p>
            <SidebarLink icon={<Info size={18}/>} label="About Portal" onClick={() => scrollTo(aboutRef)} />
            <SidebarLink icon={<Phone size={18}/>} label="Contact IT" onClick={() => scrollTo(contactRef)} />
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <Navbar />

          <div className="p-8 space-y-20">
            
            {/* SECTION 1: OVERVIEW */}
            <section ref={topRef} className="pt-4">
              <header className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Insights</h1>
                <p className="text-slate-500 font-medium">Global statistics across the university network.</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatWidget label="Total Courses" value={stats.courses} icon={<BookOpen />} color="bg-blue-600" />
                <StatWidget label="Active Students" value={stats.students} icon={<Users />} color="bg-purple-600" />
                <StatWidget label="Instructors" value={stats.instructors} icon={<UserCheck />} color="bg-indigo-600" />
                <StatWidget label="Total Enrollments" value={stats.enrollments} icon={<TrendingUp />} color="bg-pink-600" />
              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-96">
                  <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">Resource Load</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-96">
                  <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">User Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* SECTION 2: ABOUT US */}
            <section ref={aboutRef} className="bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-5xl font-black mb-6 tracking-tighter">The CMS Enterprise</h2>
                <p className="text-slate-400 text-xl leading-relaxed mb-8">
                  Providing a secure, scalable, and intuitive management solution for modern universities. 
                  Control every aspect of your academic ecosystem from a single command center.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                    <CheckCircle size={24} className="text-indigo-400"/> <span className="font-bold">AES-256 Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                    <CheckCircle size={24} className="text-indigo-400"/> <span className="font-bold">Automated Backups</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
            </section>

            {/* SECTION 3: CONTACT US */}
            <section ref={contactRef} className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">Infrastructure Support</h2>
                  <p className="text-slate-500 mb-10 font-medium">Report system outages or request administrative privilege changes.</p>
                  <div className="space-y-8">
                    <ContactItem icon={<Mail className="text-indigo-600"/>} title="Admin Support" desc="it-admin@university.edu" />
                    <ContactItem icon={<MapPin className="text-indigo-600"/>} title="Server Room" desc="Data Center, North Wing" />
                    <ContactItem icon={<Globe className="text-indigo-600"/>} title="Global Access" desc="VPN: global.cms-portal.edu" />
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4">
                  <h4 className="font-bold text-slate-700 mb-2">Priority Ticket</h4>
                  <input type="text" placeholder="Subject" className="w-full p-4 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 ring-indigo-500" />
                  <textarea placeholder="Technical details..." rows="4" className="w-full p-4 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 ring-indigo-500"></textarea>
                  <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Submit to IT
                  </button>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 pt-10 pb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                <p className="text-slate-400 font-bold text-sm italic">CMS <span className="text-indigo-600">PREMIUM</span> ADMIN</p>
                <div className="flex gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  <a href="#" className="hover:text-indigo-600 transition">Logs</a>
                  <a href="#" className="hover:text-indigo-600 transition">Security</a>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Node 01: Active
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// --- COMPONENTS ---

function SidebarLink({ icon, label, href, onClick }) {
  const content = (
    <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all text-slate-400 hover:text-white cursor-pointer font-bold text-sm">
      {icon} <span>{label}</span>
    </div>
  );

  return onClick ? (
    <div onClick={onClick}>{content}</div>
  ) : (
    <Link href={href}>{content}</Link>
  );
}

function StatWidget({ label, value, icon, color }) {
  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between group hover:border-indigo-100 transition-all">
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value || 0}</p>
      </div>
      <div className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
}

function ContactItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-5">
      <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">{icon}</div>
      <div>
        <h4 className="font-black text-slate-800">{title}</h4>
        <p className="text-slate-500 font-medium text-sm">{desc}</p>
      </div>
    </div>
  );
}