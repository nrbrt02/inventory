'use client';

import { useState, useEffect } from 'react';

// Define all possible roles
type UserRole = 
  | 'Blocker' 
  | 'Scale Monitor' 
  | 'Saler' 
  | 'Stock Keeper' 
  | 'Client' 
  | 'Driver' 
  | 'Supplier' 
  | 'Production Manager' 
  | 'Cashier'
  | 'Admin';

interface User {
  id: number;
  names: string;
  phoneNumber: string;
  address: string;
  roles: UserRole[];
  status: 'Active' | 'Inactive';
  joinDate: string;
  // Additional role-specific fields
  licenseNumber?: string;
  district?: string;
  sector?: string;
  cell?: string;
}

interface UserFormData {
  names: string;
  phoneNumber: string;
  address: string;
  selectedRoles: UserRole[];
  licenseNumber?: string;
  district?: string;
  sector?: string;
  cell?: string;
  password?: string;
  sendSetupEmail: boolean;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: UserFormData) => void;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User;
}

const AddUserModal = ({ isOpen, onClose, onAdd }: AddUserModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    names: '',
    phoneNumber: '',
    address: '',
    selectedRoles: ['Stock Keeper'],
    sendSetupEmail: true
  });

  const allRoles: UserRole[] = [
    'Admin',
    'Blocker',
    'Scale Monitor',
    'Saler',
    'Stock Keeper',
    'Client',
    'Driver',
    'Supplier',
    'Production Manager',
    'Cashier'
  ];

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => {
      const newRoles = prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role];
      return { ...prev, selectedRoles: newRoles };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={`flex items-center ${num < step ? 'text-blue-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    num <= step ? 'border-blue-500 text-blue-500' : 'border-gray-300'
                  }`}>
                    {num}
                  </div>
                  {num < 4 && <div className={`flex-1 h-1 mx-2 ${num < step ? 'bg-blue-500' : 'bg-gray-300'}`} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Names"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.names}
                  onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Address"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-medium">Select Roles (can choose multiple)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {allRoles.map(role => (
                    <div key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`role-${role}`}
                        checked={formData.selectedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`role-${role}`} className="ml-2 text-sm text-gray-700">
                        {role}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.selectedRoles.includes('Driver') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Driver License Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg mt-1"
                      value={formData.licenseNumber || ''}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required={formData.selectedRoles.includes('Driver')}
                    />
                  </div>
                )}

                {formData.selectedRoles.includes('Supplier') && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg mt-1"
                          value={formData.district || ''}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          required={formData.selectedRoles.includes('Supplier')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sector</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg mt-1"
                          value={formData.sector || ''}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          required={formData.selectedRoles.includes('Supplier')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cell</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg mt-1"
                          value={formData.cell || ''}
                          onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                          required={formData.selectedRoles.includes('Supplier')}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="setupEmail"
                    checked={formData.sendSetupEmail}
                    onChange={(e) => setFormData({ ...formData, sendSetupEmail: e.target.checked })}
                  />
                  <label htmlFor="setupEmail">Send setup email to user</label>
                </div>
                {!formData.sendSetupEmail && (
                  <input
                    type="password"
                    placeholder="Set Initial Password"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Review User Details</h3>
                  <p><span className="font-semibold">Names:</span> {formData.names}</p>
                  <p><span className="font-semibold">Phone:</span> {formData.phoneNumber}</p>
                  <p><span className="font-semibold">Address:</span> {formData.address}</p>
                  <p><span className="font-semibold">Roles:</span> {formData.selectedRoles.join(', ')}</p>
                  {formData.selectedRoles.includes('Driver') && (
                    <p><span className="font-semibold">License Number:</span> {formData.licenseNumber}</p>
                  )}
                  {formData.selectedRoles.includes('Supplier') && (
                    <>
                      <p><span className="font-semibold">District:</span> {formData.district}</p>
                      <p><span className="font-semibold">Sector:</span> {formData.sector}</p>
                      <p><span className="font-semibold">Cell:</span> {formData.cell}</p>
                    </>
                  )}
                  <p><span className="font-semibold">Setup Method:</span> {formData.sendSetupEmail ? 'Email Setup Link' : 'Manual Password'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create User
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [editedUser, setEditedUser] = useState<User>({
    id: user?.id || 0,
    names: user?.names || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    roles: user?.roles || ['Stock Keeper'],
    status: user?.status || 'Active',
    joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
    licenseNumber: user?.licenseNumber || '',
    district: user?.district || '',
    sector: user?.sector || '',
    cell: user?.cell || ''
  });

  const allRoles: UserRole[] = [
    'Admin',
    'Blocker',
    'Scale Monitor',
    'Saler',
    'Stock Keeper',
    'Client',
    'Driver',
    'Supplier',
    'Production Manager',
    'Cashier'
  ];

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleRoleToggle = (role: UserRole) => {
    setEditedUser(prev => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles: newRoles };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit User</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Names"
              className="w-full px-4 py-2 border rounded-lg"
              value={editedUser.names}
              onChange={(e) => setEditedUser({ ...editedUser, names: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-lg"
              value={editedUser.phoneNumber}
              onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
              required
            />
            <textarea
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-lg"
              value={editedUser.address}
              onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Roles</label>
              <div className="grid grid-cols-2 gap-2">
                {allRoles.map(role => (
                  <div key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-role-${role}`}
                      checked={editedUser.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`edit-role-${role}`} className="ml-2 text-sm text-gray-700">
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {editedUser.roles.includes('Driver') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver License Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                  value={editedUser.licenseNumber || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, licenseNumber: e.target.value })}
                  required={editedUser.roles.includes('Driver')}
                />
              </div>
            )}

            {editedUser.roles.includes('Supplier') && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    value={editedUser.district || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, district: e.target.value })}
                    required={editedUser.roles.includes('Supplier')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sector</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    value={editedUser.sector || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, sector: e.target.value })}
                    required={editedUser.roles.includes('Supplier')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cell</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    value={editedUser.cell || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, cell: e.target.value })}
                    required={editedUser.roles.includes('Supplier')}
                  />
                </div>
              </div>
            )}

            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={editedUser.status}
              onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value as User['status'] })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'Admin':
      return 'bg-purple-100 text-purple-800';
    case 'Blocker':
      return 'bg-red-100 text-red-800';
    case 'Scale Monitor':
      return 'bg-yellow-100 text-yellow-800';
    case 'Saler':
      return 'bg-green-100 text-green-800';
    case 'Stock Keeper':
      return 'bg-blue-100 text-blue-800';
    case 'Client':
      return 'bg-indigo-100 text-indigo-800';
    case 'Driver':
      return 'bg-pink-100 text-pink-800';
    case 'Supplier':
      return 'bg-orange-100 text-orange-800';
    case 'Production Manager':
      return 'bg-teal-100 text-teal-800';
    case 'Cashier':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      names: 'John Doe',
      phoneNumber: '123-456-7890',
      address: '123 Main St',
      roles: ['Admin', 'Stock Keeper'],
      status: 'Active',
      joinDate: '2025-01-01'
    },
    {
      id: 2,
      names: 'Jane Smith',
      phoneNumber: '098-765-4321',
      address: '456 Oak Ave',
      roles: ['Cashier'],
      status: 'Active',
      joinDate: '2025-02-15'
    },
    {
      id: 3,
      names: 'Mike Johnson',
      phoneNumber: '555-123-4567',
      address: '789 Pine Rd',
      roles: ['Driver'],
      status: 'Active',
      joinDate: '2025-03-10',
      licenseNumber: 'DRV123456'
    },
    {
      id: 4,
      names: 'Sarah Williams',
      phoneNumber: '555-987-6543',
      address: '321 Elm Blvd',
      roles: ['Supplier'],
      status: 'Active',
      joinDate: '2025-04-05',
      district: 'Kicukiro',
      sector: 'Gikondo',
      cell: 'Kanserege'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getStatusColor = (status: User['status']) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredUsers = users.filter(user =>
    (user.names.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.roles.includes(roleFilter as UserRole)) &&
    (statusFilter === 'all' || user.status === statusFilter)
  );

  const handleAddUser = (userData: UserFormData) => {
    const newUser: User = {
      id: users.length + 1,
      names: userData.names,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      roles: userData.selectedRoles,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      licenseNumber: userData.licenseNumber,
      district: userData.district,
      sector: userData.sector,
      cell: userData.cell
    };
    setUsers([...users, newUser]);
  };

  const handleDeactivateUser = (user: User) => {
    setSelectedUser(user);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeactivation = () => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      ));
    }
    setIsConfirmDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage system users and their roles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {['Admin', 'Stock Keeper', 'Cashier', 'Driver', 'Supplier'].map((role) => (
          <div key={role} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">{role}s</div>
            <div className="text-2xl font-bold text-gray-800">
              {users.filter(user => user.roles.includes(role as UserRole)).length}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Filters & Search</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Blocker">Blocker</option>
              <option value="Scale Monitor">Scale Monitor</option>
              <option value="Saler">Saler</option>
              <option value="Stock Keeper">Stock Keeper</option>
              <option value="Client">Client</option>
              <option value="Driver">Driver</option>
              <option value="Supplier">Supplier</option>
              <option value="Production Manager">Production Manager</option>
              <option value="Cashier">Cashier</option>
            </select>

            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">User List</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Names</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/70`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.names}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <span key={role} className={`px-2 py-1 text-xs rounded-full ${getRoleColor(role)}`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeactivateUser(user)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser!}
      />

      {isConfirmDialogOpen && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
              <p>Are you sure you want to {selectedUser?.status === 'Active' ? 'deactivate' : 'activate'} this user?</p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeactivation}
                  className={`px-4 py-2 ${selectedUser?.status === 'Active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg`}
                >
                  {selectedUser?.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}