import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const Navbar = () => {
  return (
    <div className="navbar m-0 p-0">
      
      <div className="w-52 bg-adminprimary h-full min-h-screen flex-row text-black">
        <Image src="/images/expert_profile_pic.jpg" alt=""  className="w-[60%] mx-auto rounded-full mb-3 mt-3"/>
        <ul className=" flex-row text-black space-y-7 ml-8">
          <li><Link href='/admin/client'className="menu_link"> Clients</Link> </li>
          <li><Link href='/admin/experts' className="menu_link">Experts</Link> </li>
          <li><Link href='' className="menu_link">Payments</Link></li>
          <li><Link href='/admin/meeting/meetingList' className="menu_link">Meeting history</Link></li>
          <li><Link href='/admin/concerns' className="menu_link">Support request</Link></li>
          <li><Link href='' className="menu_link">Recordings</Link></li>
          <li><Link href='' className="menu_link">Settings</Link></li>
          <li><Link href='' className="menu_link">Logout</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
