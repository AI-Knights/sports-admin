"use client"

import React from 'react';
import { TrendingUp, Users, Activity, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetDashboardStatsQuery, useGetEngagementHistoryQuery } from '@/store/api/monitoring/monitoring';
import Card from './Card';
import { MetricCard } from '@/lib/interface/interface.monitoring'; // Assuming Card expects summaryData directly or adapted

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  views: string;
}

const newsArticles: NewsArticle[] = [
  { id: 1, title: 'Liverpool Stuns Victory Against Arsenal', date: '25.12.2025', views: 'views' },
  { id: 2, title: 'Transfer News Mbappé to Real Madrid', date: '25.11.2025', views: 'views' },
  { id: 3, title: 'Champions League Draw Results', date: '22.10.2025', views: 'views' },
  { id: 4, title: 'Manchester City Training Update', date: '12.09.2025', views: 'views' },
  { id: 5, title: 'La Liga Young Talent Spotlight', date: '24.11.2025', views: 'views' }
];

export default function PerformanceMonitoring() {
  const { data: dashboardStats } = useGetDashboardStatsQuery();
  const { data: engagementHistory } = useGetEngagementHistoryQuery();

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
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

      <div className="p-6  mx-auto space-y-6">
        {/* Metric Cards - Adapted from dashboardStats.real_time and dashboardStats.totals */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Active</p>
                <h3 className="text-2xl font-bold text-slate-900">{dashboardStats.real_time.total_active}</h3>
              </div>
              <Users className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg API Latency</p>
                <h3 className="text-2xl font-bold text-slate-900">{dashboardStats.performance_1h.avg_api_latency_ms.toFixed(0)} ms</h3>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Cache Hit Rate</p>
                <h3 className="text-2xl font-bold text-slate-900">{dashboardStats.performance_1h.cache_hit_rate}%</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Guests</p>
                <h3 className="text-2xl font-bold text-slate-900">{dashboardStats.real_time.active_guests}</h3>
              </div>
              <Activity className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
          </div>
        )}

        {/* Server Load & Resource Usage Chart - Static or from another source if available in stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            System Performance (1h Avg)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500 mb-2">CPU Load</p>
              <div className="text-3xl font-bold text-blue-600">{dashboardStats?.performance_1h.cpu_load_percent}%</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500 mb-2">RAM Usage</p>
              <div className="text-3xl font-bold text-purple-600">{dashboardStats?.performance_1h.ram_usage_percent}%</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500 mb-2">Cache Hit Rate</p>
              <div className="text-3xl font-bold text-green-600">{dashboardStats?.performance_1h.cache_hit_rate}%</div>
            </div>
          </div>
        </div>

        {/* API Response Time Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            API Response Time by Endpoint (Top Endpoints)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardStats?.endpoints || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="endpoint"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey="avg_time"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
                name="Avg Time (ms)"
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
            <h2 className="text-lg font-semibold text-slate-900">Recent Error Logs</h2>
          </div>
          <div className="space-y-3">
            {dashboardStats?.errors?.map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#FFF8E7] rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-red-600 text-sm">{log.message}</span>
                      <span className="text-slate-900 font-semibold text-xs bg-slate-200 px-2 py-0.5 rounded">{log.path}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>{log.count} occurrences</span>
                    </div>
                  </div>
                </div>
                {getSeverityBadge(log.level)}
              </div>
            ))}
            {!dashboardStats?.errors?.length && (
              <div className="text-center py-6 text-slate-500">No recent errors reported.</div>
            )}
          </div>
        </div>

        {/* User Engagement Metrics Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            User Engagement Metrics (7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementHistory || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
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
                dataKey="daily_active_users"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Daily Active Users"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="avg_session_min"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="Avg Session (min)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Most Viewed News Articles - Keeping static for now as strictly requested monitoring updates */}
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