"use client"

import React, { useState } from 'react';
import { ChevronLeft, Search, Eye, Heart, AlertCircle, Trash2, CheckCircle } from 'lucide-react';
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
import { User } from '@/lib/interface/interface.users';
import { useGetUsersQuery, useDeleteUserMutation, useResetUserPreferencesMutation, useGetUserDetailsQuery, useGetUserActivitiesQuery } from '@/store/api/users/users';
import { Loader2, LogIn, UserPlus, Info } from 'lucide-react';

export default function UserManagement() {
  const { data, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [resetPreferences] = useResetUserPreferencesMutation();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: userDetails, isLoading: isDetailsLoading } = useGetUserDetailsQuery(selectedUserId as string, { skip: !selectedUserId });
  const { data: activities, isLoading: isActivitiesLoading } = useGetUserActivitiesQuery(selectedUserId as string, { skip: !selectedUserId });

  const [searchQuery, setSearchQuery] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);

  const users = data || [];
  console.log(users)
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleViewUser = (user: User) => {
    setSelectedUserId(user.id);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
  };

  const handleRemoveUser = (user: User) => {
    setUserToRemove(user);
    setShowRemoveDialog(true);
  };

  const confirmRemoveUser = async () => {
    if (userToRemove) {
      try {
        await deleteUser(userToRemove.id).unwrap();
        if (selectedUserId === userToRemove.id) {
          setSelectedUserId(null);
        }
        setShowRemoveDialog(false);
        setUserToRemove(null);
        setShowDeleteSuccess(true);
      } catch (error) {
        console.error("Failed to delete user", error);
        // Ideally display a toast here
      }
    }
  };

  const handleResetPreferences = () => {
    setShowResetDialog(true);
  };

  const confirmResetPreferences = async () => {
    if (selectedUserId) {
      try {
        await resetPreferences(selectedUserId).unwrap();
        setShowResetDialog(false);
      } catch (error) {
        console.error("Failed to reset preferences", error);
      }
    }
  };

  const toggleNotifications = (checked: boolean) => {
    if (selectedUserId) {
      // Since toggle notifications endpoint isn't explicit in my plan, assuming reset prefs or future impl.
      // For now, I'll leaving this locally optimistic or implementing a dedicated mutation later if requested.
      // Assuming READ-ONLY for specialized notification toggles until API confirmed.
      console.warn("Toggle notifications API not implemented yet");
    }
  };

  // User Details View
  if (selectedUserId) {
    if (isDetailsLoading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-slate-500 animate-pulse">Fetching member details...</p>
          </div>
        </div>
      );
    }

    if (!userDetails) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load user details.</p>
            <Button onClick={handleBackToList}>Go Back</Button>
          </div>
        </div>
      );
    }

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
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold uppercase">
              {(userDetails.first_name?.[0] || '') + (userDetails.last_name?.[0] || '')}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{userDetails.first_name} {userDetails.last_name}</h2>
              <p className="text-slate-600">{userDetails.email}</p>
              <p className="text-sm text-slate-500">Member since {new Date(userDetails.date_joined).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Total Favorites</p>
              <p className="text-2xl font-bold text-slate-900">
                {(userDetails.profile_data?.favorite_teams?.length || 0) + (userDetails.profile_data?.favorite_leagues?.length || 0)}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Favorite Teams</p>
              <p className="text-2xl font-bold text-slate-900">{userDetails.profile_data?.favorite_teams?.length || 0}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Favorite Leagues</p>
              <p className="text-2xl font-bold text-slate-900">{userDetails.profile_data?.favorite_leagues?.length || 0}</p>
            </div>
          </div>

          {/* Favorite Teams */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Favorite Teams</h3>
            <div className="flex flex-wrap gap-2">
              {userDetails.profile_data?.favorite_teams && userDetails.profile_data.favorite_teams.length > 0 ? (
                userDetails.profile_data.favorite_teams.map((team, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {team.name}
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
              {userDetails.profile_data?.favorite_leagues && userDetails.profile_data.favorite_leagues.length > 0 ? (
                userDetails.profile_data.favorite_leagues.map((league, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {league.name}
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
                checked={userDetails.profile_data?.receive_live_notifications}
                disabled={true}
              />
            </div>
          </div>

          {/* Activity Logs */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Activity Logs</h3>

            {isActivitiesLoading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span className="text-sm text-slate-500">Loading activities...</span>
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className={`p-2 rounded-full shrink-0 ${log.action === 'LOGIN' ? 'bg-blue-100 text-blue-600' :
                      log.action === 'SIGNUP' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                      {log.action === 'LOGIN' ? <LogIn className="w-4 h-4" /> :
                        log.action === 'SIGNUP' ? <UserPlus className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-slate-900 text-sm truncate">{log.details}</p>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                          {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 font-bold border-slate-200 text-slate-500">
                          {log.action}
                        </Badge>
                        {log.ip_address && (
                          <span className="text-[10px] text-slate-400">IP: {log.ip_address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                <p className="text-sm text-slate-400 italic">No recent activity logs available</p>
              </div>
            )}
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
              onClick={() => handleRemoveUser(userDetails)}
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
              <AlertDialogDescription asChild>
                <div className="space-y-2">
                  <div className="text-sm">Are you sure you want to reset all preferences for this user?</div>
                  <div className="font-semibold text-slate-900">
                    Affecting: {userDetails?.first_name} {userDetails?.last_name}
                  </div>
                  <div className="text-sm">This will clear all user preferences to default values.</div>
                </div>
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
              <AlertDialogDescription asChild>
                <div className="space-y-2">
                  <div className="text-sm">Are you sure you want to permanently remove this user from the system?</div>
                  <div className="font-semibold text-slate-900">
                    User: {userDetails?.first_name} {userDetails?.last_name}
                  </div>
                  <div className="text-red-600 text-sm">This action cannot be undone.</div>
                </div>
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

        {/* Success Modal */}
        <AlertDialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
          <AlertDialogContent className="max-w-[400px]">
            <AlertDialogHeader>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <AlertDialogTitle className="text-2xl font-bold text-slate-900">Successfully Deleted!</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-600 mt-2">
                  The user has been permanently removed from the system.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center mt-6">
              <AlertDialogAction
                onClick={() => setShowDeleteSuccess(false)}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-32"
              >
                Done
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-slate-500">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const fullName = `${user.first_name || ''} ${user.last_name || ''}`;
              const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '');
              const totalFavorites = (user.profile_data.favorite_teams?.length || 0) + (user.profile_data.favorite_leagues?.length || 0);
              const notificationsOn = user.profile_data.receive_live_notifications;

              return (
                <div
                  key={user.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0 uppercase">
                      {initials}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1">{fullName}</h3>
                      <p className="text-sm text-slate-600 mb-2">{user.email}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Heart className="w-4 h-4" />
                          {totalFavorites} favorites
                        </span>
                        <span>•</span>
                        <Badge
                          variant={notificationsOn ? "default" : "secondary"}
                          className={
                            notificationsOn
                              ? 'bg-orange-500 hover:bg-orange-600'
                              : 'bg-slate-400 hover:bg-slate-500 text-white'
                          }
                        >
                          Notifications {notificationsOn ? 'On' : 'Off'}
                        </Badge>
                        <span>•</span>
                        <span className="text-slate-500">Joined {new Date(user.date_joined).toLocaleDateString()}</span>
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
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}