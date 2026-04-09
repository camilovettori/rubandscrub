export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string;
          house_street: string;
          address: string;
          eircode: string;
          service_type: string;
          car_model: string;
          selected_extras: string[];
          preferred_date: string;
          preferred_time_slot: string;
          notes: string | null;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          created_at: string;
        };
        Insert: {
          full_name: string;
          phone: string;
          email: string;
          house_street: string;
          address: string;
          eircode: string;
          service_type: string;
          car_model: string;
          selected_extras: string[];
          preferred_date: string;
          preferred_time_slot: string;
          notes?: string | null;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
        };
        Update: {
          full_name?: string;
          phone?: string;
          email?: string;
          house_street?: string;
          address?: string;
          eircode?: string;
          service_type?: string;
          car_model?: string;
          selected_extras?: string[];
          preferred_date?: string;
          preferred_time_slot?: string;
          notes?: string | null;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
