export interface Team {
    id: number;
    name: string;
    logo: string;
    code: string | null;
    country: string;
}

export interface League {
    id: number;
    name: string;
    type: string;
    logo: string;
    season_year: number;
    country: string;
}

export interface ProfileData {
    favorite_teams?: Team[];
    favorite_leagues?: League[];
    receive_live_notifications?: boolean;
    receive_news_updates?: boolean;
    can_manage_news?: boolean;
    can_manage_users?: boolean;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
    last_login: string | null;
    profile_data: ProfileData;
}

export type UserListResponse = User[];

export interface ActivityLog {
    id: number;
    action: "LOGIN" | "SIGNUP" | string;
    details: string;
    ip_address: string | null;
    timestamp: string;
}


