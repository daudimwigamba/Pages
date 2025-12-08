"use client";
import { baseUrl } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function ViewAccountInfo() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    identificationNumber: "",
    email: "",
    address: "",
    contact: "",
    gender: "",
  });

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(baseUrl + "/customers/fetch-all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
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
      id: user.id || "",
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      identificationNumber: user.identificationNumber || "",
      email: user.email || "",
      address: user.address || "",
      contact: user.contact || "",
      gender: user.gender || "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUser(null);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(id: number) {
    try {
      const res = await fetch(baseUrl + `/customers/update/{id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to update");
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.identificationNumber === form.identificationNumber ? json.user : u
        )
      );
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  }

  async function handleDelete(email: string) {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await fetch(baseUrl + `/customers/delete/${email}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to delete");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  }

  // Filtered & Paginated Users
  const filteredUsers = users.filter((u) =>
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return <p className="text-center mt-10 text-blue-400">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {" "}
      <h1 className="text-3xl font-bold">Customers</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Last Name"
          className="border border-gray-300 rounded-full p-2 px-4 focus:ring-blue-400 focus:outline-none w-80"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button>Search</button>
      </div>
      <table className="w-full border border-blue-300 rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">ID Number</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Gender</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr
              key={user.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="p-3">
                {user.firstName} {user.middleName} {user.lastName}
              </td>
              <td className="p-3">{user.identificationNumber}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.address}</td>
              <td className="p-3">{user.contact}</td>
              <td className="p-3">{user.gender}</td>
              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => openEdit(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.identificationNumber)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {displayedUsers.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6 z-10">
            <h3 className="text-xl font-semibold mb-4">Edit Account</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                "firstName",
                "middleName",
                "lastName",
                "email",
                "address",
                "contact",
              ].map((field) => (
                <label key={field} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    name={field}
                    value={form[field as keyof typeof form]}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />
                </label>
              ))}
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">
                  Id Number (readonly)
                </span>
                <input
                  name="identificationNumber"
                  value={form.identificationNumber}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-gray-100"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">
                  Gender
                </span>
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
                onClick={() => handleSave(editingUser.id)}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
