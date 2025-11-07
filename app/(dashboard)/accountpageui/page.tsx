

export default function ViewAccountInfo() {
  // In a real app, this data would come from a database or API
  const userData = {
    fullName: " ",
    DOB: " ",
    idno: " ",
    email: "",
    address: " ",
    phoneno: " ",
    gender: " ",
  };

  return (
    <>
      <section className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
        <h1 className="text-2xl font-bold mb-2">Account Information</h1>
        <div className="h-1 w-24 bg-blue-500 rounded-full mb-6"></div>

        {/* User info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Full Name:</span>
            <span className="text-gray-800">{userData.fullName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Id Number:</span>
            <span className="text-gray-800">{userData.idno}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-800">{userData.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Address:</span>
            <span className="text-gray-800">{userData.address}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Contact:</span>
            <span className="text-gray-800">{userData.phoneno}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Gender:</span>
            <span className="text-gray-800">{userData.gender}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">
            Edit Info
          </button>
          <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">
            Delete Account
          </button>
        </div>
      </section>
    </>
  );
}
