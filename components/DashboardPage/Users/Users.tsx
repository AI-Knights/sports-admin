"use client"

import React, { useState } from 'react';
import { ChevronLeft, Search, Eye, Heart, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  favorites: number;
  notificationsOn: boolean;
  joinedDate: string;
  favoriteTeams: string[];
  favoriteLeagues: string[];
  activityLogs: ActivityLog[];
}

interface ActivityLog {
  id: number;
  action: string;
  time: string;
  icon: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: 'john_doe',
    email: 'john.doe@example.com',
    avatar: '',
    initials: 'JD',
    favorites: 5,
    notificationsOn: true,
    joinedDate: '2024-03-15',
    favoriteTeams: ['Liverpool', 'Barcelona'],
    favoriteLeagues: ['Premier League', 'La Liga'],
    activityLogs: [
      { id: 1, action: 'Viewed Match: Liverpool vs Arsenal', time: '2 hours ago', icon: '👁️' },
      { id: 2, action: 'Read Article: Transfer News Update', time: '5 hours ago', icon: '📰' },
      { id: 3, action: 'Followed Team: Barcelona', time: '1 day ago', icon: '⭐' },
      { id: 4, action: 'Opened Notification: Goal Alert', time: '2 days ago', icon: '🔔' },
      { id: 5, action: 'Viewed League Standings', time: '3 days ago', icon: '📊' }
    ]
  },
  {
    id: 2,
    name: 'sarah_smith',
    email: 'sarah.smith@example.com',
    avatar: '',
    initials: 'SA',
    favorites: 8,
    notificationsOn: true,
    joinedDate: '2024-05-22',
    favoriteTeams: ['Manchester City', 'Real Madrid'],
    favoriteLeagues: ['Premier League', 'La Liga'],
    activityLogs: [
      { id: 1, action: 'Viewed Match: City vs Chelsea', time: '1 hour ago', icon: '👁️' },
      { id: 2, action: 'Added Team to Favorites', time: '3 hours ago', icon: '❤️' }
    ]
  },
  {
    id: 3,
    name: 'mike_jones',
    email: 'mike.jones@example.com',
    avatar: '',
    initials: 'MI',
    favorites: 3,
    notificationsOn: false,
    joinedDate: '2024-08-10',
    favoriteTeams: ['Arsenal'],
    favoriteLeagues: ['Premier League'],
    activityLogs: [
      { id: 1, action: 'Read Match Report', time: '4 hours ago', icon: '📰' }
    ]
  },
  {
    id: 4,
    name: 'emma_wilson',
    email: 'emma.wilson@example.com',
    avatar: '',
    initials: 'EM',
    favorites: 6,
    notificationsOn: true,
    joinedDate: '2024-02-03',
    favoriteTeams: ['Bayern Munich', 'PSG'],
    favoriteLeagues: ['Champions League'],
    activityLogs: [
      { id: 1, action: 'Viewed Champions League Table', time: '6 hours ago', icon: '🏆' }
    ]
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleRemoveUser = (user: User) => {
    setUserToRemove(user);
    setShowRemoveDialog(true);
  };

  const confirmRemoveUser = () => {
    if (userToRemove) {
      setUsers(users.filter(u => u.id !== userToRemove.id));
      if (selectedUser?.id === userToRemove.id) {
        setSelectedUser(null);
      }
      setShowRemoveDialog(false);
      setUserToRemove(null);
    }
  };

  const handleResetPreferences = () => {
    setShowResetDialog(true);
  };

  const confirmResetPreferences = () => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, favoriteTeams: [], favoriteLeagues: [], notificationsOn: false }
          : u
      ));
      setSelectedUser({
        ...selectedUser,
        favoriteTeams: [],
        favoriteLeagues: [],
        notificationsOn: false
      });
    }
    setShowResetDialog(false);
  };

  const toggleNotifications = (checked: boolean) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, notificationsOn: checked };
      setSelectedUser(updatedUser);
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
    }
  };

  // User Details View
  if (selectedUser) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="px-6 py-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-orange-500">User Details</h1>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {/* User Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
              {selectedUser.initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{selectedUser.name}</h2>
              <p className="text-slate-600">{selectedUser.email}</p>
              <p className="text-sm text-slate-500">Member since {selectedUser.joinedDate}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Total Favorites</p>
              <p className="text-2xl font-bold text-slate-900">{selectedUser.favorites}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Favorite Teams</p>
              <p className="text-2xl font-bold text-slate-900">{selectedUser.favoriteTeams.length}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Favorite Leagues</p>
              <p className="text-2xl font-bold text-slate-900">{selectedUser.favoriteLeagues.length}</p>
            </div>
          </div>

          {/* Favorite Teams */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Favorite Teams</h3>
            <div className="flex flex-wrap gap-2">
              {selectedUser.favoriteTeams.length > 0 ? (
                selectedUser.favoriteTeams.map((team, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {team}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500">No favorite teams</p>
              )}
            </div>
          </div>

          {/* Favorite Leagues */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Favorite Leagues</h3>
            <div className="flex flex-wrap gap-2">
              {selectedUser.favoriteLeagues.length > 0 ? (
                selectedUser.favoriteLeagues.map((league, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {league}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500">No favorite leagues</p>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="mb-6 bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Notification Preferences</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-600">Receive notifications for matches and news</p>
              </div>
              <Switch
                checked={selectedUser.notificationsOn}
                onCheckedChange={toggleNotifications}
              />
            </div>
          </div>

          {/* Activity Logs */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Activity Logs</h3>
            <div className="space-y-3">
              {selectedUser.activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <span className="text-xl">{log.icon}</span>
                  <div className="flex-1">
                    <p className="text-slate-900">{log.action}</p>
                    <p className="text-slate-500 text-xs">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full border-slate-300"
              onClick={handleResetPreferences}
            >
              Reset Preferences
            </Button>
            <Button
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => handleRemoveUser(selectedUser)}
            >
              Remove User
            </Button>
          </div>
        </div>

        {/* Reset Preferences Dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <AlertDialogTitle>Reset User Preferences</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-2">
                <p>Are you sure you want to reset all preferences for this user?</p>
                <p className="font-semibold text-slate-900">
                  Affecting: {selectedUser?.name}
                </p>
                <p className="text-sm">This will clear all user preferences to default values.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmResetPreferences}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Remove User Dialog */}
        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <AlertDialogTitle>Remove User</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-2">
                <p>Are you sure you want to permanently remove this user from the system?</p>
                <p className="font-semibold text-slate-900">
                  User: {selectedUser?.name}
                </p>
                <p className="text-sm text-red-600">This action cannot be undone.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemoveUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // User List View
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-orange-500">User Management</h1>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-slate-300"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.initials}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 mb-1">{user.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{user.email}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Heart className="w-4 h-4" />
                      {user.favorites} favorites
                    </span>
                    <span>•</span>
                    <Badge
                      variant={user.notificationsOn ? "default" : "secondary"}
                      className={
                        user.notificationsOn
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-slate-400 hover:bg-slate-500 text-white'
                      }
                    >
                      Notifications {user.notificationsOn ? 'On' : 'Off'}
                    </Badge>
                    <span>•</span>
                    <span className="text-slate-500">Joined {user.joinedDate}</span>
                  </div>
                </div>

                {/* View Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewUser(user)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}