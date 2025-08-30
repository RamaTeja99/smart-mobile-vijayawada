import { useState, useEffect } from "react";
import apiClient, {
  Product,
  Category,
  Brand,
  SearchFilters,
  SearchParams,
} from "../components/api/api";
import { useToast } from "../hooks/use-toast";

// Products hook
export const useProducts = (
  params: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
    brand_id?: string;
    category_id?: string;
    is_featured?: boolean;
    is_bestseller?: boolean;
    in_stock?: boolean;
  } = {}
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getProducts(params);

        if (response.status === "success" && response.data) {
          setProducts(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          setError(response.message || "Failed to load products");
        }
      } catch (err) {
        setError("Failed to load products");
        console.error("Products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error, pagination };
};
// Get all products (no filter, no search)
export const useAllProducts = (limit = 1000) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getAllProducts(limit);

        if (response.status === "success" && response.data) {
          setProducts(response.data);
        } else {
          setError(response.message || "Failed to load products");
        }
      } catch (err) {
        setError("Failed to load products");
        console.error("All products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [limit]);

  return { products, loading, error };
};

// Product search hook
export const useProductSearch = (searchParams: SearchParams) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (!searchParams.query && !searchParams.brand && !searchParams.category) {
      setResults([]);
      setMetadata(null);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.searchProducts(searchParams);

        if (response.status === "success" && response.data) {
          setResults(response.data);
          setMetadata(response.metadata);
        } else {
          setError(response.message || "Search failed");
        }
      } catch (err) {
        setError("Search failed");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [JSON.stringify(searchParams)]);

  return { results, loading, error, metadata };
};

// Single product hook
export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getProductById(id);

        if (response.status === "success" && response.data) {
          setProduct(response.data);
        } else {
          setError(response.message || "Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

// Categories hook
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getCategories();

        if (response.status === "success" && response.data) {
          setCategories(response.data);
        } else {
          setError(response.message || "Failed to load categories");
        }
      } catch (err) {
        setError("Failed to load categories");
        console.error("Categories fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Brands hook
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getBrands();

        if (response.status === "success" && response.data) {
          setBrands(response.data);
        } else {
          setError(response.message || "Failed to load brands");
        }
      } catch (err) {
        setError("Failed to load brands");
        console.error("Brands fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
};

// Featured products hook
export const useFeaturedProducts = (limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getFeaturedProducts(limit);

        if (response.status === "success" && response.data) {
          setProducts(response.data);
        } else {
          setError(response.message || "Failed to load featured products");
        }
      } catch (err) {
        setError("Failed to load featured products");
        console.error("Featured products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

// Search filters hook
export const useSearchFilters = () => {
  const [filters, setFilters] = useState<SearchFilters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getSearchFilters();

        if (response.status === "success" && response.data) {
          setFilters(response.data);
        } else {
          setError(response.message || "Failed to load filters");
        }
      } catch (err) {
        setError("Failed to load filters");
        console.error("Filters fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { filters, loading, error };
};
