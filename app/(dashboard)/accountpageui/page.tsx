'use client';
import { baseUrl } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function ViewAccountInfo() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    idno: "",
    email: "",
    address: "",
    phoneno: "",
    gender: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(baseUrl + "/",{
        method: "GET",
        headers:{"Content-Type": "application/json",},
      } );
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(user: any) {
    setEditingUser(user);
    setForm({
      fullName: user.fullName || "",
      idno: user.idno || "",
      email: user.email || "",
      address: user.address || "",
      phoneno: user.phoneno || "",
      gender: user.gender || "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUser(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(userId:String) {
    // Send PUT to update the user
    try {
      const res = await fetch(baseUrl+ "/api/accountinfo/" + userId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to update");
        return;
      }

      // Update local state
      setUsers((prev) => prev.map((u) => (u.idno === form.idno ? json.user : u)));
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  }

  async function handleDelete(idno: string) {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await fetch("/api/accountinfo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idno }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to delete");
        return;
      }
      // Remove locally
      setUsers((prev) => prev.filter((u) => u.idno !== idno));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  }

  if (loading) return <p className="text-center mt-10 text-blue-400">Loading...</p>;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Customers</h1>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {users.map((user) => (
            <section
              key={user.idno}
              className="bg-white shadow-md rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-2">Account Information</h2>
              <div className="h-1 w-24 bg-blue-500 rounded-full mb-6"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Full Name:</span>
                  <span className="text-gray-800 font-bold">{user.fullName}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Id Number:</span>
                  <span className="text-gray-800">{user.idno}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-800">{user.email}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Address:</span>
                  <span className="text-gray-800">{user.address}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Contact:</span>
                  <span className="text-gray-800">{user.phoneno}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Gender:</span>
                  <span className="text-gray-800">{user.gender}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => openEdit(user)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Edit Info
                </button>
                <button
                  onClick={() => handleDelete(user.idno)}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Account
                </button>
              </div>
            </section>
          ))}

          {users.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No customers found.</p>
          )}
        </div>
      </div>

      {/* Modal overlay for editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* dark backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6 z-10">
            <h3 className="text-xl font-semibold mb-4">Edit Account</h3>

            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Full Name</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Id Number (readonly)</span>
                <input
                  name="idno"
                  value={form.idno}
                  readOnly
                  className="border rounded px-3 py-2 bg-gray-100"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Email</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Address</span>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Phone No</span>
                <input
                  name="phoneno"
                  value={form.phoneno}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Gender</span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                 onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
