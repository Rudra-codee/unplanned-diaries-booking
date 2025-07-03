export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          bid_amount: number
          created_at: string | null
          id: string
          secret_trip_id: string | null
          updated_at: string | null
          user_email: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          bid_amount: number
          created_at?: string | null
          id?: string
          secret_trip_id?: string | null
          updated_at?: string | null
          user_email: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          bid_amount?: number
          created_at?: string | null
          id?: string
          secret_trip_id?: string | null
          updated_at?: string | null
          user_email?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_secret_trip_id_fkey"
            columns: ["secret_trip_id"]
            isOneToOne: false
            referencedRelation: "secret_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          number_of_guests: number
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          travel_date: string
          trip_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          number_of_guests?: number
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          travel_date: string
          trip_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          number_of_guests?: number
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          travel_date?: string
          trip_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          message: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          message: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string
        }
        Relationships: []
      }
      custom_trip_requests: {
        Row: {
          contact_email: string | null
          contact_number: string
          created_at: string
          end_date: string
          id: string
          location: string
          number_of_guests: number
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_number: string
          created_at?: string
          end_date: string
          id?: string
          location: string
          number_of_guests: number
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_number?: string
          created_at?: string
          end_date?: string
          id?: string
          location?: string
          number_of_guests?: number
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      group_trips: {
        Row: {
          available_from: string | null
          available_to: string | null
          category: string
          created_at: string
          description: string | null
          duration: number
          features: Json | null
          id: string
          image_url: string | null
          itinerary: Json | null
          location: string
          max_guests: number | null
          price: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          available_to?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          features?: Json | null
          id?: string
          image_url?: string | null
          itinerary?: Json | null
          location: string
          max_guests?: number | null
          price: number
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          available_to?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          features?: Json | null
          id?: string
          image_url?: string | null
          itinerary?: Json | null
          location?: string
          max_guests?: number | null
          price?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      queries: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          destination: string
          email: string
          guests: string
          id: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          destination: string
          email: string
          guests: string
          id?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          destination?: string
          email?: string
          guests?: string
          id?: string
        }
        Relationships: []
      }
      secret_trips: {
        Row: {
          available_seats: number
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          max_guests: number
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          available_seats?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_guests?: number
          start_date: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          available_seats?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_guests?: number
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      trip_itineraries: {
        Row: {
          activities: Json | null
          created_at: string
          day_number: number
          description: string | null
          id: string
          title: string
          trip_id: string | null
          updated_at: string
        }
        Insert: {
          activities?: Json | null
          created_at?: string
          day_number: number
          description?: string | null
          id?: string
          title: string
          trip_id?: string | null
          updated_at?: string
        }
        Update: {
          activities?: Json | null
          created_at?: string
          day_number?: number
          description?: string | null
          id?: string
          title?: string
          trip_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_itineraries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          available_from: string | null
          available_to: string | null
          created_at: string | null
          description: string | null
          duration: number
          id: string
          image_url: string | null
          itinerary: Json | null
          location: string
          max_guests: number | null
          price: number
          section: string
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["trip_type"] | null
          updated_at: string | null
        }
        Insert: {
          available_from?: string | null
          available_to?: string | null
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          image_url?: string | null
          itinerary?: Json | null
          location: string
          max_guests?: number | null
          price: number
          section?: string
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["trip_type"] | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string | null
          available_to?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          image_url?: string | null
          itinerary?: Json | null
          location?: string
          max_guests?: number | null
          price?: number
          section?: string
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["trip_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_booking_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_bookings: number
          pending_bookings: number
          confirmed_bookings: number
          total_revenue: number
          total_guests: number
        }[]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      trip_type:
        | "adventure"
        | "cultural"
        | "relaxation"
        | "business"
        | "family"
        | "solo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      trip_type: [
        "adventure",
        "cultural",
        "relaxation",
        "business",
        "family",
        "solo",
      ],
    },
  },
} as const
