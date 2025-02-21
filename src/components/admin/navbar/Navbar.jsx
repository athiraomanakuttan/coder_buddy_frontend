'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

import {
  Users,
  UserCheck,
  CreditCard,
  Calendar,
  HelpCircle,
  LogOut,
  MonitorCog,
} from "lucide-react";

const navItems = [
  { href: "/admin/client", label: "Clients", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/experts", label: "Experts", icon: <UserCheck className="w-5 h-5" /> },
  { href: "#", label: "Payments", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/admin/technologies", label: "Technologies", icon: <MonitorCog className="w-5 h-5" /> },
  { href: "/admin/meeting/meetingList", label: "Meeting History", icon: <Calendar className="w-5 h-5" /> },
  { href: "/admin/concerns", label: "Support Requests", icon: <HelpCircle className="w-5 h-5" /> },
  
];

const Navbar = () => {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Lax`;
      document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Lax`;
    }
    localStorage.clear();
    sessionStorage.clear();
    logout();
    await signOut({
      redirect: false,
      callbackUrl: "/admin/login",
    });
    setTimeout(() => {
      console.log("inside")
      router.push("/admin/login");
      router.refresh();
    }, 100);
  };
  return (
    <aside
      className="
        bg-gray-900 
        text-white 
        w-60 
        h-screen 
        sticky 
        top-0 
        flex 
        flex-col 
        items-center 
        py-6 
        shadow-lg
      "
    >
      {/* Profile Image */}
      <Image
        src="/images/expert_profile_pic.jpg"
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-gray-700"
        width={100}
        height={100}
      />
      <h1 className="text-xl font-semibold mt-3">Coder Buddy</h1>

      {/* Navigation */}
      <ul className="mt-8 w-full space-y-2">
        {navItems.map(({ href, label, icon }, index) => (
          <li key={index} className="w-full">
            <Link
              href={href}
              className="
                flex 
                items-center 
                gap-3 
                px-6 
                py-3 
                text-sm 
                font-medium 
                rounded-md 
                transition-colors 
                duration-200 
                hover:bg-gray-700 
                hover:text-gray-300
              "
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
        <li><Link href="#" className="
                flex 
                items-center 
                gap-3 
                px-6 
                py-3 
                text-sm 
                font-medium 
                rounded-md 
                transition-colors 
                duration-200 
                hover:bg-gray-700 
                hover:text-gray-300
              " 
              onClick={handleLogout}> <LogOut /> Logout</Link></li>
      </ul>
    </aside>
  );
};

export default Navbar;
