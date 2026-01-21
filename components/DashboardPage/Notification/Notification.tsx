"use client"

import React, { useState } from 'react';
import { Bell, ChevronLeft, Send, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Types
interface Notification {
  id: number;
  title: string;
  message: string;
  category: string;
  audience: string;
  timestamp: string;
  status: 'Live' | 'Scheduled';
  icon: 'bell' | 'clock';
  bgColor: string;
}

interface NotificationForm {
  title: string;
  message: string;
  audience: string;
  eventType: string;
  date: string;
  time: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Match Starting Soon',
    message: 'Liverpool vs Arsenal kicks off in 15 minutes!',
    category: 'Match Start',
    audience: 'All Users',
    timestamp: '2025-12-07 14:30',
    status: 'Live',
    icon: 'bell',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 2,
    title: 'GOAL! Liverpool Scores',
    message: 'Mohamed Salah scores! Liverpool 1-0 Arsenal',
    category: 'Goal',
    audience: 'Premier League Followers',
    timestamp: '2025-12-07 15:12',
    status: 'Live',
    icon: 'bell',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 3,
    title: 'Transfer News Alert',
    message: 'Breaking: Mbappé to Real Madrid confirmed!',
    category: 'News Update',
    audience: 'All Users',
    timestamp: '2025-12-08 10:00',
    status: 'Scheduled',
    icon: 'clock',
    bgColor: 'bg-blue-50'
  },
  {
    id: 4,
    title: 'Full Time: Match Result',
    message: 'FT: Liverpool 3-1 Arsenal. What a match!',
    category: 'Full Time',
    audience: 'Premier League Followers',
    timestamp: '2025-12-07 16:45',
    status: 'Live',
    icon: 'bell',
    bgColor: 'bg-emerald-50'
  }
];

const audiences = ['All Users', 'Premier League Followers', 'La Liga Followers', 'Champion League Followers'];
const eventTypes = ['Match Start', 'Goal', 'Full Time', 'News Update', 'Transfer News'];

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    message: '',
    audience: '',
    eventType: '',
    date: '',
    time: ''
  });

  const handleCreateNotification = () => {
    setShowCreateForm(true);
  };

  const handleBack = () => {
    setShowCreateForm(false);
    setFormData({
      title: '',
      message: '',
      audience: '',
      eventType: '',
      date: '',
      time: ''
    });
  };

  const handleSendNow = () => {
    if (!formData.title || !formData.message || !formData.audience || !formData.eventType) {
      alert('Please fill all required fields');
      return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newNotification: Notification = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      category: formData.eventType,
      audience: formData.audience,
      timestamp: timestamp,
      status: 'Live',
      icon: 'bell',
      bgColor: 'bg-emerald-50'
    };

    setNotifications(prev => [newNotification, ...prev]);
    handleBack();
  };

  const handleSchedule = () => {
    if (!formData.title || !formData.message || !formData.audience || !formData.eventType || !formData.date || !formData.time) {
      alert('Please fill all fields including date and time');
      return;
    }

    const newNotification: Notification = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      category: formData.eventType,
      audience: formData.audience,
      timestamp: `${formData.date} ${formData.time}`,
      status: 'Scheduled',
      icon: 'clock',
      bgColor: 'bg-blue-50'
    };

    setNotifications(prev => [newNotification, ...prev]);
    handleBack();
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="px-6 py-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-orange-500">Edit Notification</h1>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            {/* Notification Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                Notification Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Match Starting Soon"
                className="bg-slate-50 border-slate-200"
              />
            </div>

            {/* Notification Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                Notification Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message..."
                rows={4}
                className="bg-slate-50 border-slate-200 resize-none"
              />
            </div>

            {/* Choose Audience */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Choose Audience
              </Label>
              <Select
                value={formData.audience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}
              >
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map(audience => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Event Type
              </Label>
              <Select
                value={formData.eventType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
              >
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Schedule Notification
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-600 mb-1.5 block">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-1.5 block">Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Preview</Label>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {formData.title || 'Match Starting Soon'}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {formData.message || 'Liverpool vs Arsenal kicks off in 15 minutes!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-slate-300"
                onClick={handleSchedule}
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={handleSendNow}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
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
          <h1 className="text-2xl font-bold text-orange-500">Notifications</h1>
          <Button 
            onClick={handleCreateNotification}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Bell className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${notification.bgColor} rounded-xl border ${
                notification.status === 'Live' ? 'border-emerald-200' : 'border-blue-200'
              } p-4 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full ${
                  notification.status === 'Live' ? 'bg-emerald-100' : 'bg-blue-100'
                } flex items-center justify-center flex-shrink-0`}>
                  {notification.icon === 'bell' ? (
                    <Bell className={`w-5 h-5 ${
                      notification.status === 'Live' ? 'text-emerald-600' : 'text-blue-600'
                    }`} />
                  ) : (
                    <Clock className={`w-5 h-5 ${
                      notification.status === 'Live' ? 'text-emerald-600' : 'text-blue-600'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-orange-600 mb-1 text-sm">
                    {notification.title}
                  </h3>
                  <p className="text-slate-900 font-medium mb-2">
                    {notification.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                      {notification.category}
                    </span>
                    <span>•</span>
                    <span>{notification.audience}</span>
                    <span>•</span>
                    <span>{notification.timestamp}</span>
                  </div>
                </div>

                {/* Status Badge and Action */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge
                    variant={notification.status === 'Live' ? 'default' : 'secondary'}
                    className={
                      notification.status === 'Live'
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }
                  >
                    {notification.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-500 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}