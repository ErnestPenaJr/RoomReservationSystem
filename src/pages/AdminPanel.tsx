import React, { useState } from 'react';
import { Users, Building2, Settings, Plus, X, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { User, Room } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import toast from 'react-hot-toast';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'rooms'>('users');
  const { rooms, users, addRoom, updateRoom, deleteRoom, addUser, updateUser, deleteUser } = useStore();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    floor: '',
    building: '',
    imageUrl: '',
    amenities: '',
  });
  const [editRoom, setEditRoom] = useState({
    name: '',
    capacity: '',
    floor: '',
    building: '',
    imageUrl: '',
    amenities: '',
    status: 'available' as const,
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as const,
    department: '',
  });
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    department: '',
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const room: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRoom.name,
      capacity: parseInt(newRoom.capacity),
      floor: parseInt(newRoom.floor),
      building: newRoom.building,
      imageUrl: newRoom.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      amenities: newRoom.amenities.split(',').map((item) => item.trim()),
      status: 'available',
    };
    addRoom(room);
    setShowAddRoom(false);
    setNewRoom({
      name: '',
      capacity: '',
      floor: '',
      building: '',
      imageUrl: '',
      amenities: '',
    });
    toast.success('Room added successfully');
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setEditRoom({
      name: room.name,
      capacity: room.capacity.toString(),
      floor: room.floor.toString(),
      building: room.building,
      imageUrl: room.imageUrl,
      amenities: room.amenities.join(', '),
      status: room.status,
    });
    setShowEditRoom(true);
  };

  const handleUpdateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const updatedRoom: Room = {
      ...selectedRoom,
      name: editRoom.name,
      capacity: parseInt(editRoom.capacity),
      floor: parseInt(editRoom.floor),
      building: editRoom.building,
      imageUrl: editRoom.imageUrl || selectedRoom.imageUrl,
      amenities: editRoom.amenities.split(',').map((item) => item.trim()),
      status: editRoom.status,
    };

    updateRoom(updatedRoom);
    setShowEditRoom(false);
    setSelectedRoom(null);
    toast.success('Room updated successfully');
  };

  const handleDeleteRoom = (room: Room) => {
    if (window.confirm(`Are you sure you want to delete ${room.name}?`)) {
      deleteRoom(room.id);
      toast.success('Room deleted successfully');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      lastLogin: new Date(),
    };
    addUser(user);
    setShowAddUser(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'user',
      department: '',
    });
    toast.success('User added successfully');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
    setShowEditUser(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updatedUser: User = {
      ...selectedUser,
      name: editUser.name,
      email: editUser.email,
      role: editUser.role,
      department: editUser.department,
    };

    updateUser(updatedUser);
    setShowEditUser(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser(user.id);
      toast.success('User deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <div className="flex space-x-4">
          <Button
            variant={activeTab === 'users' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === 'rooms' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('rooms')}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Rooms
          </Button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleEditUser(user)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Room Management</h3>
            <Button onClick={() => setShowAddRoom(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={room.imageUrl}
                              alt={room.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {room.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {room.amenities.join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room.capacity} people
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Floor {room.floor}, {room.building}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteRoom(room)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Room</h3>
              <button
                onClick={() => setShowAddRoom(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <Input
                label="Room Name"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                required
              />
              <Input
                label="Capacity"
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                required
              />
              <Input
                label="Floor"
                type="number"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                required
              />
              <Input
                label="Building"
                value={newRoom.building}
                onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                required
              />
              <Input
                label="Image URL"
                value={newRoom.imageUrl}
                onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })}
                placeholder="Leave empty for default image"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amenities
                </label>
                <textarea
                  value={newRoom.amenities}
                  onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter amenities separated by commas"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddRoom(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditRoom && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Room</h3>
              <button
                onClick={() => {
                  setShowEditRoom(false);
                  setSelectedRoom(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateRoom} className="space-y-4">
              <Input
                label="Room Name"
                value={editRoom.name}
                onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })}
                required
              />
              <Input
                label="Capacity"
                type="number"
                value={editRoom.capacity}
                onChange={(e) => setEditRoom({ ...editRoom, capacity: e.target.value })}
                required
              />
              <Input
                label="Floor"
                type="number"
                value={editRoom.floor}
                onChange={(e) => setEditRoom({ ...editRoom, floor: e.target.value })}
                required
              />
              <Input
                label="Building"
                value={editRoom.building}
                onChange={(e) => setEditRoom({ ...editRoom, building: e.target.value })}
                required
              />
              <Input
                label="Image URL"
                value={editRoom.imageUrl}
                onChange={(e) => setEditRoom({ ...editRoom, imageUrl: e.target.value })}
                placeholder="Leave empty to keep current image"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amenities
                </label>
                <textarea
                  value={editRoom.amenities}
                  onChange={(e) => setEditRoom({ ...editRoom, amenities: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter amenities separated by commas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={editRoom.status}
                  onChange={(e) => setEditRoom({ ...editRoom, status: e.target.value as 'available' | 'maintenance' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEditRoom(false);
                    setSelectedRoom(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                label="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Input
                label="Department"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddUser(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditUser(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <Input
                label="Name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value as 'admin' | 'user' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Input
                label="Department"
                value={editUser.department}
                onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEditUser(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;