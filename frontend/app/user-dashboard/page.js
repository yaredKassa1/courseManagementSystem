"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  BookOpen, GraduationCap, User, 
  Calendar, Award, Clock, 
  Info, Phone, CheckCircle, Mail, MapPin
} from "lucide-react";

export default function StudentDashboardPage() {
  const [studentStats, setStudentStats] = useState({
    enrolledCourses: 0,
    completedAssignments: 0,
    attendanceRate: 0,
  });

  // Refs for smooth scrolling
  const topRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Replace with your actual student stats endpoint
        const res = await api.get("/api/student/dashboard-stats");
        setStudentStats(res.data);
      } catch (err) {
        console.error("Failed to load student stats", err);
      }
    };
    fetchStudentData();
  }, []);


  // Visualizing "Course Progress" or "Grades"
  const performanceData = [
    { subject: "Math", score: 85 },
    { subject: "Science", score: 72 },
    { subject: "History", score: 90 },
    { subject: "IT", score: 95 },
  ];

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        
        {/* --- STUDENT SIDEBAR --- */}
        <aside className="w-64 bg-indigo-950 text-white hidden lg:flex flex-col shadow-xl">
          <div className="p-8 text-2xl font-black tracking-tighter text-indigo-400 border-b border-indigo-900">
            STUDENT<span className="text-white">HUB</span>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-indigo-400 text-xs font-bold uppercase p-2 tracking-widest">Main Menu</p>
            <SidebarLink icon={<GraduationCap size={18}/>} label="Overview" onClick={() => scrollTo(topRef)} />
            <SidebarLink icon={<BookOpen size={18}/>} label="My Courses" href="/my-courses" />
            <SidebarLink icon={<Calendar size={18}/>} label="Enrollments" href="/my-enrollments" />
            <SidebarLink icon={<User size={18}/>} label="My Profile" href="/profile" />
            
            <p className="text-indigo-400 text-xs font-bold uppercase p-2 mt-6 tracking-widest">Resources</p>
            <SidebarLink icon={<Info size={18}/>} label="About Campus" onClick={() => scrollTo(aboutRef)} />
            <SidebarLink icon={<Phone size={18}/>} label="Help Desk" onClick={() => scrollTo(contactRef)} />
          </nav>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <Navbar />

          <div className="p-8 space-y-20">
            
            {/* SECTION 1: WELCOME & PERFORMANCE */}
            <section ref={topRef} className="pt-4">
              <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back, Scholar!</h1>
                  <p className="text-slate-500 font-medium">Here is a summary of your academic progress.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-tighter">Spring Semester 2026</span>
                </div>
              </header>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <StatWidget label="Enrolled Courses" value={studentStats.enrolledCourses || "5"} icon={<BookOpen />} color="bg-blue-600" />
                <StatWidget label="Assignments Due" value="3" icon={<Clock />} color="bg-rose-500" />
                <StatWidget label="Current GPA" value="3.8" icon={<Award />} color="bg-amber-500" />
              </div>

              {/* CHART ROW */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Performance</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                      <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* SECTION 2: MANAGEMENT HUB (Quick Links) */}
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Learning Hub</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ManagementCard 
                  title="My Learning" 
                  desc="Access your lecture notes, videos, and materials." 
                  link="/my-courses" 
                  btnColor="bg-blue-600"
                />
                <ManagementCard 
                  title="Enrollment History" 
                  desc="Check your previous and pending registrations." 
                  link="/my-enrollments" 
                  btnColor="bg-indigo-600"
                />
                <ManagementCard 
                  title="Profile Settings" 
                  desc="Update your personal info and security." 
                  link="/profile" 
                  btnColor="bg-slate-800"
                />
              </div>
            </section>

            {/* SECTION 3: ABOUT CAMPUS */}
            <section ref={aboutRef} className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-[3rem] p-12 shadow-xl">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black mb-6">About Our University</h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 opacity-90">
                  Providing a world-class digital learning environment. Our portal is designed 
                  to put your education at your fingertips, allowing you to focus on what matters: 
                  <strong> Academic Excellence.</strong>
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">Digital Library</span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">24/7 Support</span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">Career Services</span>
                </div>
              </div>
            </section>

            {/* SECTION 4: CONTACT / SUPPORT */}
            <section ref={contactRef} className="pb-10">
              <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">Support Center</h2>
                  <p className="text-slate-500 mb-8 font-medium">Having trouble with your courses? Our student support office is here to help.</p>
                  <div className="space-y-6">
                    <ContactItem icon={<Mail className="text-indigo-600"/>} title="Student Services" desc="registrar@university.edu" />
                    <ContactItem icon={<MapPin className="text-indigo-600"/>} title="Office Location" desc="Student Union, Room 102" />
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea placeholder="Tell us your issue..." rows="5" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-indigo-500 transition-all"></textarea>
                  <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">
                    Submit Request
                  </button>
                </div>
              </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-slate-200 pt-10 pb-6 text-center">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm px-4 font-medium">
                <p>© {new Date().getFullYear()} <span className="font-bold text-slate-600">University CMS</span>. Academic Excellence Redefined.</p>
                <div className="flex gap-8">
                  <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                  <a href="#" className="hover:text-indigo-600">Terms of Use</a>
                </div>
              </div>
            </footer>

          </div>
        </main>
      </div>

      <style jsx>{
        .sidebar-link {
          @apply flex items-center gap-3 p-3 rounded-xl transition-all text-indigo-200 hover:text-white hover:bg-white/10 font-semibold cursor-pointer;
        }
      }</style>
    </ProtectedRoute>
  );
}

// --- SUB-COMPONENTS ---

function SidebarLink({ icon, label, href, onClick }) {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-indigo-100 hover:text-white cursor-pointer font-semibold">
      {icon} <span>{label}</span>
    </div>
  );
  return onClick ? <div onClick={onClick}>{content}</div> : <Link href={href}>{content}</Link>;
}

function StatWidget({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between group hover:border-indigo-100 transition-all">
      <div>
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
      </div>
      <div className={p-4 rounded-2xl text-white ${color} shadow-lg shadow-indigo-100}>
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
      <Link href={link} className={block text-center py-3 rounded-xl text-white font-bold text-sm ${btnColor} hover:opacity-90 transition}>
        Open Section
      </Link>
    </div>
  );
}

function ContactItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-indigo-50 rounded-xl">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-slate-500 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}