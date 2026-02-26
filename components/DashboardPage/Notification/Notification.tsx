"use client"

import React, { useState } from 'react';
import { Bell, ChevronLeft, Send, Clock, ExternalLink, Loader2, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useGetNotificationLogsQuery, useGetScheduledNotificationsQuery, useCreateNotificationMutation, useUpdateNotificationMutation, useDeleteNotificationMutation } from '@/store/api/notification/notification';
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

interface NotificationForm {
  title: string;
  message: string;
  eventType: string;
  date: string;
  time: string;
}

const getEventStyles = (type: string) => {
  switch (type) {
    case 'GOAL':
      return { bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' };
    case 'MATCH_START':
      return { bgColor: 'bg-amber-50', borderColor: 'border-amber-200', iconColor: 'text-amber-600', iconBg: 'bg-amber-100' };
    case 'FULL_TIME':
      return { bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' };
    default:
      return { bgColor: 'bg-slate-50', borderColor: 'border-slate-200', iconColor: 'text-slate-600', iconBg: 'bg-slate-100' };
  }
};

export default function NotificationManagement() {
  const [activeTab, setActiveTab] = useState<'logs' | 'scheduled'>('logs');
  const [page, setPage] = useState(1);

  const { data: logsData, isLoading: isLoadingLogs, isError: isErrorLogs } = useGetNotificationLogsQuery({ page, pageSize: 10 }, { skip: activeTab !== 'logs' });
  const { data: scheduledData, isLoading: isLoadingScheduled, isError: isErrorScheduled } = useGetScheduledNotificationsQuery({ page, pageSize: 10 }, { skip: activeTab !== 'scheduled' });

  const currentData = activeTab === 'logs' ? logsData : scheduledData;
  const isLoading = activeTab === 'logs' ? isLoadingLogs : isLoadingScheduled;
  const isError = activeTab === 'logs' ? isErrorLogs : isErrorScheduled;

  const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation();
  const [updateNotification, { isLoading: isUpdating }] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    message: '',
    eventType: '',
    date: '',
    time: ''
  });

  const handleCreateNotification = () => {
    setShowCreateForm(true);
  };

  const handleBack = () => {
    setShowCreateForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      message: '',
      eventType: '',
      date: '',
      time: ''
    });
  };

  const handleSendNow = async () => {
    if (!formData.title || !formData.message || !formData.eventType) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const scheduledDate = formData.date && formData.time
        ? new Date(`${formData.date}T${formData.time}`).toISOString()
        : new Date().toISOString();

      if (editingId) {
        await updateNotification({
          id: editingId,
          data: {
            title: formData.title,
            body: formData.message,
            event_type: formData.eventType,
            scheduled_time: scheduledDate,
          }
        }).unwrap();
      } else {
        await createNotification({
          title: formData.title,
          body: formData.message,
          event_type: formData.eventType,
          scheduled_time: scheduledDate,
        }).unwrap();
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        handleBack();
      }, 2000);
    } catch (err) {
      alert(editingId ? 'Failed to update notification' : 'Failed to create notification');
    }
  };

  const handleEdit = (notification: any) => {
    // Assuming the API returns created_at or similar for date/time
    // But for simplicity, we populate what we have
    setEditingId(notification.id);
    setFormData({
      title: notification.title,
      message: notification.body,
      eventType: notification.event_type,
      date: notification.created_at ? new Date(notification.created_at).toISOString().split('T')[0] : '',
      time: notification.created_at ? new Date(notification.created_at).toISOString().split('T')[1].substring(0, 5) : ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id).unwrap();
      } catch (err) {
        alert('Failed to delete notification');
      }
    }
  };

  const handleSchedule = async () => {
    if (!formData.title || !formData.message || !formData.eventType || !formData.date || !formData.time) {
      alert('Please fill all fields including date and time');
      return;
    }

    try {
      const scheduledDate = new Date(`${formData.date}T${formData.time}`);
      await createNotification({
        title: formData.title,
        body: formData.message,
        event_type: formData.eventType,
        scheduled_time: scheduledDate.toISOString(),
      }).unwrap();

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        handleBack();
      }, 2000);
    } catch (err) {
      alert('Failed to schedule notification');
    }
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
            <h1 className="text-xl font-semibold text-orange-500">
              {editingId ? 'Edit Notification' : 'Create Notification'}
            </h1>
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
                onChange={(e) => setFormData((prev: NotificationForm) => ({ ...prev, title: e.target.value }))}
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
                onChange={(e) => setFormData((prev: NotificationForm) => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message..."
                rows={4}
                className="bg-slate-50 border-slate-200 resize-none"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-sm font-medium text-slate-700">
                Event Type
              </Label>
              <Input
                id="eventType"
                value={formData.eventType}
                onChange={(e) => setFormData((prev: NotificationForm) => ({ ...prev, eventType: e.target.value }))}
                placeholder="e.g. GOAL, MATCH_START"
                className="bg-slate-50 border-slate-200"
              />
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
                    onChange={(e) => setFormData((prev: NotificationForm) => ({ ...prev, date: e.target.value }))}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-1.5 block">Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData((prev: NotificationForm) => ({ ...prev, time: e.target.value }))}
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
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
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
                onClick={handleBack}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={handleSendNow}
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {editingId ? 'Update Notification' : 'Create Schedule'}
              </Button>
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bell className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Notification Updated!' : 'Notification Created!'}
                </h3>
                <p className="text-slate-500">
                  {editingId ? 'Your notification has been successfully updated.' : 'Your notification has been successfully scheduled.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Tabs and Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
            <button
              onClick={() => { setActiveTab('logs'); setPage(1); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'logs'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Notifications
            </button>
            <button
              onClick={() => { setActiveTab('scheduled'); setPage(1); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'scheduled'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Scheduled Notifications
            </button>
          </div>

          <Button
            onClick={handleCreateNotification}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Bell className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-slate-500 text-sm">Loading {activeTab === 'logs' ? 'notification logs' : 'scheduled notifications'}...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500">Failed to load notifications. Please try again.</p>
            </div>
          ) : currentData?.results?.map((notification: any) => {
            const styles = getEventStyles(notification.event_type);
            const isScheduled = 'scheduled_time' in notification;
            return (
              <div
                key={notification.id}
                className={`${styles.bgColor} rounded-xl border ${styles.borderColor} p-4 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center shrink-0`}>
                    <Bell className={`w-5 h-5 ${styles.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-orange-600 mb-1 text-sm uppercase tracking-wide">
                      {notification.title}
                    </h3>
                    <p className="text-slate-900 font-medium mb-2">
                      {notification.body}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                        {notification.event_type.replace(/_/g, ' ')}
                      </span>
                      <span>•</span>
                      {activeTab === 'logs' ? (
                        <>
                          <span>{notification.data?.reason || 'System'}</span>
                          <span>•</span>
                          <span>{notification.time_ago} ago</span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(notification.scheduled_time).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badge and Action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {activeTab === 'logs' ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none">
                        LIVE
                      </Badge>
                    ) : (
                      <Badge className={notification.is_sent ? "bg-slate-500 text-white border-none" : "bg-blue-500 text-white border-none"}>
                        {notification.is_sent ? 'SENT' : 'SCHEDULED'}
                      </Badge>
                    )}

                    {activeTab === 'scheduled' && !notification.is_sent && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(notification)}
                          className="h-7 w-7 text-slate-500 hover:text-slate-700"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notification.id)}
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {!isLoading && currentData && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * 10, currentData.count)}</span> of <span className="font-medium text-slate-900">{currentData.count}</span> items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 px-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center justify-center min-w-[32px] font-medium text-sm">
                {page}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p: number) => p + 1)}
                disabled={!currentData.next}
                className="h-9 px-3"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}