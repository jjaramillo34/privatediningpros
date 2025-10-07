'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Building2, 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit, 
  Eye, 
  Search,
  Plus,
  RefreshCw,
  Star,
  MapPin,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  rating?: number;
  category?: string;
  featured?: boolean;
  short_description?: string;
  privateRooms?: Array<{
    name: string;
    capacity: number;
    description?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: Date;
}

export default function SuperAdminPage() {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'users' | 'analytics'>('restaurants');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    location: ''
  });
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    restaurantId: string;
    restaurantName: string;
    reason: string;
  }>({
    isOpen: false,
    restaurantId: '',
    restaurantName: '',
    reason: ''
  });

  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'delete';
    user: User | null;
  }>({
    isOpen: false,
    mode: 'create',
    user: null
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin' | 'super_admin',
    isActive: true
  });

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [restaurantsRes, usersRes] = await Promise.all([
        fetch('/api/restaurants'),
        fetch('/api/users')
      ]);
      
      if (restaurantsRes.ok) {
        const restaurantsData = await restaurantsRes.json();
        setRestaurants(restaurantsData);
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (restaurantId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          rejectionReason,
          approvedBy: session?.user?.id,
          approvedAt: new Date()
        })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleFeaturedToggle = async (restaurantId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          featured,
          featuredBy: session?.user?.id,
          featuredAt: featured ? new Date() : null
        })
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert(`Restaurant ${featured ? 'added to' : 'removed from'} featured list`);
      } else {
        const error = await response.json();
        console.error('Featured toggle error:', error);
        alert(`Error: ${error.error || error.message || 'Failed to update featured status'}`);
      }
    } catch (error) {
      console.error('Error updating restaurant featured status:', error);
      alert('Error updating restaurant featured status');
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!restaurant.name.toLowerCase().includes(searchLower) &&
          !restaurant.address.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.status && restaurant.status !== filters.status) return false;
    if (filters.category && restaurant.category !== filters.category) return false;
    if (filters.location) {
      const location = `${restaurant.city}, ${restaurant.state}`.toLowerCase();
      if (!location.includes(filters.location.toLowerCase())) return false;
    }
    return true;
  });

  // User management functions
  const openUserModal = (mode: 'create' | 'edit' | 'delete', user?: User) => {
    setUserModal({ isOpen: true, mode, user: user || null });
    if (mode === 'edit' && user) {
      setUserForm({
        name: user.name,
        email: user.email,
        password: '', // Don't pre-fill password
        role: user.role,
        isActive: user.isActive
      });
    } else if (mode === 'create') {
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
      });
    }
  };

  const closeUserModal = () => {
    setUserModal({ isOpen: false, mode: 'create', user: null });
    setUserForm({ name: '', email: '', password: '', role: 'user', isActive: true });
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      if (userModal.mode === 'create') {
        response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm)
        });
      } else if (userModal.mode === 'edit' && userModal.user) {
        response = await fetch(`/api/users/${userModal.user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...userForm,
            // Only include password if it's provided
            ...(userForm.password ? { password: userForm.password } : {})
          })
        });
      }

      if (response?.ok) {
        fetchData(); // Refresh data
        closeUserModal();
        alert(`User ${userModal.mode === 'create' ? 'created' : 'updated'} successfully!`);
      } else {
        const error = await response?.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    }
  };

  const handleDeleteUser = async () => {
    if (!userModal.user) return;
    
    try {
      const response = await fetch(`/api/users/${userModal.user._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData(); // Refresh data
        closeUserModal();
        alert('User deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const stats = {
    total: restaurants.length,
    pending: restaurants.filter(r => r.status === 'pending').length,
    approved: restaurants.filter(r => r.status === 'approved').length,
    rejected: restaurants.filter(r => r.status === 'rejected').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need super admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'restaurants'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Restaurants ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({stats.totalUsers})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'restaurants' && (
              <div>
                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {Array.from(new Set(restaurants.map(r => r.category).filter(Boolean))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Location..."
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Restaurants Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRestaurants.map((restaurant) => (
                        <tr key={restaurant._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                              <div className="text-sm text-gray-500">{restaurant.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPin className="h-4 w-4 mr-1" />
                              {restaurant.city}, {restaurant.state}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              restaurant.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : restaurant.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {restaurant.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {restaurant.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {restaurant.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {restaurant.status}
                            </span>
                            {restaurant.approvedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                {restaurant.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(restaurant.approvedAt).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {restaurant.rating ? (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-900">{restaurant.rating}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No rating</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(restaurant.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                href={`/restaurant/${restaurant._id}`}
                                className="text-blue-600 hover:text-blue-900"
                                title="View restaurant"
                                target="_blank"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/edit/${restaurant._id}`}
                                className="text-green-600 hover:text-green-900"
                                title="Edit restaurant"
                                target="_blank"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              {restaurant.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(restaurant._id, 'approved')}
                                    className="text-green-600 hover:text-green-900"
                                    title="Approve"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setRejectionModal({
                                      isOpen: true,
                                      restaurantId: restaurant._id,
                                      restaurantName: restaurant.name,
                                      reason: ''
                                    })}
                                    className="text-red-600 hover:text-red-900"
                                    title="Reject"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              {restaurant.status === 'approved' && (
                                <button
                                  onClick={() => handleFeaturedToggle(restaurant._id, !restaurant.featured)}
                                  className={`${restaurant.featured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-900`}
                                  title={restaurant.featured ? "Remove from Featured" : "Add to Featured"}
                                >
                                  <Star className={`h-4 w-4 ${restaurant.featured ? 'fill-current' : ''}`} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <button
                    onClick={() => openUserModal('create')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'super_admin' 
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openUserModal('edit', user)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit user"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openUserModal('delete', user)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics Dashboard</h3>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Restaurants</p>
                        <p className="text-3xl font-bold">{restaurants.length}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Approved</p>
                        <p className="text-3xl font-bold">{restaurants.filter(r => r.status === 'approved').length}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm">Pending Review</p>
                        <p className="text-3xl font-bold">{restaurants.filter(r => r.status === 'pending').length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm">Rejected</p>
                        <p className="text-3xl font-bold">{restaurants.filter(r => r.status === 'rejected').length}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-200" />
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Status Distribution Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Status Distribution</h4>
                    <div className="space-y-4">
                      {[
                        { status: 'approved', count: restaurants.filter(r => r.status === 'approved').length, color: 'bg-green-500', textColor: 'text-green-700' },
                        { status: 'pending', count: restaurants.filter(r => r.status === 'pending').length, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                        { status: 'rejected', count: restaurants.filter(r => r.status === 'rejected').length, color: 'bg-red-500', textColor: 'text-red-700' }
                      ].map((item) => {
                        const percentage = restaurants.length > 0 ? (item.count / restaurants.length) * 100 : 0;
                        return (
                          <div key={item.status} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="capitalize font-medium text-gray-700">{item.status}</span>
                              <span className={`font-semibold ${item.textColor}`}>{item.count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h4>
                    <div className="space-y-3">
                      {Object.entries(
                        restaurants.reduce((acc, restaurant) => {
                          const category = restaurant.category || 'Uncategorized';
                          acc[category] = (acc[category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([category, count]) => {
                          const percentage = restaurants.length > 0 ? (count / restaurants.length) * 100 : 0;
                          return (
                            <div key={category} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700">{category}</span>
                              </div>
                              <span className="font-semibold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Location Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Cities */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h4>
                    <div className="space-y-3">
                      {Object.entries(
                        restaurants.reduce((acc, restaurant) => {
                          const city = restaurant.city || 'Unknown';
                          acc[city] = (acc[city] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([city, count]) => (
                          <div key={city} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{city}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{count} restaurants</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h4>
                    <div className="space-y-3">
                      {[
                        { range: '4.5 - 5.0', min: 4.5, max: 5.0, color: 'bg-green-500' },
                        { range: '4.0 - 4.4', min: 4.0, max: 4.4, color: 'bg-blue-500' },
                        { range: '3.5 - 3.9', min: 3.5, max: 3.9, color: 'bg-yellow-500' },
                        { range: '3.0 - 3.4', min: 3.0, max: 3.4, color: 'bg-orange-500' },
                        { range: 'Below 3.0', min: 0, max: 2.9, color: 'bg-red-500' }
                      ].map((range) => {
                        const count = restaurants.filter(r => {
                          const rating = r.rating || 0;
                          return rating >= range.min && rating <= range.max;
                        }).length;
                        const percentage = restaurants.length > 0 ? (count / restaurants.length) * 100 : 0;
                        return (
                          <div key={range.range} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">{range.range}</span>
                              <span className="text-sm font-semibold text-gray-900">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${range.color}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Neighborhood Analytics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Analytics</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Neighborhoods */}
                    <div>
                      <h5 className="text-md font-medium text-gray-700 mb-3">Top Neighborhoods</h5>
                      <div className="space-y-3">
                        {Object.entries(
                          restaurants.reduce((acc, restaurant) => {
                            const neighborhood = restaurant.neighborhood || 'Not Specified';
                            acc[neighborhood] = (acc[neighborhood] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 8)
                          .map(([neighborhood, count]) => {
                            const percentage = restaurants.length > 0 ? (count / restaurants.length) * 100 : 0;
                            return (
                              <div key={neighborhood} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <span className="text-gray-700">
                                    {neighborhood === 'Not Specified' ? 'Not Specified' : neighborhood}
                                  </span>
                                </div>
                                <span className="font-semibold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Neighborhood Distribution Chart */}
                    <div>
                      <h5 className="text-md font-medium text-gray-700 mb-3">Neighborhood Distribution</h5>
                      <div className="space-y-3">
                        {Object.entries(
                          restaurants.reduce((acc, restaurant) => {
                            const neighborhood = restaurant.neighborhood || 'Not Specified';
                            acc[neighborhood] = (acc[neighborhood] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([neighborhood, count]) => {
                            const percentage = restaurants.length > 0 ? (count / restaurants.length) * 100 : 0;
                            const colors = [
                              'bg-purple-500',
                              'bg-indigo-500', 
                              'bg-blue-500',
                              'bg-green-500',
                              'bg-yellow-500'
                            ];
                            const textColors = [
                              'text-purple-700',
                              'text-indigo-700',
                              'text-blue-700', 
                              'text-green-700',
                              'text-yellow-700'
                            ];
                            const index = Object.keys(
                              restaurants.reduce((acc, restaurant) => {
                                const hood = restaurant.neighborhood || 'Not Specified';
                                acc[hood] = (acc[hood] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)
                            ).sort((a, b) => {
                              const countA = restaurants.reduce((acc, restaurant) => {
                                const hood = restaurant.neighborhood || 'Not Specified';
                                return hood === a ? acc + 1 : acc;
                              }, 0);
                              const countB = restaurants.reduce((acc, restaurant) => {
                                const hood = restaurant.neighborhood || 'Not Specified';
                                return hood === b ? acc + 1 : acc;
                              }, 0);
                              return countB - countA;
                            }).indexOf(neighborhood);

                            return (
                              <div key={neighborhood} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-700">
                                    {neighborhood === 'Not Specified' ? 'Not Specified' : neighborhood}
                                  </span>
                                  <span className={`font-semibold ${textColors[index] || 'text-gray-700'}`}>
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${colors[index] || 'bg-gray-500'}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Neighborhood Insights */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="text-md font-medium text-gray-700 mb-3">Neighborhood Insights</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {Object.keys(restaurants.reduce((acc, restaurant) => {
                              const neighborhood = restaurant.neighborhood || 'Not Specified';
                              acc[neighborhood] = (acc[neighborhood] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)).length - 1}
                          </p>
                          <p className="text-sm text-gray-600">Unique Neighborhoods</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">
                            {restaurants.filter(r => r.neighborhood && r.neighborhood !== 'Not Specified').length}
                          </p>
                          <p className="text-sm text-gray-600">With Neighborhood Data</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {restaurants.length > 0 ? 
                              ((restaurants.filter(r => r.neighborhood && r.neighborhood !== 'Not Specified').length / restaurants.length) * 100).toFixed(1) : 0
                            }%
                          </p>
                          <p className="text-sm text-gray-600">Coverage Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-4">
                    {restaurants
                      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                      .slice(0, 10)
                      .map((restaurant) => (
                        <div key={restaurant._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              restaurant.status === 'approved' ? 'bg-green-500' :
                              restaurant.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{restaurant.name}</p>
                              <p className="text-sm text-gray-500">
                                {restaurant.status === 'approved' ? 'Approved' :
                                 restaurant.status === 'pending' ? 'Pending review' : 'Rejected'} • 
                                {new Date(restaurant.updatedAt || restaurant.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{restaurant.city}, {restaurant.state}</p>
                            <p className="text-sm text-gray-500">{restaurant.category}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Private Rooms Analytics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Private Rooms Analytics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {restaurants.reduce((total, r) => total + (r.privateRooms?.length || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Private Rooms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {restaurants.length > 0 ? 
                          (restaurants.reduce((total, r) => total + (r.privateRooms?.length || 0), 0) / restaurants.length).toFixed(1) : 0
                        }
                      </p>
                      <p className="text-sm text-gray-600">Avg Rooms per Restaurant</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {restaurants.reduce((max, r) => {
                          const roomCapacities = r.privateRooms?.map(room => room.capacity || 0) || [];
                          const maxCapacity = roomCapacities.length > 0 ? Math.max(...roomCapacities) : 0;
                          return Math.max(max, maxCapacity);
                        }, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Max Room Capacity</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reject Restaurant
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject <strong>{rejectionModal.restaurantName}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (optional)
              </label>
              <textarea
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why this restaurant is being rejected..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectionModal({ isOpen: false, restaurantId: '', restaurantName: '', reason: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate(rejectionModal.restaurantId, 'rejected', rejectionModal.reason);
                  setRejectionModal({ isOpen: false, restaurantId: '', restaurantName: '', reason: '' });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {userModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {userModal.mode === 'create' ? 'Create New User' : 
               userModal.mode === 'edit' ? 'Edit User' : 'Delete User'}
            </h3>
            
            {userModal.mode === 'delete' ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete user <strong>{userModal.user?.name}</strong>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeUserModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {userModal.mode === 'create' ? '*' : '(leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    required={userModal.mode === 'create'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' | 'super_admin' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={userForm.isActive}
                    onChange={(e) => setUserForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active user
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeUserModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {userModal.mode === 'create' ? 'Create User' : 'Update User'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 