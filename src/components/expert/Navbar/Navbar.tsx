"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { signOut } from "next-auth/react";
import Image from "next/image";

// Import the icons you need from lucide-react
import {
  User,
  MessageSquare,
  FileText,
  Wallet as WalletIcon,
  CreditCard,
  Calendar,
  AlertCircle,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [verified, setVerified] = useState<string>("0");
  const router = useRouter();

  useEffect(() => {
    const isVerified = localStorage.getItem("isVerified") as string;
    setVerified(isVerified);
  }, []);

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
      callbackUrl: "/expert/login",
    });
    setTimeout(() => {
      router.push("/expert/login");
      router.refresh();
    }, 100);
  };

  return (
    <aside
      className="
        bg-secondarys
        text-white
        w-60
        min-h-screen
        flex
        flex-col
        items-center
        py-6
        shadow-lg
      "
    >
      {/* Brand Name */}
      <h1 className="text-2xl font-bold mb-4">Coder Buddy</h1>

      {/* Profile Image */}
      <div className="mb-3">
        <Image
          src="/images/expert_profile_pic.jpg"
          alt="Profile Picture"
          className="rounded-full"
          height={100}
          width={100}
        />
      </div>

      {/* Nav Items */}
      <ul className="flex flex-col space-y-3 w-full px-4">
        {/* Profile */}
        <li>
          <Link
            href="/expert/profile"
            className="
              py-2
              px-3
              rounded
              text-white
              hover:bg-white/10
              transition-colors
              flex
              items-center
            "
          >
            <User className="w-5 h-5 mr-2" />
            Your Profile
          </Link>
        </li>

        {verified === "1" && (
          <>
            {/* Chats */}
            <li>
              <Link
                href="/Chat"
                className="
                  py-2
                  px-3
                  rounded
                  text-white
                  hover:bg-white/10
                  transition-colors
                  flex
                  items-center
                "
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chats
              </Link>
            </li>

            {/* View Post */}
            <li>
              <Link
                href="/expert/post"
                className="
                  py-2
                  px-3
                  rounded
                  text-white
                  hover:bg-white/10
                  transition-colors
                  flex
                  items-center
                "
              >
                <FileText className="w-5 h-5 mr-2" />
                View Post
              </Link>
            </li>

            {/* View Wallet */}
            <li>
              <Link
                href="/expert/wallet"
                className="
                  py-2
                  px-3
                  rounded
                  text-white
                  hover:bg-white/10
                  transition-colors
                  flex
                  items-center
                "
              >
                <WalletIcon className="w-5 h-5 mr-2" />
                View Wallet
              </Link>
            </li>

            {/* Payment History */}
            <li>
              <Link
                href="/payment"
                className="
                  py-2
                  px-3
                  rounded
                  text-white
                  hover:bg-white/10
                  transition-colors
                  flex
                  items-center
                "
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Payment History
              </Link>
            </li>

            {/* Meeting History */}
            <li>
              <Link
                href="/expert/meetingList"
                className="
                  py-2
                  px-3
                  rounded
                  text-white
                  hover:bg-white/10
                  transition-colors
                  flex
                  items-center
                "
              >
                <Calendar className="w-5 h-5 mr-2" />
                Meeting History
              </Link>
            </li>

            {/* Concerns */}
            <li>
              <Link
                href="/complaintRegistration"
                className="
                  py-2
                  px-3
                  rounded
                  text-white
                  hover:bg-white/10
                  transition-colors
                  flex
                  items-center
                "
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Concerns
              </Link>
            </li>
          </>
        )}

        {/* Logout */}
        <li>
          <Link
            href="#"
            className="
              py-2
              px-3
              rounded
              text-white
              hover:bg-white/10
              transition-colors
              flex
              items-center
            "
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Navbar;
