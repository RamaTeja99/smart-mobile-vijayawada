import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
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
  AlertCircle,
  Settings,
  BarChart3,
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
interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at?: string;
}
const FeedbackViewModal = ({
  feedback,
  onClose,
}: {
  feedback: Feedback | null;
  onClose: () => void;
}) => {
  if (!feedback) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Feedback Details</h2>
        <p>
          <strong>Name:</strong> {feedback.name}
        </p>
        <p>
          <strong>Email:</strong> {feedback.email}
        </p>
        <p>
          <strong>Subject:</strong> {feedback.subject}
        </p>
        <p className="whitespace-pre-wrap mt-2">
          <strong>Message:</strong> {feedback.message}
        </p>
        <p className="mt-4 text-gray-500">
          <em>
            Submitted at: {new Date(feedback.created_at).toLocaleString()}
          </em>
        </p>

        <div className="mt-6 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [viewingFeedback, setViewingFeedback] = useState<Feedback | null>(null);

  const { products, loading: productsLoading } = useProducts({ limit: 10 });
  const renderActionsDropdown = (feedback: Feedback) => {
    const isOpen = dropdownOpenId === feedback.id;

    return (
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setDropdownOpenId(isOpen ? null : feedback.id)}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {isOpen && (
          <div
            className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-md z-100"
            style={{ minWidth: 128 }}
          >
            <button
              onClick={() => {
                setViewingFeedback(feedback);
                setDropdownOpenId(null);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              View
            </button>
            <button
              onClick={() => {
                setDropdownOpenId(null);
                if (
                  window.confirm(
                    "Are you sure you want to delete this feedback?"
                  )
                ) {
                  handleDelete(feedback.id);
                }
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await apiClient.getDashboardStats();

        if (response.status === "success" && response.data) {
          setStats(response.data);
        } else {
          setStatsError(response.message || "Failed to load statistics");
        }
      } catch (error) {
        setStatsError("Failed to load dashboard statistics");
        console.error("Dashboard stats error:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
    fetchFeedbacks();
  }, []);
  async function fetchFeedbacks() {
    setLoading(true);
    const res = await apiClient.getFeedbackList();
    if (res.status === "success") {
      setFeedbacks(res.data);
    }
    setLoading(false);
  }
  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;
    const res = await apiClient.deleteFeedback(id);
    if (res.status === "success") {
      setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
    }
  }
  const clearCache = async () => {
    try {
      await apiClient.clearCache();
      // Refresh stats after clearing cache
      const response = await apiClient.getDashboardStats();
      if (response.status === "success" && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    color = "blue",
    linkTo,
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    color?: string;
    linkTo?: string;
  }) => {
    const CardContents = (
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
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

    return linkTo ? <Link to={linkTo}>{CardContents}</Link> : CardContents;
  };

  const ProductRow = ({ product }: { product: Product }) => (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center gap-4">
        <img
          src={
            product.featured_image || product.images?.[0] || "/placeholder.svg"
          }
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
          <p className="font-medium">
            ₹{product.price_display.slice(1) || `$${product.price}`}
          </p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock_quantity}
          </p>
        </div>

        <Badge variant={product.in_stock ? "default" : "destructive"}>
          {product.status}
        </Badge>

        <div className="flex gap-1">
          <Link to={`/products/${product.id}`}>
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/admin/products/${product.id}/edit`}>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
  const convertToCSV = (data: any[]) => {
    if (!data.length) return "";
    const headers = ["Name", "Email", "Subject", "Message", "Date"];
    const rows = data.map((fb) => [
      fb.name,
      fb.email,
      fb.subject,
      fb.message.replace(/\n/g, " "), // remove newlines
      new Date(fb.created_at).toLocaleString(),
    ]);
    return [
      headers.join(","),
      ...rows.map((r) =>
        r
          .map((item) => `"${String(item).replace(/"/g, '""')}"`) // escape quotes
          .join(",")
      ),
    ].join("\n");
  };

  const downloadCSV = () => {
    if (!feedbacks.length) return;
    const csv = convertToCSV(feedbacks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedbacks_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
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
  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || "Admin"}!
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
        ) : (
          stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Products"
                value={stats.total_products}
                icon={Package}
                description="Active products in catalog"
                color="blue"
                linkTo="/admin/products"
              />
              <StatCard
                title="Categories"
                value={stats.total_categories}
                icon={ShoppingCart}
                description="Product categories"
                color="green"
                linkTo="/admin/categories"
              />
              <StatCard
                title="Brands"
                value={stats.total_brands}
                icon={Users}
                description="Available brands"
                color="purple"
                linkTo="/admin/brands"
              />
              <StatCard
                title="Cache Entries"
                value={stats.cache_stats.activeEntries}
                icon={Activity}
                description={`${stats.cache_stats.totalEntries} total entries`}
                color="orange"
              />
            </div>
          )
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/products/new">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Add New Product</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Create a new product in your catalog
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/products">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Manage Products</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View and edit your products
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/brands">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Manage Brands</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add and edit brands
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="feedback">FeedBack</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Products</CardTitle>
                  <Link to="/admin/products">
                    <Button size="sm" variant="outline">
                      View All
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
                  {stats?.popular_searches &&
                  stats.popular_searches.length > 0 ? (
                    <div className="space-y-3">
                      {stats.popular_searches
                        .slice(0, 5)
                        .map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {search.query}
                              </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Products Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Manage your product catalog, add new products, and update
                    existing ones.
                  </p>
                  <div className="space-y-2">
                    <Link to="/admin/products" className="block">
                      <Button className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        View All Products
                      </Button>
                    </Link>
                    <Link to="/admin/products/new" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Categories Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Organize your products with categories and manage category
                    information.
                  </p>
                  <div className="space-y-2">
                    <Link to="/admin/categories" className="block">
                      <Button className="w-full justify-start">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Manage Categories
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Brands Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Brands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Manage product brands, add new brands, and update brand
                    information.
                  </p>
                  <div className="space-y-2">
                    <Link to="/admin/brands" className="block">
                      <Button className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Brands
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics & Performance
                </CardTitle>
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
                          <span className="font-medium">
                            {stats.cache_stats.totalEntries}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Entries:</span>
                          <span className="font-medium">
                            {stats.cache_stats.activeEntries}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expired Entries:</span>
                          <span className="font-medium">
                            {stats.cache_stats.expiredEntries}
                          </span>
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
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
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
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Feedback Submissions</h2>
              {feedbacks.length > 0 && (
                <Button
                  onClick={downloadCSV}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Download CSV
                </Button>
              )}
            </div>

            <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
              {feedbacks.length ? (
                <table className="w-full table-auto min-w-max divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Subject
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 max-w-sm">
                        Message
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {feedbacks.map((fb) => (
                      <tr key={fb.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 whitespace-nowrap">
                          {fb.name}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {fb.email}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {fb.subject}
                        </td>
                        <td
                          className="py-2 px-4 max-w-sm truncate"
                          title={fb.message}
                        >
                          {fb.message}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {new Date(fb.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap flex justify-center">
                          {renderActionsDropdown(fb)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-center text-gray-500">
                  No feedback yet.
                </p>
              )}
            </div>
          </TabsContent>
          <FeedbackViewModal
            feedback={viewingFeedback}
            onClose={() => setViewingFeedback(null)}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
