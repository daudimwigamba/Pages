"use client";
import { baseUrl } from "@/lib/constants";
import { useEffect, useState } from "react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

export default function ViewAccountInfo() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    identificationNumber: "",
    identificationType: "",
    email: "",
    address: "",
    contact: "",
    gender: "",
    marriageStatus: "",
    spouseName: "",
  });

  // Confirm modal for delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | number | null>(null);

  // Operation states
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Feedback modals
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Pending update state
  const [pendingUpdate, setPendingUpdate] = useState<any | null>(null);

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
      const res = await fetch(`${baseUrl}/customers/fetch-all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Fetch users failed:", err);
        setUsers([]);
        setModalMessage("Failed to fetch customers.");
        setErrorOpen(true);
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      setModalMessage("Unable to connect to server to fetch users.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(user: any) {
    setEditingUser(user);
    setForm({
      id: user?.id ?? "",
      firstName: user?.firstName ?? "",
      middleName: user?.middleName ?? "",
      lastName: user?.lastName ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
      identificationNumber: user?.identificationNumber ?? "",
      email: user?.email ?? "",
      address: user?.address ?? "",
      contact: user?.contact ?? "",
      gender: user?.gender ?? "",
      marriageStatus: user?.marriageStatus ?? "",
      spouseName: user?.spouseName ?? "",
      identificationType: user?.identificationType ?? "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUser(null);
    setForm({
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      identificationNumber: "",
      identificationType: "",
      email: "",
      address: "",
      contact: "",
      gender: "",
      marriageStatus: "",
      spouseName: "",
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(id: string | number) {
    if (!id) {
      setModalMessage("Missing user id.");
      setErrorOpen(true);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/customers/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Update error:", json);
        setModalMessage(json.error || "Failed to update customer.");
        setErrorOpen(true);
        return;
      }

      const updatedUser = json.user ?? json;

      // Store update temporarily
      setPendingUpdate(updatedUser);

      // Close edit modal but do NOT update table yet
      closeModal();
      fetchUsers();

      // Show success modal
      setModalMessage("Customer updated successfully.");
      setSuccessOpen(true);
    } catch (err) {
      console.error("Update failed:", err);
      setModalMessage("Update failed. Please try again.");
      setErrorOpen(true);
    } finally {
      setSaving(false);
    }
  }

  function requestDelete(id: string | number) {
    setToDeleteId(id);
    setIsConfirmOpen(true);
  }

  async function handleDeleteConfirmed() {
    const id = toDeleteId;
    if (!id) {
      setModalMessage("Missing user id for deletion.");
      setErrorOpen(true);
      setIsConfirmOpen(false);
      return;
    }

    setDeletingId(id);
    setIsConfirmOpen(false);

    try {
      const res = await fetch(`${baseUrl}/customers/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Delete error:", json);
        setModalMessage(json.error || "Failed to delete customer.");
        setErrorOpen(true);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setModalMessage("Customer deleted successfully.");
      setSuccessOpen(true);
    } catch (err) {
      console.error("Delete failed:", err);
      setModalMessage("Delete failed. Please try again.");
      setErrorOpen(true);
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    if (!normalizedSearch) return true;
    const parts = [
      u?.firstName ?? "",
      u?.middleName ?? "",
      u?.lastName ?? "",
      u?.email ?? "",
      u?.identificationNumber ?? "",
    ];
    return parts.join(" ").toLowerCase().includes(normalizedSearch);
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  if (loading) return <p className="text-center mt-10 text-blue-400">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Feedback Modals */}
      <SuccessModal
        isOpen={successOpen}
        message={modalMessage}
        onClose={() => {
          setSuccessOpen(false);

          // Apply pending update after modal closes
          if (pendingUpdate) {
            setUsers((prev) =>
              prev.map((u) => (u.id === pendingUpdate.id ? pendingUpdate : u))
            );
            setPendingUpdate(null);
          }
        }}
      />
      <ErrorModal
        isOpen={errorOpen}
        message={modalMessage}
        onClose={() => setErrorOpen(false)}
      />

      {/* Confirm Delete */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10 text-center">
            <h3 className="text-xl font-semibold mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white"
                disabled={Boolean(deletingId)}
              >
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold">Customers</h1>

      {/* Search */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name, email or ID number"
          className="border border-gray-300 rounded-full p-2 px-4 focus:ring-blue-400 focus:outline-none w-250"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <table className="w-full border border-blue-300 rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">Date of Birth</th>
            <th className="p-3 text-left">ID Number</th>
            <th className="p-3 text-left">ID Type</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Gender</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-3">{user.firstName} {user.middleName} {user.lastName}</td>
              <td className="p-3">{user.dateOfBirth}</td>
              <td className="p-3">{user.identificationNumber}</td>
              <td className="p-3">{user.identificationType}</td>
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
                  onClick={() => requestDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {displayedUsers.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center p-4 text-gray-500">
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
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6 z-70">
            <h3 className="text-xl font-semibold mb-4">Edit Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "firstName", label: "First Name" },
                { name: "middleName", label: "Middle Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email" },
                { name: "address", label: "Address" },
                { name: "contact", label: "Contact" },
                { name: "dateOfBirth", label: "Date of Birth", readonly: true },
                { name: "identificationNumber", label: "ID Number", readonly: true },
                { name: "identificationType", label: "ID Type", readonly: true },
                { name: "gender", label: "Gender", select: ["", "Male", "Female", "Other"] },
                { name: "marriageStatus", label: "Marital Status", select: ["", "Single", "Married", "Separated", "Widowed"] },
                { name: "spouseName", label: "Spouse Name", readonly: true },
              ].map((f) => (
                <label key={f.name} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">{f.label}</span>
                  {f.select ? (
                    <select
                      name={f.name}
                      value={(form as any)[f.name] ?? ""}
                      onChange={handleChange}
                      className="border rounded px-3 py-2"
                    >
                      {f.select.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt || "Select"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={f.name}
                      value={(form as any)[f.name] ?? ""}
                      onChange={handleChange}
                      readOnly={f.readonly}
                      className={`border rounded px-3 py-2 ${f.readonly ? "bg-gray-100" : ""}`}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={() => handleSave(form.id)}
                className="px-4 py-2 rounded bg-blue-600 text-white"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
