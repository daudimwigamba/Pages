'use client'
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

function ContactForm()
{
  const [name, setName] = useState()
  const [password, setPassword] = useState()
}
function LoginPage()
{
  return (
    <div className="flex left-0">
      <div className="w-200 h-200 bg-blue-400">
        <Image src="/logo2.png" alt="mhb logo" width={500} height={500} 
        className="mt-50 ml-25"
        />
      </div>
      <div className="w-200 h-200 bg-white">
        <div>
           <form className="max-w-sm mx-auto mt-10 space-y-4 mt-70">
            <h1 className="text-xl font-extrabold text-black text-center">Sign In</h1>
            <label className="block text-sm font-medium text-black">Username</label>
            <input type="text" className="w-full border-1 rounded p-2 border-black text-black" />
            <label className="block text-sm font-medium text-black">Password</label>
            <input type="password" className="w-full border-1 rounded p-2 border-black text-black"/>
            <button className="w-50 ml-18 mt-11 p-2 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 rounded-2xl">
              <Link href="/dashboardpageui">Login</Link>
            </button>
        </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage