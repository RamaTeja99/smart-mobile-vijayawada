import { useState, useEffect } from "react";
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
import apiClient, { Product, Brand, Category } from "@/pages/api";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // New state for brands and categories
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
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
    specifications: { key: string; value: string }[];
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
    specifications: [
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
  ],
  });

  // Fetch brands & categories on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          apiClient.getBrands(),
          apiClient.getCategories(),
        ]);
        if (brandsRes.status === "success" && brandsRes.data) {
          setBrands(brandsRes.data);
        }
        if (categoriesRes.status === "success" && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (e) {
        toast.error("Failed to load brands or categories");
      }
    };
    fetchFilters();
  }, []);

  // Change handler
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
  const specs = [...formData.specifications];
  specs[index][field] = value;
  setFormData({ ...formData, specifications: specs });
};

const addSpecification = () => {
  setFormData({
    ...formData,
    specifications: [...formData.specifications, { key: "", value: "" }],
  });
};

const removeSpecification = (index: number) => {
  const specs = formData.specifications.filter((_, i) => i !== index);
  setFormData({ ...formData, specifications: specs });
};


  // Add image link
  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  // Change image link
  const changeImageLink = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  // Remove image link
  const removeImage = (index: number) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
     let specsObj: Record<string, string> = {};

     formData.specifications.forEach(({ key, value }) => {
        if (key.trim()) {
          specsObj[key.trim()] = value.trim();
        }
      });

      const productData: Partial<Product> & {
        brand_id?: string;
        category_id?: string;
      } = {
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : undefined,
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        short_description: formData.short_description,
        description: formData.description,
        model: formData.model,
        sku: formData.sku || undefined,
        brand_id: formData.brand_id || undefined,
        category_id: formData.category_id || undefined,
        status: formData.status,
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        is_new: formData.is_new,
        images: formData.images.filter((url) => url.trim() !== ""),
        specifications: specsObj,
      };

      if (!productData.name?.trim()) {
        toast.error("Product name is required");
        setLoading(false);
        return;
      }
      if (typeof productData.price !== "number" || isNaN(productData.price)) {
        toast.error("Valid price is required");
        setLoading(false);
        return;
      }

      const response = await apiClient.createProduct(productData);
      if (response.status === "success") {
        toast.success("Product created successfully!");
        navigate("/admin/dashboard");
      } else {
        toast.error(response.message || "Failed to create product");
      }
    } catch (error: any) {
      console.error("Create product error:", error);
      toast.error(error?.message || "Failed to create product");
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
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Price *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => handleChange("original_price", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    handleChange("stock_quantity", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Model</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    handleChange(
                      "status",
                      v as "active" | "inactive" | "out_of_stock"
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

              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(value) => handleChange("brand_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Short & Full Description */}
            <div>
              <Label>Short Description</Label>
              <Textarea
                value={formData.short_description}
                onChange={(e) =>
                  handleChange("short_description", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-4">
              {[
                ["is_featured", "Featured"],
                ["is_bestseller", "Bestseller"],
                ["is_new", "New Product"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      handleChange(key, checked as boolean)
                    }
                  />
                  <Label>{label}</Label>
                </div>
              ))}
            </div>

            {/* Images */}
            <div>
              <Label>Product Images (URLs)</Label>
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={url}
                    onChange={(e) => changeImageLink(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="mt-2"
                onClick={addImage}
                variant="outline"
              >
                Add Image
              </Button>
            </div>

            {/* Specifications */}
            <div>
  <Label>Specifications</Label>
  {formData.specifications.map((spec, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <Input
        placeholder="Key"
        value={spec.key}
        onChange={(e) => handleSpecChange(index, "key", e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Value"
        value={spec.value}
        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
        className="flex-1"
      />
      {formData.specifications.length > 3 && (
        <Button
          variant="destructive"
          type="button"
          onClick={() => removeSpecification(index)}
        >
          Remove
        </Button>
      )}
    </div>
  ))}
  <Button type="button" variant="outline" onClick={addSpecification}>
    Add Specification
  </Button>
</div>


            {/* Actions */}
            <div className="flex justify-end gap-4">
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
