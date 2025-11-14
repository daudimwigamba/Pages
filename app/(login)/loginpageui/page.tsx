'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@radix-ui/react-switch";

function LoginPage() {
  const [domainEmail, setName] = useState("");
  const [domainPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null); // store JSON response

  //handling submit form request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseData(null);

    try {
      const res = await fetch("http://192.168.12.28:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainEmail, domainPassword }),
      });

      const data = await res.json();

      const token = data.token;

      if (token) {
        const cookieRes = await fetch("/api/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({token}),
        });

      if (cookieRes.ok) {
        window.location.href = "/dashboardpageui";
      }
      else {
        alert("Failure to save token cookie!")
      }
      }
      else {
        alert("Login failed. No token received.")
      }


      setResponseData(data); // display the JSON data
    } catch (error) {
      console.error(error);
      setResponseData({ error: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex left-0">
      {/* Left side logo */}
      <div className="w-200 h-200 bg-blue-400">
        <Image
          src="/logo2.png"
          alt="mhb logo"
          width={500}
          height={500}
          className="mt-50 ml-25"
        />
      </div>

      {/* Right side form */}
      <div className="w-200 h-200 bg-white flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto my-10 space-y-4"
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
            variant="outline" size="lg" aria-label="Submit" className="bg-blue-400 hover:bg-blue-300 w-full rounded-md my-6"
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        {/* Display JSON response below form */}
        {responseData && (
          <div className="mt-6 bg-gray-100 p-4 rounded w-[400px] text-left">
            <h2 className="font-semibold text-black mb-2">Server Response:</h2>
            <pre className="text-sm text-gray-800 bg-white p-2 rounded overflow-auto">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
