"use client"

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Activity, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface ErrorLog {
  id: number;
  type: string;
  message: string;
  time: string;
  views: string;
  severity: 'high' | 'medium' | 'low';
}

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  views: string;
}

// Sample Data
const serverLoadData = [
  { month: 'Jan', cpu: 65, memory: 45 },
  { month: 'Feb', cpu: 68, memory: 48 },
  { month: 'Mar', cpu: 72, memory: 52 },
  { month: 'Apr', cpu: 85, memory: 68 },
  { month: 'May', cpu: 78, memory: 62 },
  { month: 'Jun', cpu: 75, memory: 58 },
  { month: 'Jul', cpu: 82, memory: 65 }
];

const apiResponseData = [
  { day: 'yesterday', time: 450 },
  { day: 'weekday', time: 320 },
  { day: 'weekend', time: 380 },
  { day: 'Wednesday', time: 290 },
  { day: 'Myday/holiday', time: 520 }
];

const userEngagementData = [
  { month: 'Jan', pageViews: 28000, activeUsers: 18000 },
  { month: 'Feb', pageViews: 32000, activeUsers: 22000 },
  { month: 'Mar', pageViews: 35000, activeUsers: 24000 },
  { month: 'Apr', pageViews: 38000, activeUsers: 26000 },
  { month: 'May', pageViews: 42000, activeUsers: 28000 },
  { month: 'Jun', pageViews: 45000, activeUsers: 30000 },
  { month: 'Jul', pageViews: 48000, activeUsers: 32000 }
];

const errorLogs: ErrorLog[] = [
  {
    id: 1,
    type: 'API Request',
    message: 'UploadMediaFiles',
    time: '15 min ago',
    views: '8 occurrences',
    severity: 'high'
  },
  {
    id: 2,
    type: 'Database Connection',
    message: 'Port Enhanced',
    time: '28 min ago',
    views: '3 occurrences',
    severity: 'high'
  },
  {
    id: 3,
    type: '404 Not Found',
    message: 'sportsvideopage',
    time: '35 min ago',
    views: '12 occurrences',
    severity: 'medium'
  },
  {
    id: 4,
    type: 'Rate Limit Exceeded',
    message: 'User 12345',
    time: '2 hour ago',
    views: '6 occurrences',
    severity: 'medium'
  },
  {
    id: 5,
    type: 'Image Upload Failed',
    message: 'Size Limit',
    time: '3 hour ago',
    views: '4 occurrences',
    severity: 'low'
  }
];

const newsArticles: NewsArticle[] = [
  { id: 1, title: 'Liverpool Stuns Victory Against Arsenal', date: '25.12.2025', views: 'views' },
  { id: 2, title: 'Transfer News Mbappé to Real Madrid', date: '25.11.2025', views: 'views' },
  { id: 3, title: 'Champions League Draw Results', date: '22.10.2025', views: 'views' },
  { id: 4, title: 'Manchester City Training Update', date: '12.09.2025', views: 'views' },
  { id: 5, title: 'La Liga Young Talent Spotlight', date: '24.11.2025', views: 'views' }
];

export default function PerformanceMonitoring() {
  const metricCards: MetricCard[] = [
    {
      title: 'Server Load',
      value: '75%',
      change: '+5%',
      trend: 'up',
      icon: <Activity className="w-5 h-5 text-orange-600" />
    },
    {
      title: 'API Response Time',
      value: '320ms',
      change: '-15%',
      trend: 'down',
      icon: <Clock className="w-5 h-5 text-orange-600" />
    },
    {
      title: 'Live User Count',
      value: '12,847',
      change: '+12%',
      trend: 'up',
      icon: <Users className="w-5 h-5 text-orange-600" />
    },
    {
      title: 'Cache Hit Rate',
      value: '94.2%',
      change: '+2%',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Med</Badge>;
      case 'low':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-orange-500">Performance Monitoring</h1>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  {card.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {card.change}
                </div>
              </div>
              <h3 className="text-sm text-slate-600 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Server Load & Resource Usage Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Server Load & Resource Usage
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={serverLoadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
              />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="CPU %"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#64748b" 
                strokeWidth={2}
                name="Memory %"
                dot={{ fill: '#64748b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* API Response Time Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            API Response Time by Endpoint
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiResponseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="time" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fdba74" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Error Logs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-900">Error Logs</h2>
          </div>
          <div className="space-y-3">
            {errorLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-red-600 text-sm">{log.type}:</span>
                      <span className="text-slate-900 font-semibold">{log.message}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>{log.time}</span>
                      <span>•</span>
                      <span>{log.views}</span>
                    </div>
                  </div>
                </div>
                {getSeverityBadge(log.severity)}
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement Metrics Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            User Engagement Metrics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Page Sessions (user)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
                name="Daily Active Users"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Most Viewed News Articles */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Most Viewed News Articles
          </h2>
          <div className="space-y-2">
            {newsArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                    {article.id}
                  </div>
                  <span className="text-slate-900 font-medium">{article.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-orange-600 font-semibold">{article.date}</span>
                  <span className="text-sm text-slate-500">{article.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}