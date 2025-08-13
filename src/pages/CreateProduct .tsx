import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import apiClient, { Product } from "@/pages/api";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Explicit state typing so TypeScript knows our narrow types
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    original_price: string;
    stock_quantity: string;
    short_description: string;
    description: string;
    model: string;
    sku: string;
    brand_id: string;
    category_id: string;
    status: "active" | "inactive" | "out_of_stock";
    is_featured: boolean;
    is_bestseller: boolean;
    is_new: boolean;
    images: string[];
    specifications: string; // edited in textarea as JSON string
  }>({
    name: "",
    price: "",
    original_price: "",
    stock_quantity: "",
    short_description: "",
    description: "",
    model: "",
    sku: "",
    brand_id: "",
    category_id: "",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new: false,
    images: [],
    specifications: "{}",
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let parsedSpecs: Record<string, any> | undefined;
      if (formData.specifications.trim()) {
        try {
          parsedSpecs = JSON.parse(formData.specifications);
        } catch {
          toast.error("Invalid JSON in specifications field");
          setLoading(false);
          return;
        }
      }

      // ✅ Send brand_id and category_id per backend spec instead of full Brand/Category objects
      const productData: Partial<Product> & {
        brand_id?: string;
        category_id?: string;
      } = {
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : undefined,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        short_description: formData.short_description,
        description: formData.description,
        model: formData.model,
        sku: formData.sku,
        brand_id: formData.brand_id || undefined,
        category_id: formData.category_id || undefined,
        status: formData.status,
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        is_new: formData.is_new,
        images: formData.images,
        specifications: parsedSpecs,
      };

      const response = await apiClient.createProduct(productData);

      if (response.status === "success") {
        toast.success("Product created successfully!");
        navigate("/admin/dashboard");
      } else {
        toast.error(response.message || "Failed to create product");
      }
    } catch (error: any) {
      console.error("Create product error:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create New Product
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Back to Dashboard
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="Enter product SKU"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Original Price */}
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) =>
                    handleChange("original_price", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    handleChange("stock_quantity", e.target.value)
                  }
                  placeholder="0"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="Enter product model"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleChange(
                      "status",
                      value as "active" | "inactive" | "out_of_stock"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand ID */}
              <div className="space-y-2">
                <Label htmlFor="brand_id">Brand ID</Label>
                <Input
                  id="brand_id"
                  value={formData.brand_id}
                  onChange={(e) => handleChange("brand_id", e.target.value)}
                  placeholder="Enter brand UUID"
                />
              </div>

              {/* Category ID */}
              <div className="space-y-2">
                <Label htmlFor="category_id">Category ID</Label>
                <Input
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => handleChange("category_id", e.target.value)}
                  placeholder="Enter category UUID"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) =>
                  handleChange("short_description", e.target.value)
                }
                placeholder="Brief product description"
                rows={3}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                placeholder="Detailed product description"
                rows={5}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              {[
                ["is_featured", "Featured Product"],
                ["is_bestseller", "Bestseller"],
                ["is_new", "New Product"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      handleChange(key, checked as boolean)
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications (JSON)</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) =>
                  handleChange("specifications", e.target.value)
                }
                placeholder='{"display": "6.1 inches", "storage": "128GB"}'
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;
