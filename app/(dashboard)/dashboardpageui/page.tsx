"use client";
import React, { useState } from "react";

const HomePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateofBirth: "",
    identificationType: "",
    identificationNumber: "",
    email: "",
    address: "",
    contact: "",
    gender: "M",
    marriageStatus: "",
    spouseName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.middleName.trim()) newErrors.middleName = "Middle name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateofBirth) newErrors.dateofBirth = "Date of Birth is required";
    if (!formData.identificationType) newErrors.identificationType = "Enter ID Type";
    if (!formData.identificationNumber) newErrors.identificationNumber = "ID Number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.contact.trim()) newErrors.contact = "Enter a valid phone number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email is not valid";
    if (formData.marriageStatus === "Married" && !formData.spouseName.trim())
      newErrors.spouseName = "Spouse name is required for married users";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const res = await fetch("/api/userdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Details submitted successfully ");
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          dateofBirth: "",
          identificationType: "",
          identificationNumber: "",
          email: "",
          address: "",
          contact: "",
          gender: "M",
          marriageStatus: "",
          spouseName: "",
        });

        setTimeout(() => {
          setMessage("");
        }, 2000);
      } 
      else 
        {
        setMessage(data.message || "Failed to submit details ");
      }
    } catch (err) {
      setMessage("Server error, please try again later ");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
      <h1 className="text-2xl text-orange-400 text-center mb-6">
        Welcome to the Dashboard
      </h1>

      <section className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-x-8 gap-y-5">
          {/* First Name */}
          <div>
            <label className="block text-gray-950 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-gray-950 mb-1">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.middleName && <p className="text-red-500 text-sm">{errors.middleName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-950 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-950 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.dateofBirth && <p className="text-red-500 text-sm">{errors.dateofBirth}</p>}
          </div>

          {/* ID Type */}
          <div>
            <label className="block text-gray-950 mb-1">ID Type</label>
            <input
              type="text"
              name="identificationType"
              value={formData.identificationType}
              onChange={handleChange}
              list="IDType"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            <datalist id="IDType">
              <option value="NIDA" />
            </datalist>
            {errors.identificationType && <p className="text-red-500 text-sm">{errors.identificationType}</p>}
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-gray-950 mb-1">ID Number</label>
            <input
              type="text"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.identificationNumber && <p className="text-red-500 text-sm">{errors.identificationNumber}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-950 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-950 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-gray-950 mb-1">Phone Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
          </div>

          {/* Gender */}
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

          {/* Marital Status */}
          <div>
            <label className="block text-gray-950 mb-1">Marital Status</label>
            <select
              name="marriageStatus"
              value={formData.marriageStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select..</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          {/* Spouse Name */}
          <div>
            <label className="block text-gray-950 mb-1">Spouse Name</label>
            <input
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              disabled={formData.marriageStatus === "Single"}
              className={`w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-400 focus:outline-none ${
                formData.marriageStatus === "Single" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {errors.spouseName && <p className="text-red-500 text-sm">{errors.spouseName}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold w-40 py-2 rounded-full col-span-full mt-6 mx-65"
          >
            Submit
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.includes("successfully") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
};

export default HomePage;
