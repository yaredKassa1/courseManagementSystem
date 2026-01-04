"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { 
  BookOpen, Users, ClipboardCheck, LayoutDashboard, 
  FileText, Megaphone, UserCircle, Info, Phone, 
  Mail, MapPin, CheckCircle, GraduationCap
} from "lucide-react";

export default function InstructorDashboardPage() {
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  // Refs for smooth scrolling
  const topRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/instructor/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Visual data for Grading Analysis
  const gradingData = [
    { name: "A", count: 12 },
    { name: "B", count: 19 },
    { name: "C", count: 8 },
    { name: "D", count: 3 },
  ];

  return (
    <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR", "ROLE_USER"]}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        
        {/* --- INSTRUCTOR SIDEBAR --- */}
        <aside className="w-64 bg-teal-950 text-white hidden lg:flex flex-col shadow-xl">
          <div className="p-8 text-2xl font-black tracking-tighter text-teal-400 border-b border-teal-900">
            FACULTY<span className="text-white">PORTAL</span>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-teal-500 text-xs font-bold uppercase p-2 tracking-widest">Management</p>
            <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" onClick={() => scrollTo(topRef)} />
            <SidebarLink icon={<BookOpen size={18}/>} label="My Courses" href="/instructor/courses" />
            <SidebarLink icon={<Users size={18}/>} label="Students" href="/instructor/students" />
            <SidebarLink icon={<ClipboardCheck size={18}/>} label="Grading" href="/instructor/submissions" />
            
            <p className="text-teal-500 text-xs font-bold uppercase p-2 mt-6 tracking-widest">Support</p>
            <SidebarLink icon={<Info size={18}/>} label="Resources" onClick={() => scrollTo(aboutRef)} />
            <SidebarLink icon={<Phone size={18}/>} label="IT Support" onClick={() => scrollTo(contactRef)} />
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <Navbar />

          <div className="p-8 space-y-20">
            
            {/* SECTION 1: OVERVIEW */}
            <section ref={topRef} className="pt-4">
              <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">Instructor Overview</h1>
                  <p className="text-slate-500 font-medium">Monitor your academic influence and tasks.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <StatWidget label="Active Courses" value={stats.activeCourses} icon={<BookOpen />} color="bg-teal-600" />
                <StatWidget label="Total Students" value={stats.totalStudents} icon={<Users />} color="bg-cyan-600" />
                <StatWidget label="Pending Reviews" value={stats.pendingSubmissions} icon={<FileText />} color="bg-orange-500" />
              </div>

              {/* GRADING ANALYTICS */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Class Grade Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradingData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                      <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* SECTION 2: QUICK ACTIONS */}
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Instructional Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ManagementCard 
                  title="Course Content" 
                  desc="Upload syllabus, lectures, and reading materials." 
                  link="/instructor/courses" 
                  btnColor="bg-teal-600"
                />
                <ManagementCard 
                  title="Announcements" 
                  desc="Broadcast important updates to all your classes." 
                  link="/instructor/announcements" 
                  btnColor="bg-cyan-700"
                />
                <ManagementCard 
                  title="Assignment Desk" 
                  desc="Create new tasks and manage student deadlines." 
                  link="/instructor/assignments" 
                  btnColor="bg-slate-800"
                />
              </div>
            </section>

            {/* SECTION 3: FACULTY RESOURCES */}
            <section ref={aboutRef} className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-[3rem] p-12 shadow-xl">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black mb-6">Faculty Excellence</h2>
                <p className="text-teal-100 text-lg leading-relaxed mb-8 opacity-90">
                  Access digital teaching tools and pedagogical resources designed to enhance the classroom experience.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><CheckCircle size={20} className="text-teal-400"/> Plagiarism Checker</div>
                  <div className="flex items-center gap-2"><CheckCircle size={20} className="text-teal-400"/> Grade Auto-Sync</div>
                </div>
              </div>
            </section>

            {/* SECTION 4: CONTACT SUPPORT */}
            <section ref={contactRef} className="pb-10">
              <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">Instructor Support</h2>
                  <p className="text-slate-500 mb-8 font-medium">Need help with the portal or classroom tech?</p>
                  <div className="space-y-6">
                    <ContactItem icon={<Mail className="text-teal-600"/>} title="IT Helpdesk" desc="it-support@university.edu" />
                    <ContactItem icon={<MapPin className="text-teal-600"/>} title="Admin Office" desc="Faculty Wing, Block B" />
                  </div>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Issue Subject" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-teal-500" />
                  <textarea placeholder="Describe the technical issue..." rows="3" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-teal-500"></textarea>
                  <button className="w-full py-4 bg-teal-600 text-white font-black rounded-2xl shadow-lg hover:bg-teal-700 transition-all">
                    Send Ticket
                  </button>
                </div>
              </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-slate-200 pt-10 pb-6 text-center">
              <p className="text-slate-400 text-sm font-medium">
                © {new Date().getFullYear()} <span className="font-bold text-slate-600">CMS Faculty Portal</span>. Empowering Educators.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// --- SHARED UI COMPONENTS ---

function SidebarLink({ icon, label, href, onClick }) {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-teal-100 hover:text-white cursor-pointer font-semibold">
      {icon} <span>{label}</span>
    </div>
  );
  return onClick ? <div onClick={onClick}>{content}</div> : <Link href={href}>{content}</Link>;
}

function StatWidget({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between group hover:border-teal-100 transition-all">
      <div>
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{value || 0}</p>
      </div>
      <div className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-teal-100`}>
        {icon}
      </div>
    </div>
  );
}

function ManagementCard({ title, desc, link, btnColor }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
      </div>
      <Link href={link} className={`block text-center py-3 rounded-xl text-white font-bold text-sm ${btnColor} hover:opacity-90 transition`}>
        Manage
      </Link>
    </div>
  );
}

function ContactItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-teal-50 rounded-xl">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-slate-500 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}