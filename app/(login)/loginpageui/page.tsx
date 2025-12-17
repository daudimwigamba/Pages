'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/lib/constants";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";

function LoginPage() {
  const [domainEmail, setName] = useState("");
  const [domainPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

//modal responses
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");



  //handling submit form request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainEmail, domainPassword }),
        credentials: "include",
      });


      if (res.ok) 
        {
        setModalMessage("Attempt successful")
        setSuccessOpen(true)

        setTimeout(() => {
          window.location.href = "/dashboardpageui";
        }, 1500)
      }
      else {
        setModalMessage("Invalid username or password!")
        setErrorOpen(true)
      }
      // setResponseData(data); // displaying the JSON data
    } catch (error) {
      console.error(error);
      setModalMessage("Unable to connect to server!")
      setErrorOpen(true)
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex flex-col lg:flex-row min-h-screen">
    {/* ✅ DO NOT TOUCH MODALS */}
    <SuccessModal
      isOpen={successOpen}
      message={modalMessage}
      onClose={() => setSuccessOpen(false)}
    />

    <ErrorModal
      isOpen={errorOpen}
      message={modalMessage}
      onClose={() => setErrorOpen(false)}
    />

    {/* Left side logo */}
    <div className="
      hidden lg:flex 
      lg:w-1/2 
      bg-blue-400 
      items-center 
      justify-center
    ">
      <Image
        src="/logo2.png"
        alt="mhb logo"
        width={500}
        height={500}
        className="max-w-[70%] h-auto"
      />
    </div>

    {/* Right side form */}
    <div className="
      flex 
      flex-1 
      bg-white 
      items-center 
      justify-center 
      px-4
    ">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <h1 className="text-xl font-extrabold text-black text-center">
            Sign In
          </h1>

          <label className="block text-sm font-medium text-black">
            Username
          </label>
          <input
            type="text"
            value={domainEmail}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 rounded p-2 border-black text-black outline-none"
            required
          />

          <label className="block text-sm font-medium text-black">
            Password
          </label>
          <input
            type="password"
            value={domainPassword}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 rounded p-2 border-black text-black outline-none"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            size="lg"
            aria-label="Submit"
            className="bg-blue-400 hover:bg-blue-300 w-full rounded-md my-6"
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  </div>
);
}

export default LoginPage;