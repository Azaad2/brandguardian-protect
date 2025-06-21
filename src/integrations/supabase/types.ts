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
      brand_applications: {
        Row: {
          application_data: Json | null
          brand_id: string
          created_at: string
          email_thread_id: string | null
          id: string
          reseller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          application_data?: Json | null
          brand_id: string
          created_at?: string
          email_thread_id?: string | null
          id?: string
          reseller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          application_data?: Json | null
          brand_id?: string
          created_at?: string
          email_thread_id?: string | null
          id?: string
          reseller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_applications_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_reseller_allocations: {
        Row: {
          allocated_at: string
          allocated_by: string
          brand_id: string
          id: string
          reseller_id: string
        }
        Insert: {
          allocated_at?: string
          allocated_by: string
          brand_id: string
          id?: string
          reseller_id: string
        }
        Update: {
          allocated_at?: string
          allocated_by?: string
          brand_id?: string
          id?: string
          reseller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_reseller_allocations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      brands_directory: {
        Row: {
          approval_rate: number | null
          categories: string[] | null
          contact_email: string
          created_at: string
          department: string | null
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          response_time: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          approval_rate?: number | null
          categories?: string[] | null
          contact_email: string
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          response_time?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          approval_rate?: number | null
          categories?: string[] | null
          contact_email?: string
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          response_time?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          brand_application_id: string | null
          content: string
          created_at: string
          email_thread_id: string | null
          id: string
          is_read: boolean | null
          message_source: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          brand_application_id?: string | null
          content: string
          created_at?: string
          email_thread_id?: string | null
          id?: string
          is_read?: boolean | null
          message_source?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          brand_application_id?: string | null
          content?: string
          created_at?: string
          email_thread_id?: string | null
          id?: string
          is_read?: boolean | null
          message_source?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_brand_application_id_fkey"
            columns: ["brand_application_id"]
            isOneToOne: false
            referencedRelation: "brand_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          reseller_id: string
          shipping_address: Json | null
          status: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          reseller_id: string
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          reseller_id?: string
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_uploads: {
        Row: {
          admin_notes: string | null
          brand_id: string
          created_at: string
          file_url: string | null
          id: string
          name: string
          product_count: number | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          brand_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          name: string
          product_count?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          brand_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          name?: string
          product_count?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          approval_status: string | null
          asin: string | null
          brand_id: string | null
          categories: string[] | null
          created_at: string
          description: string | null
          id: string
          image_urls: string[] | null
          msrp: number | null
          name: string
          price: number
          sku: string
          stock: number
          updated_at: string
          upload_batch_id: string | null
          wholesale_price: number
        }
        Insert: {
          approval_status?: string | null
          asin?: string | null
          brand_id?: string | null
          categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          msrp?: number | null
          name: string
          price: number
          sku: string
          stock?: number
          updated_at?: string
          upload_batch_id?: string | null
          wholesale_price: number
        }
        Update: {
          approval_status?: string | null
          asin?: string | null
          brand_id?: string | null
          categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          msrp?: number | null
          name?: string
          price?: number
          sku?: string
          stock?: number
          updated_at?: string
          upload_batch_id?: string | null
          wholesale_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_upload_batch_id_fkey"
            columns: ["upload_batch_id"]
            isOneToOne: false
            referencedRelation: "product_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_role: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
          user_role?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_role?: string | null
        }
        Relationships: []
      }
      reseller_applications: {
        Row: {
          amazon_seller_id: string | null
          business_type: string
          company_name: string
          created_at: string
          ebay_seller_id: string | null
          ein_number: string
          email: string
          feedback_score: string | null
          id: string
          linkedin: string | null
          phone: string
          product_categories: string[]
          sales_volume: string
          status: string | null
          updated_at: string
          user_id: string | null
          walmart_seller_id: string | null
          wholesale_budget: string
        }
        Insert: {
          amazon_seller_id?: string | null
          business_type: string
          company_name: string
          created_at?: string
          ebay_seller_id?: string | null
          ein_number: string
          email: string
          feedback_score?: string | null
          id?: string
          linkedin?: string | null
          phone: string
          product_categories: string[]
          sales_volume: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
          walmart_seller_id?: string | null
          wholesale_budget: string
        }
        Update: {
          amazon_seller_id?: string | null
          business_type?: string
          company_name?: string
          created_at?: string
          ebay_seller_id?: string | null
          ein_number?: string
          email?: string
          feedback_score?: string | null
          id?: string
          linkedin?: string | null
          phone?: string
          product_categories?: string[]
          sales_volume?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
          walmart_seller_id?: string | null
          wholesale_budget?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_brand: {
        Args: { brand_data: Json }
        Returns: string
      }
      admin_allocate_brand_to_reseller: {
        Args: { p_brand_id: string; p_reseller_id: string }
        Returns: boolean
      }
      admin_delete_brand: {
        Args: { p_brand_id: string }
        Returns: boolean
      }
      admin_get_brands: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          website_url: string
          description: string
          contact_email: string
          logo_url: string
          categories: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      admin_remove_brand_allocation: {
        Args: { p_brand_id: string; p_reseller_id: string }
        Returns: boolean
      }
      admin_update_brand: {
        Args: { brand_id: string; brand_data: Json }
        Returns: string
      }
      check_user_upload_access: {
        Args: { bucket_id: string; owner: string }
        Returns: boolean
      }
      create_user_profile: {
        Args: {
          user_id: string
          user_email: string
          user_full_name: string
          user_company_name: string
          user_role: string
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      make_user_admin_by_email: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
