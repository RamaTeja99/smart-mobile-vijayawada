import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Search, 
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useProducts } from "./hooks";
import apiClient, { Product } from "./api";
import { Link } from "react-router-dom";

interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_brands: number;
  cache_stats: {
    totalEntries: number;
    activeEntries: number;
    expiredEntries: number;
  };
  popular_searches: Array<{
    query: string;
    count: number;
  }>;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const { products, loading: productsLoading } = useProducts({ limit: 10 });

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await apiClient.getDashboardStats();

        if (response.status === 'success' && response.data) {
          setStats(response.data);
        } else {
          setStatsError(response.message || 'Failed to load statistics');
        }
      } catch (error) {
        setStatsError('Failed to load dashboard statistics');
        console.error('Dashboard stats error:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const clearCache = async () => {
    try {
      await apiClient.clearCache();
      // Refresh stats after clearing cache
      const response = await apiClient.getDashboardStats();
      if (response.status === 'success' && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    color = "blue" 
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 bg-${color}-100 rounded-lg`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductRow = ({ product }: { product: Product }) => (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center gap-4">
        <img
          src={product.featured_image || product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div>
          <h4 className="font-medium line-clamp-1">{product.name}</h4>
          <p className="text-sm text-gray-500">{product.brand?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{product.price_display}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
        </div>

        <Badge variant={product.in_stock ? "default" : "destructive"}>
          {product.status}
        </Badge>

        <div className="flex gap-1">
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Admin'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your mobile store today.
          </p>
        </div>

        {/* Statistics Cards */}
        {statsError ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{statsError}</span>
              </div>
            </CardContent>
          </Card>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={stats.total_products}
              icon={Package}
              description="Active products in catalog"
              color="blue"
            />
            <StatCard
              title="Categories"
              value={stats.total_categories}
              icon={ShoppingCart}
              description="Product categories"
              color="green"
            />
            <StatCard
              title="Brands"
              value={stats.total_brands}
              icon={Users}
              description="Available brands"
              color="purple"
            />
            <StatCard
              title="Cache Entries"
              value={stats.cache_stats.activeEntries}
              icon={Activity}
              description={`${stats.cache_stats.totalEntries} total entries`}
              color="orange"
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Products</CardTitle>
                  <Link to="/admin/products">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {productsLoading ? (
                    <div className="p-6 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </div>
                  ) : products.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {products.slice(0, 5).map((product) => (
                        <ProductRow key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No products found
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Popular Searches */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.popular_searches && stats.popular_searches.length > 0 ? (
                    <div className="space-y-3">
                      {stats.popular_searches.slice(0, 5).map((search, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{search.query}</span>
                          </div>
                          <Badge variant="secondary">{search.count}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">
                      No search data available
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <div className="flex gap-2">
                  <Link to="/admin/products/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Product Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create, edit, and manage your product catalog
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/admin/products">
                      <Button>View All Products</Button>
                    </Link>
                    <Link to="/admin/categories">
                      <Button variant="outline">Manage Categories</Button>
                    </Link>
                    <Link to="/admin/brands">
                      <Button variant="outline">Manage Brands</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Search Performance */}
                  <div>
                    <h4 className="font-semibold mb-4">Search Performance</h4>
                    {stats?.cache_stats && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Cache Entries:</span>
                          <span className="font-medium">{stats.cache_stats.totalEntries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Entries:</span>
                          <span className="font-medium">{stats.cache_stats.activeEntries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expired Entries:</span>
                          <span className="font-medium">{stats.cache_stats.expiredEntries}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="font-semibold mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={clearCache}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Clear Search Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Export Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Settings & Configuration
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage system settings and configurations
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/admin/profile">
                      <Button>My Profile</Button>
                    </Link>
                    <Button variant="outline">System Settings</Button>
                    <Button variant="outline">User Management</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
