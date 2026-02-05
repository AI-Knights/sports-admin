import React, { useState, useEffect } from 'react';
import { Server, Zap, Users, Activity, LucideIcon } from 'lucide-react';

interface Metrics {
  server_load: number;
  response_time: number;
  live_users: number;
  cache_hit_rate: number;
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: string;
  progress?: number;
}

export default function Card({metrics}: {metrics?: Metrics}) {
 

  // Simulate real-time updates
 

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon, color, progress }) => (
    <div className=" rounded-xl  p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mb-3">
        <span className={`text-3xl font-bold ${color.replace('bg-', 'text-').replace('/10', '')}`}>
          {typeof value === 'number' ? value.toFixed(value < 10 ? 1 : 0) : value}
          <span className="text-lg ml-1">{unit}</span>
        </span>
      </div>
      
      {progress !== undefined && (
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${color.replace('/10', '')}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className=" bg-gradient-to-br w-full p-8">
      <div className="  mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Server Load"
            value={metrics?.server_load || 0}
            unit="%"
            icon={Server}
            color="bg-orange-500/10 text-orange-500"
            progress={metrics?.server_load}
          />
          
          <MetricCard
            title="API Response Time"
            value={metrics?.response_time || 0}
            unit="ms"
            icon={Zap}
            color="bg-yellow-500/10 text-yellow-500"
          />
          
          <MetricCard
            title="Live User Count"
            value={metrics?.live_users || 0}
            unit=""
            icon={Users}
            color="bg-amber-500/10 text-amber-500"
          />
          
          <MetricCard
            title="Cache Hit Rate"
            value={metrics?.cache_hit_rate || 0}
            unit="%"
            icon={Activity}
            color="bg-yellow-600/10 text-yellow-600"
          />
        </div>

     
      </div>
    </div>
  );
}