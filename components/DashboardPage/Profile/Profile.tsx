"use client"

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface AdminProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinedDate: string;
  role: string;
  avatar?: string; // ✅ add this
  stats: {
    newsPublished: string;
    notificationsSent: string;
    usersManaged: string;
    systemUptime: string;
  };
  recentActivity: Activity[];
}


interface Activity {
  id: number;
  description: string;
  time: string;
}

const initialProfile: AdminProfile = {
  fullName: 'John Anderson',
  email: 'john.anderson@footballadmin.com',
  phone: '+1 (555) 123-4567',
  location: 'London, United Kingdom',
  bio: 'Experienced football administrator with 10+ years in sports management. Passionate about bringing the best football content to fans worldwide.',
  joinedDate: 'January 15, 2024',
  role: 'Super Admin',
  stats: {
    newsPublished: '1,247',
    notificationsSent: '3,892',
    usersManaged: '156K',
    systemUptime: '99.8%'
  },
  recentActivity: [
    { id: 1, description: 'Published article: Liverpool vs Arsenal Match Recap', time: '2 hours ago' },
    { id: 2, description: 'Sent goal notification to 45,000 users', time: '5 hours ago' },
    { id: 3, description: 'Updated user permissions', time: '1 day ago' },
    { id: 4, description: 'Reviewed and approved 12 news articles', time: '2 days ago' },
    { id: 5, description: 'System maintenance completed', time: '3 days ago' }
  ]
};

export default function AdminProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [editedProfile, setEditedProfile] = useState<AdminProfile>(initialProfile);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedProfile(prev => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };


  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">Admin Profile</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
          {/* Profile Edit Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                  {editedProfile.avatar ? (
                    <img
                      src={editedProfile.avatar}
                      alt="avatar"
                      className="w-full rounded-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {getInitials(editedProfile.fullName)}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="opacity-0 absolute bottom-0 right-0 cursor-pointer"
                  />

                </button>
              </div>
              <div className="flex-1">
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white mb-2">
                  {profile.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={editedProfile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">News Published</p>
              <p className="text-xl font-bold text-orange-500">{profile.stats.newsPublished}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">Notifications Sent</p>
              <p className="text-xl font-bold text-orange-500">{profile.stats.notificationsSent}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">Users Managed</p>
              <p className="text-xl font-bold text-orange-500">{profile.stats.usersManaged}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">System Uptime</p>
              <p className="text-xl font-bold text-teal-500">{profile.stats.systemUptime}</p>
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-slate-900 mb-3">About Me</h3>
            <Textarea
              value={editedProfile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={5}
              className="bg-slate-50 border-slate-200 resize-none"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {profile.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-slate-900">{activity.description}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Admin Profile</h1>
          <Button
            onClick={handleEdit}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Profile Display Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div>
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold mb-2">
                {editedProfile.avatar ? (
                  <img
                    src={editedProfile.avatar}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {getInitials(editedProfile.fullName)}
                  </span>
                )}
              </div>
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                {profile.role}
              </Badge>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{profile.fullName}</h2>
              <p className="text-slate-600 mb-4">{profile.bio}</p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Joined {profile.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-2">News Published</p>
            <p className="text-2xl font-bold text-orange-500">{profile.stats.newsPublished}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-2">Notifications Sent</p>
            <p className="text-2xl font-bold text-orange-500">{profile.stats.notificationsSent}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-2">Users Managed</p>
            <p className="text-2xl font-bold text-orange-500">{profile.stats.usersManaged}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-sm text-slate-600 mb-2">System Uptime</p>
            <p className="text-2xl font-bold text-teal-500">{profile.stats.systemUptime}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {profile.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{activity.description}</p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}