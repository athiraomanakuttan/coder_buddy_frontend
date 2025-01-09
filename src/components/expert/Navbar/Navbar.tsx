'use client'
import Link from 'next/link'
import { useEffect , useState} from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { signOut } from 'next-auth/react'
const Navbar = () => {
  const [verified, setVerified]= useState<string>("0")
  const router = useRouter()
  useEffect(()=>{
     const isVerified =  localStorage.getItem("isVerified") as string
     setVerified(isVerified)
  },[])
  
  const logout = useAuthStore((state) => state.logout);
  
  const handleLogout = async () => {
    const cookies = document.cookie.split(";");
    console.log("cookies",cookies)
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
      callbackUrl: "/expert/login"
    });
    setTimeout(() => {
      router.push('/expert/login');
      router.refresh();
    }, 100);
  }
  return (
    <div className="navbar m-0 p-0">
      
      <div className="w-52 bg-secondarys h-full min-h-screen flex-row ">
        <img src="/images/expert_profile_pic.jpg" alt=""  className="w-[60%] mx-auto rounded-full mb-3 mt-3"/>
        <ul className=" flex-row text-white space-y-7 ml-8">
        <li><Link href='/expert/profile' className="menu_link">Your profile</Link></li>
          {
            verified=='1' &&  (<><li><Link href=''className="menu_link">Chats</Link> </li>
              <li><Link href='/expert/post' className="menu_link">View post</Link> </li>
              <li><Link href='' className="menu_link">Scheduled calls</Link></li>
              <li><Link href='' className="menu_link">Payment history</Link></li>
              <li><Link href='' className="menu_link">Meeting history</Link></li>
              <li><Link href='' className="menu_link">Feedbacks</Link></li>
              <li><Link href='' className="menu_link">Community</Link></li>
              </>)
          }
          <li><Link href='' className="menu_link" onClick={(e)=>{e.preventDefault(); handleLogout();}}>Logout</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
