export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
    public: {
    Tables: {
        lesson: {
        Row: {
            created_at: string | null
            description: string | null
            id: number
            title: string | null
        }
        Insert: {
            created_at?: string | null
            description?: string | null
            id?: number
            title?: string | null
        }
        Update: {
            created_at?: string | null
            description?: string | null
            id?: number
            title?: string | null
        }
        }
        premium_content: {
        Row: {
            created_at: string | null
            id: number
            video_url: string | null
        }
        Insert: {
            created_at?: string | null
            id?: number
            video_url?: string | null
        }
        Update: {
            created_at?: string | null
            id?: number
            video_url?: string | null
        }
        }
        profile: {
        Row: {
            created_at: string | null
            email: string | null
            id: string
            interval: string | null
            is_subscribed: boolean
            stripe_customer: string | null
        }
        Insert: {
            created_at?: string | null
            email?: string | null
            id: string
            interval?: string | null
            is_subscribed?: boolean
            stripe_customer?: string | null
        }
        Update: {
            created_at?: string | null
            email?: string | null
            id?: string
            interval?: string | null
            is_subscribed?: boolean
            stripe_customer?: string | null
        }
        }
    }
    Views: {
        [_ in never]: never
    }
    Functions: {
        [_ in never]: never
    }
    Enums: {
        [_ in never]: never
    }
    }
}
