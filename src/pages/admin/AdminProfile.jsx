import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { admin } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h1>
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-bold text-xl text-gray-800">{admin?.username}</p>
              <p className="text-sm text-blue-600">Administrator</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Role: <span className="font-medium text-gray-700">Admin</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}
