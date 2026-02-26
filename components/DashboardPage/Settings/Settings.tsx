"use client"

import React, { useState } from 'react';
import { Bell, Shield, Mail, Lock, Key, Sun, Moon, Check, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/ZoodSchema/change-password-schema';
import { useChangePasswordMutation } from '@/store/api/auth/auth';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Switch Component
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${checked ? 'bg-orange-500' : 'bg-slate-300'
      }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
        }`}
    />
  </button>
);

// Types
interface SettingsData {
  general: {
    siteName: string;
    siteUrl: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newsAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    requireStrongPassword: boolean;
    apiEnabled: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    testEmail: string;
  };
  appearance: {
    theme: 'light' | 'dark';
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: 'Football Arena News',
      siteUrl: 'https://footballarena.com',
      timezone: 'UTC',
      language: 'English'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      newsAlerts: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: true,
      requireStrongPassword: false,
      apiEnabled: true
    },
    email: {
      smtpHost: 'smtp.example.com',
      smtpPort: '587',
      smtpUser: '',
      testEmail: ''
    },
    appearance: {
      theme: 'light'
    }
  });

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    mode: 'onChange',
  });

  const { formState: { isValid, isDirty } } = passwordForm;

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    setPasswordFeedback(null);
    try {
      await changePassword(data).unwrap();
      setPasswordFeedback({ type: 'success', message: 'Password changed successfully!' });
      passwordForm.reset();
    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        message: err?.data?.message || err?.data?.detail || 'Failed to change password.'
      });
    }
  };

  const [apiKeys, setApiKeys] = useState({
    liveData: 'sk83...xlsdf93ks',
    thirdParty: '9skkd...sdflk23'
  });

  const handleGeneralChange = (field: keyof SettingsData['general'], value: string) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [field]: value }
    }));
  };

  const handleNotificationToggle = (field: keyof SettingsData['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: !prev.notifications[field] }
    }));
  };

  const handleSecurityToggle = (field: keyof SettingsData['security']) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: !prev.security[field] }
    }));
  };

  const handleEmailChange = (field: keyof SettingsData['email'], value: string) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [field]: value }
    }));
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSettings(prev => ({
      ...prev,
      appearance: { theme }
    }));
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const isGeneralSettingsValid = settings.general.siteName.trim() !== '' && settings.general.siteUrl.trim() !== '';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <Button
            onClick={handleSaveSettings}
            disabled={!isGeneralSettingsValid}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="font-semibold text-slate-900">General Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteName" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="siteUrl" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Site URL
                </Label>
                <Input
                  id="siteUrl"
                  value={settings.general.siteUrl}
                  onChange={(e) => handleGeneralChange('siteUrl', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="timezone" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  value={settings.general.timezone}
                  onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="language" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Language
                </Label>
                <Input
                  id="language"
                  value={settings.general.language}
                  onChange={(e) => handleGeneralChange('language', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="font-semibold text-slate-900">Notification Settings</h2>
          </div>
          <div className="divide-y divide-slate-200">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">Email Notifications</h3>
                <p className="text-sm text-slate-600">Receive email alerts for important events</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">Push Notifications</h3>
                <p className="text-sm text-slate-600">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">SMS Notifications</h3>
                <p className="text-sm text-slate-600">Receive SMS message alerts</p>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={() => handleNotificationToggle('sms')}
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">News Alerts</h3>
                <p className="text-sm text-slate-600">Get notified for new match updates</p>
              </div>
              <Switch
                checked={settings.notifications.newsAlerts}
                onCheckedChange={() => handleNotificationToggle('newsAlerts')}
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">System Alerts</h3>
                <p className="text-sm text-slate-600">Critical system notifications</p>
              </div>
              <Switch
                checked={settings.notifications.systemAlerts}
                onCheckedChange={() => handleNotificationToggle('systemAlerts')}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="font-semibold text-slate-900">Security Settings</h2>
          </div>
          <div className="divide-y divide-slate-200">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-600">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.security.twoFactorAuth}
                onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
              />
            </div>

            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">Change Password</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Update your account password to a safer one
                    </p>

                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <AnimatePresence>
                          {passwordFeedback && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`p-3 rounded-md text-xs flex items-center gap-2 ${passwordFeedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                            >
                              {passwordFeedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                              {passwordFeedback.message}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <FormField
                          control={passwordForm.control}
                          name="old_password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPasswords.old ? "text" : "password"}
                                    placeholder="Current password"
                                    {...field}
                                    className="bg-white border-amber-200 pr-10"
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="new_password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPasswords.new ? "text" : "password"}
                                    placeholder="New password"
                                    {...field}
                                    className="bg-white border-amber-200 pr-10"
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    {...field}
                                    className="bg-white border-amber-200 pr-10"
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          disabled={!isValid || !isDirty || isChangingPassword}
                          className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto mt-2"
                        >
                          {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Update Password
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">API & Backup/Batch Settings</h3>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-1">Cache Enabled</h4>
                  <p className="text-sm text-slate-600">Improve performance with caching</p>
                </div>
                <Switch
                  checked={settings.security.apiEnabled}
                  onCheckedChange={() => handleSecurityToggle('apiEnabled')}
                />
              </div>
              <div className="space-y-3 mt-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    API Rate Limit (requests/min)
                  </Label>
                  <Input
                    defaultValue="1000"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    API Timeout (seconds)
                  </Label>
                  <Input
                    defaultValue="30"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="font-semibold text-slate-900">Email Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="smtpHost" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  SMTP Host
                </Label>
                <Input
                  id="smtpHost"
                  value={settings.email.smtpHost}
                  onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort" className="text-sm font-medium text-slate-700 mb-1.5 block">
                  SMTP Port
                </Label>
                <Input
                  id="smtpPort"
                  value={settings.email.smtpPort}
                  onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="smtpUser" className="text-sm font-medium text-slate-700 mb-1.5 block">
                SMTP User
              </Label>
              <Input
                id="smtpUser"
                value={settings.email.smtpUser}
                onChange={(e) => handleEmailChange('smtpUser', e.target.value)}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="testEmail" className="text-sm font-medium text-slate-700 mb-1.5 block">
                Test Email Configuration
              </Label>
              <div className="flex gap-2">
                <Input
                  id="testEmail"
                  placeholder="Enter email to test"
                  value={settings.email.testEmail}
                  onChange={(e) => handleEmailChange('testEmail', e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
                <Button variant="outline" className="border-slate-300">
                  Send Test
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        {/* <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="font-semibold text-slate-900">Appearance</h2>
          </div>
          <div className="p-6">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">Theme Mode</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`relative p-6 border-2 rounded-xl transition-all ${
                  settings.appearance.theme === 'light'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Sun className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900">Light Mode</h3>
                    <p className="text-sm text-slate-600">Easy on the eyes</p>
                  </div>
                </div>
                {settings.appearance.theme === 'light' && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`relative p-6 border-2 rounded-xl transition-all ${
                  settings.appearance.theme === 'dark'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-slate-100" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900">Dark Mode</h3>
                    <p className="text-sm text-slate-600">Easy on the battery</p>
                  </div>
                </div>
                {settings.appearance.theme === 'dark' && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}