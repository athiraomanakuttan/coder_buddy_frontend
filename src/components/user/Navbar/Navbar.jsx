"use client";

import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

// Import icons from lucide-react
import {
  MessageSquare,
  FileText,
  CreditCard,
  Calendar,
  User,
  Star,
  AlertCircle,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const router = useRouter();
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
      callbackUrl: "/login",
    });
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 100);
  };

  return (
    <aside className="w-52 bg-primarys h-full min-h-screen flex flex-col items-center py-4">
      {/* Brand Name */}
      <h1 className="text-white text-xl font-bold mb-4">Coder Buddy</h1>

      {/* Profile Image */}
      <Image
        src="/images/profile_pic.png"
        alt="Profile"
        width={100}
        height={100}
        className="w-[60%] mx-auto rounded-full mb-3 border-2 border-white"
      />

      {/* Navigation Links */}
      <ul className="flex flex-col text-white space-y-5 w-full px-4">
        <li>
          <Link
            href="/Chat"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors text-white"
          >
            <MessageSquare className="w-5 h-5" />
            Chats
          </Link>
        </li>
        <li>
          <Link
            href="/post"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors text-white"
          >
            <FileText className="w-5 h-5" />
            View Post
          </Link>
        </li>
        <li>
          <Link
            href="/payment"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors text-white"
          >
            <CreditCard className="w-5 h-5" />
            Payments
          </Link>
        </li>
        <li>
          <Link
            href="/meetingList"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors text-white"
          >
            <Calendar className="w-5 h-5" />
            Meetings
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors text-white"
          >
            <User className="w-5 h-5" />
            Your Profile
          </Link>
        </li>
        
        <li>
          <Link
            href="/complaintRegistration"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors text-white"
          >
            <AlertCircle className="w-5 h-5" />
            Concerns
          </Link>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-white/10 transition-colors w-full text-left text-white"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Navbar;
