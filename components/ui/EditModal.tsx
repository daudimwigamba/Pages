'use client'

interface EditModalProps  {
    user: {
        id: number;
        fullName: string;
        idno: string;
        email: string;
        address: string;
        phoneno: string;
        gender: string;
    };
    onClose: () => void;
}




export default function EditModal({ user, onClose }: EditModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Edit Info</h2>

        <input
          defaultValue={user.fullName}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          defaultValue={user.email}
          className="w-full border p-2 rounded mb-3"
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">
          Save Changes
        </button>

        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
