
import React, { useState } from 'react';
import { Users, Shield, Search, MoreVertical, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample users data
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      enrolledCourses: 3,
      joinDate: '2024-01-15',
      lastActive: '2024-03-20'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      enrolledCourses: 7,
      joinDate: '2024-02-10',
      lastActive: '2024-03-19'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@zintsomi.com',
      role: 'admin',
      enrolledCourses: 0,
      joinDate: '2023-12-01',
      lastActive: '2024-03-21'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-red-100 text-red-700"><Crown className="w-3 h-3 mr-1" />Admin</Badge>;
    }
    return <Badge variant="outline">User</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sky-700">
              <Users className="w-5 h-5" />
              <span>Total Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-800">1,248</div>
            <p className="text-sm text-sky-600">+89 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <Users className="w-5 h-5" />
              <span>Active Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">892</div>
            <p className="text-sm text-emerald-600">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Shield className="w-5 h-5" />
              <span>Admins</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">2</div>
            <p className="text-sm text-purple-600">System administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-sky-400 to-teal-500 text-white font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{user.enrolledCourses} courses enrolled</span>
                      <span>Joined {user.joinDate}</span>
                      <span>Last active {user.lastActive}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.role === 'user' && (
                    <Button variant="outline" size="sm">
                      <Crown className="w-4 h-4 mr-1" />
                      Make Admin
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
