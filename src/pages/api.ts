const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metadata?: any;
  errors?: any[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  brand?: Brand;
  category?: Category;
  price: number;
  original_price?: number;
  discount_percentage: number;
  model?: string;
  sku?: string;
  stock_quantity: number;
  specifications?: Record<string, any>;
  images: string[];
  featured_image?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  average_rating: number;
  total_reviews: number;
  in_stock: boolean;
  stock_status: string;
  price_display: string;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface SearchFilters {
  categories: Category[];
  brands: Brand[];
  priceRanges: Array<{
    label: string;
    min: number;
    max: number | null;
  }>;
}

interface SearchParams {
  query?: string;
  brand?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort_by?: 'relevance' | 'price' | 'name' | 'rating' | 'date';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Authentication types
interface LoginData {
  email: string;
  password: string;
}

interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'super_admin';
  avatar_url?: string;
}

interface AuthResponse {
  admin: AdminUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

// Token management
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'mobile_store_access_token';
  private static REFRESH_TOKEN_KEY = 'mobile_store_refresh_token';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

// API client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  async clearCache(): Promise<ApiResponse<any>> {
  return this.request('/admin/cache/clear', { method: 'POST' });
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Add auth token if available
    const token = TokenManager.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token && !TokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token refresh if needed
      if (response.status === 401 && token) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          headers.Authorization = `Bearer ${TokenManager.getAccessToken()}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          const data = await retryResponse.json();
          return data;
        } else {
          // Refresh failed, clear tokens
          TokenManager.clearTokens();
          window.location.href = '/admin/login';
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Network error occurred');
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        TokenManager.setTokens(
          data.data.tokens.accessToken,
          data.data.tokens.refreshToken
        );
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Authentication methods
  async login(credentials: LoginData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    const result = await this.request<void>('/auth/logout', {
      method: 'POST',
    });
    TokenManager.clearTokens();
    return result;
  }
  // Add to api.ts

   async getFeedbackList(params: { page?: number; limit?: number } = { page: 1, limit: 50 }): Promise<ApiResponse<any[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return this.request<any[]>(`/admin/feedback?${queryString}`);
  }
  async submitFeedback(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ApiResponse<any>> {
  return this.request('/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

  async getProfile(): Promise<ApiResponse<AdminUser>> {
    return this.request<AdminUser>('/auth/profile');
  }

  // Product methods
  async getProducts(params: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
    brand_id?: string;
    category_id?: string;
    is_featured?: boolean;
    is_bestseller?: boolean;
    in_stock?: boolean;
  } = {}): Promise<ApiResponse<Product[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return this.request<Product[]>(`/products?${queryString}`);
  }
  // Product methods
  async getAllProducts(limit = 1000): Promise<ApiResponse<Product[]>> {
     return this.request<Product[]>(`/products/all?limit=${limit}`);
  }


  async searchProducts(params: SearchParams): Promise<ApiResponse<Product[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return this.request<Product[]>(`/products/search?${queryString}`);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async getFeaturedProducts(limit = 10): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/featured?limit=${limit}`);
  }

  async getBestsellerProducts(limit = 10): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/bestsellers?limit=${limit}`);
  }

  async getNewProducts(limit = 10): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/new?limit=${limit}`);
  }

  async getProductsByCategory(categoryId: string, params: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  } = {}): Promise<ApiResponse<Product[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return this.request<Product[]>(`/products/category/${categoryId}?${queryString}`);
  }

  async getProductsByBrand(brandId: string, params: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  } = {}): Promise<ApiResponse<Product[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return this.request<Product[]>(`/products/brand/${brandId}?${queryString}`);
  }

  async getSearchSuggestions(query: string, limit = 10): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(`/products/search/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getPopularSearches(limit = 10): Promise<ApiResponse<Array<{ query: string; count: number }>>> {
    return this.request<Array<{ query: string; count: number }>>(`/products/search/popular?limit=${limit}`);
  }

  async getSearchFilters(): Promise<ApiResponse<SearchFilters>> {
    return this.request<SearchFilters>('/products/search/filters');
  }

  // Category methods
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
  return this.request('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
  return this.request(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
}

  async deleteCategory(id: string): Promise<ApiResponse<any>> {
  return this.request(`/categories/${id}`, {
    method: 'DELETE',
  });
}

  // Brand methods
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return this.request<Brand[]>('/brands');
  }

  async getBrandById(id: string): Promise<ApiResponse<Brand>> {
    return this.request<Brand>(`/brands/${id}`);
  }

  async createBrand(brandData: Partial<Brand>): Promise<ApiResponse<Brand>> {
  return this.request('/brands', {
    method: 'POST',
    body: JSON.stringify(brandData),
  });
}

  async updateBrand(id: string, brandData: Partial<Brand>): Promise<ApiResponse<Brand>> {
  return this.request(`/brands/${id}`, {
    method: 'PUT',
    body: JSON.stringify(brandData),
  });
}

  async deleteBrand(id: string): Promise<ApiResponse<any>> {
  return this.request(`/brands/${id}`, {
    method: 'DELETE',
  });
}

  // Admin methods (require authentication)
  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProductStock(id: string, stock_quantity: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock_quantity }),
    });
  }

  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/dashboard');
  }
}

// Create and export API client instance
const apiClient = new ApiClient();

export default apiClient;
export type {
  Product,
  Category,
  Brand,
  SearchFilters,
  SearchParams,
  LoginData,
  AdminUser,
  AuthResponse,
  ApiResponse,
};
export { TokenManager };
