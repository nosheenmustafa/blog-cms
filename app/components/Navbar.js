'use client'
import React from 'react'
import { Pacifico } from "next/font/google";
import Link from 'next/link'
import {useSession, signIn,signOut} from 'next-auth/react'
import {usePathname} from 'next/navigation'
import {useRouter} from 'next/navigation'
import Image from 'next/image';

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'], // Pacifico actually only has 400 weight
});


const Navbar = () => {
    const pathname =usePathname();
    const {data:session} = useSession();
    const router = useRouter();
    if(session){
      const profileimag = session.user?.image || ""
    

    //hanlde logout 
const handleLogout=async()=>{
  await signOut({redirect:false});
  router.push('/login')
}
  return (
    <>
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between px-16 py-4 text-white font-bold bg-blue-900 h-16">


       <div>
          <Link href="/blogs" className={`${pacifico.className} text-3xl`}>DevTalk</Link>
       </div>
       <div className="flex gap-2 text-center items-center"><p>Welcome   {session.user?.name || ""}</p>
      <Image src={profileimag} alt="profile" height={50} width= {50} className="rounded-full"/></div>
         <div className="flex text-center items-center ">
            <ul className="flex gap-4 pt-2">
              <Link href="/" className={`${pathname === '/' ? 'text-blue-300' :''}`}>Home</Link>
              {/* <Link  href="/Categories" className={`${pathname === '/Categories' ? 'text-blue-300' :''}`}>Categories</Link> */}
              <Link  href="/About" className={`${pathname === '/About' ? 'text-blue-300': ''}`}>About</Link>
              <button className="bg-blue-200 text-center items-center hover:bg-blue-400 px-2 py-2 -mt-1 rounded-lg" onClick={handleLogout}>Logout</button>

              

            </ul>
         </div>


    </div>
    </>
  )
    }
}

export default Navbar