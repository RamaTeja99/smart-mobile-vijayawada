import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import apiClient, { Product, Brand, Category } from "@/components/api/api";

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  // Form dependencies
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

  useEffect(() => {
    if (id) {
      fetchProductAndFilters();
    }
  }, [id]);

  const fetchProductAndFilters = async () => {
    try {
      setLoading(true);

      const [productRes, brandsRes, categoriesRes] = await Promise.all([
        apiClient.getProductById(id!),
        apiClient.getBrands(),
        apiClient.getCategories(),
      ]);

      if (productRes.status === "success" && productRes.data) {
        const productData = productRes.data;
        let specsArray: { key: string; value: string }[] = [
          { key: "", value: "" },
          { key: "", value: "" },
          { key: "", value: "" },
        ];
        if (productData.specifications) {
          let specsObj: Record<string, any> = {};
          if (typeof productData.specifications === "string") {
            specsObj = JSON.parse(productData.specifications);
          } else {
            specsObj = productData.specifications;
          }

          specsArray = Object.entries(specsObj).map(([key, value]) => ({
            key,
            value: String(value),
          }));
        }
        setProduct(productData);

        // Populate form with existing product data
        setFormData({
          name: productData.name,
          price: productData.price.toString(),
          original_price: productData.original_price?.toString() || "",
          stock_quantity: productData.stock_quantity.toString(),
          short_description: productData.short_description || "",
          description: productData.description || "",
          model: productData.model || "",
          sku: productData.sku || "",
          brand_id: productData.brand?.id || "none",
          category_id: productData.category?.id || "none",
          status: productData.status,
          is_featured: productData.is_featured,
          is_bestseller: productData.is_bestseller,
          is_new: productData.is_new,
          images: productData.images || [],
          specifications: specsArray,
        });
      } else {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }

      if (brandsRes.status === "success" && brandsRes.data) {
        setBrands(brandsRes.data);
      }

      if (categoriesRes.status === "success" && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  // Change handler
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
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
    if (!id) return;

    setSubmitting(true);

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
        brand_id: formData.brand_id !== "none" ? formData.brand_id : undefined,
        category_id:
          formData.category_id !== "none" ? formData.category_id : undefined,
        status: formData.status,
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        is_new: formData.is_new,
        images: formData.images.filter((url) => url.trim() !== ""),
        specifications: specsObj,
      };

      if (!productData.name?.trim()) {
        toast.error("Product name is required");
        setSubmitting(false);
        return;
      }

      if (typeof productData.price !== "number" || isNaN(productData.price)) {
        toast.error("Valid price is required");
        setSubmitting(false);
        return;
      }

      const response = await apiClient.updateProduct(id, productData);

      if (response.status === "success") {
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        toast.error(response.message || "Failed to update product");
      }
    } catch (error: any) {
      console.error("Update product error:", error);
      toast.error(error?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-20 mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Name */}
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                />
              </div>

              {/* Model */}
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </div>

              {/* Original Price */}
              <div>
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) =>
                    handleChange("original_price", e.target.value)
                  }
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    handleChange("stock_quantity", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Brand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div>
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div>
                <Label>Brand</Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(value) => handleChange("brand_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Brand</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Product Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>

        {/* Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Short Description */}
            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) =>
                  handleChange("short_description", e.target.value)
                }
                rows={2}
              />
            </div>

            {/* Full Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images (URLs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => changeImageLink(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImage}>
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecChange(index, "key", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, "value", e.target.value)
                  }
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
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/products")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
