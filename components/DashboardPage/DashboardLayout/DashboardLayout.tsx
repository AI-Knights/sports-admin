"use client"
import React, { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar';
import { SidebarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';


type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    const [sidebarIcon, setSideBar] = useState<boolean>(false)
    const pathname = usePathname();
    const isLoginRoute = pathname === "/sign-in" || pathname === "/verify-otp";
    console.log({path : pathname , isLoginRoute})
    return (
        <div className={cn('h-screen md:grid grid-cols-12 relative overflow-x-hidden gap-4 ')}>
            <div className={cn(sidebarIcon ? "translate-x-[1px] z-50" : "translate-x-[700px] ", 'md:hidden absolute top-16    overflow-hidden')}>
                {isLoginRoute ? <></> : <Sidebar variant='mobile' />}
            </div>
            <div className={cn(isLoginRoute ? " col-span-2 hidden":' h-screen hidden md:block col-span-2 ')}>
               {isLoginRoute ? " " :  <Sidebar variant='desktop' /> }
            </div>
            <div className={cn(isLoginRoute ? "col-span-12" :'  col-span-10 relative overflow-auto')}>
                <div className='flex md:hidden z-50 backdrop-blur-2xl w-full top-0 flex-row absolute py-4 justify-between items-center' >
                    <div className=' p-2 transition-all cursor-pointer  rounded-full hover:bg-white/80' onClick={() => setSideBar(!sidebarIcon)} >
                        {isLoginRoute ? " " : <SidebarIcon />}
                    </div>
                    <div className='font-bold text-2xl'>
                        Score Live Admin Panel
                    </div>
                </div>
                <div>
                    {children}

                </div>


            </div>
        </div>
    )
}