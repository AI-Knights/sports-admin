// Interface for Monitoring API

export interface RealTimeStats {
    active_registered: number;
    active_guests: number;
    total_active: number;
}

export interface Engagement {
    dau_total: number;
    avg_session_duration_min: number;
}

export interface Totals {
    registered_users: number;
    guest_devices: number;
}

export interface Performance {
    avg_api_latency_ms: number;
    cpu_load_percent: number;
    ram_usage_percent: number;
    cache_hit_rate: number;
}

export interface EndpointStat {
    endpoint: string;
    avg_time: number;
    hits: number;
}

export interface ErrorLogSummary {
    path: string;
    message: string;
    count: number;
    level: string;
}

export interface AdminDashboardStats {
    real_time: RealTimeStats;
    engagement: Engagement;
    totals: Totals;
    performance_1h: Performance;
    endpoints: EndpointStat[];
    errors: ErrorLogSummary[];
}

export interface UserEngagement {
    date: string;
    daily_active_users: number;
    avg_session_min: number;
}

export interface MetricCard {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: any;
}
