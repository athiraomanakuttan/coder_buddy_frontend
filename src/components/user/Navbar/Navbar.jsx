"use client"

import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

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
      callbackUrl: "/login"
    });
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 100);
  }
  return (
    <div className="navbar m-0 p-0">
      
      <div className="w-52 bg-primarys h-full min-h-screen flex-row pb-2">
        <img src="/images/profile_pic.png" alt=""  className="w-[60%] mx-auto rounded-full mb-3 mt-3 border-white border-3"/>
        <ul className=" flex-row text-white space-y-7 pl-8 ">
          <li><Link href='/Chat'className="menu_link">Chats</Link> </li>
          <li><Link href='/post' className="menu_link">View post</Link> </li>
          <li><Link href='/payment' className="menu_link">Payments </Link></li>
          <li><Link href='/meetingList' className="menu_link">Meetings</Link></li>
          <li><Link href='/profile' className="menu_link">Your profile</Link></li>
          <li><Link href='' className="menu_link">Feedbacks</Link></li>
          <li><Link href='/complaintRegistration' className="menu_link">Concerns</Link></li>
          <li><Link href="" className="menu_link" onClick={(e) => { e.preventDefault(); handleLogout(); }}
  >
    Log out
  </Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
