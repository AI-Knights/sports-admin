export interface NotificationLog {
    id: number;
    title: string;
    body: string;
    data: {
        type: string;
        reason?: string;
        match_id?: string;
        team_id?: string;
    };
    event_type: string;
    created_at: string;
    time_ago: string;
    is_read: boolean;
}

export interface NotificationLogsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: NotificationLog[];
}

export interface CreateNotificationRequest {
    title: string;
    body: string;
    event_type: string;
    scheduled_time: string;
}

export interface ScheduledNotification {
    id: number;
    title: string;
    body: string;
    event_type: string;
    scheduled_time: string;
    is_sent: boolean;
    created_at: string;
}

export interface ScheduledNotificationsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ScheduledNotification[];
}


