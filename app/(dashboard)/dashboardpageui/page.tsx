"use client";
import { error } from "console";
import React, { useState } from "react";

const HomePage = () => {
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    dob: "",
    idtype: "",
    idno: "",
    email: "",
    address: "",
    phoneno: "",
    gender: "M",
    mstatus: "",
    sname: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.mname.trim()) newErrors.mname = "Middle name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.idtype) newErrors.idtype = "Enter ID Type";
    if (!formData.idno) newErrors.idno = "ID Number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phoneno.trim()) newErrors.phoneno = "Enter a valid phone number";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }
    if(!formData.sname.trim()) newErrors.sname = "Spouse name is required"

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Form submitted successfully!");
      console.log("Form Data:", formData);
      setFormData({
        fname: "",
        mname: "",
        lname: "",
        dob: "",
        idtype: "",
        idno: "",
        email: "",
        address: "",
        phoneno: "",
        gender: "M",
        mstatus: "",
        sname: "",
      });
    } else {
      toast.error("Please fix the highlighted errors");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
      <h1 className="text-2xl text-orange-400 text-center mb-6">
        Welcome to the Dashboard
      </h1>

      <section className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form
          onSubmit={handleSubmit}
          className="grid sm:grid-cols-3 gap-x-8 gap-y-5"
        >
          {/** First Name */}
          <div>
            <label className="block text-gray-950 mb-1">First Name</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Enter First Name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname}</p>}
          </div>

          {/** Middle Name */}
          <div>
            <label className="block text-gray-950 mb-1">Middle Name</label>
            <input
              type="text"
              name="mname"
              value={formData.mname}
              onChange={handleChange}
              placeholder="Enter Second Name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.mname && <p className="text-red-500 text-sm">{errors.mname}</p>}
          </div>

          {/** Last Name */}
          <div>
            <label className="block text-gray-950 mb-1">Last Name</label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Enter Last Name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.lname && <p className="text-red-500 text-sm">{errors.lname}</p>}
          </div>

          {/** Date of Birth */}
          <div>
            <label className="block text-gray-950 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          {/** ID Type */}
          <div>
            <label className="block text-gray-950 mb-1">Identification Type</label>
            <input
              type="text"
              name="idtype"
              list="IDType"
              value={formData.idtype}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            <datalist id="IDType">
              <option value="NIDA"/>
            </datalist>
            {errors.idtype && <p className="text-red-500 text-sm">{errors.idtype}</p>}
          </div>

          {/** ID Number */}
          <div>
            <label className="block text-gray-950 mb-1">Identification Number</label>
            <input
              type="text"
              name="idno"
              value={formData.idno}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.idno && <p className="text-red-500 text-sm">{errors.idno}</p>}
          </div>

          {/** Email */}
          <div>
            <label className="block text-gray-950 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/** Address */}
          <div>
            <label className="block text-gray-950 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/** Phone Number */}
          <div>
            <label className="block text-gray-950 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneno"
              value={formData.phoneno}
              onChange={handleChange}
              placeholder="+255"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.phoneno && <p className="text-red-500 text-sm">{errors.phoneno}</p>}
          </div>

          {/** Gender */}
          <div>
            <label className="block text-gray-950 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>


             {/** Marital Status */}
          <div>
            <label className="block text-gray-950 mb-1">Marital Status</label>
            <select
              name="mstatus"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
               <option value="Separated">Separated</option>
               <option value="Widowed">Widowed</option>
            </select>
          </div>

             {/**Spouse Name*/}
          <div>
            <label className="block text-gray-950 mb-1">Spouse Name</label>
              <input
              type="text"
              name="sname"
              value={formData.mname}
              onChange={handleChange}
              placeholder="Enter Spuse name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.sname && <p className="text-red-500 text-sm">{errors.sname}</p>}
          </div>
        </form>
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold w-40 py-2 rounded-full transition"
          >
            Submit
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
