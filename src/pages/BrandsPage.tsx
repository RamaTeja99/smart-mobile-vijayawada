import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  Search,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient, { Brand } from '@/pages/api';

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  
  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBrands(
        brands.filter(brand =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBrands(brands);
    }
  }, [brands, searchTerm]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBrands();
      
      if (response.status === 'success') {
        setBrands(response.data || []);
      } else {
        toast.error('Failed to fetch brands');
      }
    } catch (error) {
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website_url: '',
      is_active: true,
      sort_order: 0
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website_url: brand.website_url || '',
      is_active: brand.is_active,
      sort_order: brand.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      setSubmitting(true);
      let response;
      
      if (selectedBrand) {
        // Update existing brand
        response = await apiClient.updateBrand(selectedBrand.id, formData);
      } else {
        // Create new brand
        response = await apiClient.createBrand(formData);
      }

      if (response.status === 'success') {
        toast.success(selectedBrand ? 'Brand updated successfully' : 'Brand created successfully');
        setCreateDialogOpen(false);
        setEditDialogOpen(false);
        setSelectedBrand(null);
        resetForm();
        fetchBrands();
      } else {
        toast.error(response.message || `Failed to ${selectedBrand ? 'update' : 'create'} brand`);
      }
    } catch (error) {
      toast.error(`Failed to ${selectedBrand ? 'update' : 'create'} brand`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;

    try {
      setSubmitting(true);
      const response = await apiClient.deleteBrand(selectedBrand.id);

      if (response.status === 'success') {
        toast.success('Brand deleted successfully');
        setBrands(brands.filter(b => b.id !== selectedBrand.id));
        setDeleteDialogOpen(false);
        setSelectedBrand(null);
      } else {
        toast.error(response.message || 'Failed to delete brand');
      }
    } catch (error) {
      toast.error('Failed to delete brand');
    } finally {
      setSubmitting(false);
    }
  };

  const BrandForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Brand Name */}
      <div>
        <Label htmlFor="name">Brand Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter brand name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter brand description"
          rows={3}
        />
      </div>

      {/* Website URL */}
      <div>
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          id="website_url"
          type="url"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      {/* Sort Order */}
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          min="0"
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            setSelectedBrand(null);
            resetForm();
          }}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {selectedBrand ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            selectedBrand ? 'Update Brand' : 'Create Brand'
          )}
        </Button>
      </div>
    </form>
  );
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin/dashboard');
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
         <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
      <ChevronLeft className="w-4 h-4" />
      Back to Dashboard
     </Button>
        <div>
          <h1 className="text-3xl font-bold">Brands Management</h1>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Brands ({filteredBrands.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredBrands.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{brand.name}</p>
                        <p className="text-sm text-gray-500">ID: {brand.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm max-w-xs truncate">
                        {brand.description || 'No description'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {brand.website_url ? (
                        <a
                          href={brand.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Website
                        </a>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>{brand.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(brand)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(brand)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No brands found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Brand Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Brand</DialogTitle>
            <DialogDescription>
              Add a new brand to your catalog
            </DialogDescription>
          </DialogHeader>
          <BrandForm />
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Update brand information
            </DialogDescription>
          </DialogHeader>
          <BrandForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the brand 
              "{selectedBrand?.name}" and may affect associated products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Brand'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BrandsPage;