"use client"

import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar m-0 p-0">
      
      <div className="w-52 bg-primarys h-[100vh] flex-row ">
        <img src="/images/profile_pic.png" alt=""  className="w-[60%] mx-auto rounded-full mb-3 mt-3"/>
        <ul className=" flex-row text-white space-y-7 ">
          <li><Link href=''className="menu_link">Chats</Link> </li>
          <li><Link href='' className="menu_link">View post</Link> </li>
          <li><Link href='' className="menu_link">Scheduled calls</Link></li>
          <li><Link href='' className="menu_link">Payment history</Link></li>
          <li><Link href='' className="menu_link">Meeting history</Link></li>
          <li><Link href='/profile' className="menu_link">Your profile</Link></li>
          <li><Link href='' className="menu_link">Feedbacks</Link></li>
          <li><Link href='' className="menu_link">Community</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
