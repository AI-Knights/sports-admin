"use client"

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, X, Upload, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Types
interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  league: string;
  date: string;
  image: string;
  published: boolean;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  league: string;
  published: boolean;
  imageFile: File | null;
  imagePreview: string | null;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
  league?: string;
}

// Validation function
const validateArticle = (data: FormData): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  if (!data.category) {
    errors.category = 'Category is required';
  }
  if (!data.league) {
    errors.league = 'League is required';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

const categories = ['All Categories', 'Premier League', 'La Liga', 'Champion League', 'Transfer News'];
const leagues = ['Premier League', 'La Liga', 'Champion League', 'Transfer News'];

const initialArticles: Article[] = [
  {
    id: 1,
    title: 'Liverpool Recent Victory Against Arsenal',
    description: 'An exciting match at Anfield ends with a 3-1 victory for the Reds side.',
    category: 'Premier League',
    league: 'Premier League',
    date: '2025-12-27',
    image: '🏟️',
    published: true
  },
  {
    id: 2,
    title: 'Transfer News: Mbappe Linked with Real Madrid',
    description: 'Latest Updates on the French Striker\'s possible move to La Liga.',
    category: 'Transfer News',
    league: 'Transfer News',
    date: '2025-12-26',
    image: '⚽',
    published: true
  },
  {
    id: 3,
    title: 'Manchester City Prepares for Champions League',
    description: 'Pep\'s team is ramping up after efforts of crucial European fixtures.',
    category: 'Champion League',
    league: 'Champion League',
    date: '2025-12-25',
    image: '🏆',
    published: false
  },
  {
    id: 4,
    title: 'Young Talent Shines in La Liga Debut',
    description: 'An incredible dance to recent signing impresses in his league appearance.',
    category: 'La Liga',
    league: 'La Liga',
    date: '2025-12-24',
    image: '⭐',
    published: true
  }
];

export default function NewsManagement() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    league: '',
    published: false,
    imageFile: null,
    imagePreview: null
  });
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  // Filter and search logic
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingArticle(null);
    setFormData({ 
      title: '', 
      description: '', 
      category: '', 
      league: '', 
      published: false, 
      imageFile: null, 
      imagePreview: null 
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      description: article.description,
      category: article.category,
      league: article.league,
      published: article.published,
      imageFile: null,
      imagePreview: article.image
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingArticle(null);
    setFormData({ 
      title: '', 
      description: '', 
      category: '', 
      league: '', 
      published: false, 
      imageFile: null, 
      imagePreview: null 
    });
    setFormErrors({});
    setIsDragging(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof ValidationErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: null
    }));
  };

  const handleSubmit = () => {
    const validation = validateArticle(formData);

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingArticle) {
      setArticles(prev => prev.map(article =>
        article.id === editingArticle.id
          ? { 
              ...article, 
              title: formData.title,
              description: formData.description,
              category: formData.category,
              league: formData.league,
              published: formData.published,
              image: formData.imagePreview || article.image 
            }
          : article
      ));
    } else {
      const newArticle: Article = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        league: formData.league,
        published: formData.published,
        image: formData.imagePreview || '📰',
        date: new Date().toISOString().split('T')[0],
      };
      setArticles(prev => [newArticle, ...prev]);
    }

    handleCloseModal();
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      setArticles(prev => prev.filter(article => article.id !== articleToDelete.id));
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
          <Button onClick={handleOpenAddModal} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New Article
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-slate-300"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px] h-10 border-slate-300">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500">No articles found</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                    {article.image.startsWith('data:') ? (
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      article.image
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-medium">{article.league}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <Badge 
                      variant={article.published ? "default" : "secondary"}
                      className={article.published 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenEditModal(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(article)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog  open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingArticle ? 'Edit Article' : 'Add New Article'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* News Title */}
            <div className="space-y-2">
              <Label htmlFor="title">News Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Liverpool Recent Victory Against Arsenal"
                className={formErrors.title ? 'border-red-500' : ''}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter news description..."
                rows={4}
                className={formErrors.description ? 'border-red-500' : ''}
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }));
                  if (formErrors.category) {
                    setFormErrors(prev => ({ ...prev, category: undefined }));
                  }
                }}
              >
                <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map(league => (
                    <SelectItem key={league} value={league}>
                      {league}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-sm text-red-500">{formErrors.category}</p>
              )}
            </div>

            {/* Upload Image - DRAG AND DROP */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload Image</Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
                  ${isDragging 
                    ? 'border-orange-500 bg-orange-50 scale-[1.02]' 
                    : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                  }
                  ${formData.imagePreview ? 'p-4' : 'p-12'}
                `}
              >
                {formData.imagePreview ? (
                  <div className="relative">
                    <div className="relative inline-block w-full">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 rounded-lg object-cover border-2 border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="opacity-0 hover:opacity-100 transition-opacity h-10 w-10 rounded-full shadow-lg"
                          onClick={removeImage}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-3">
                      Click the X button to remove, or drag a new image to replace
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                        <Upload className="w-8 h-8 text-orange-600" />
                      </div>
                      {isDragging ? (
                        <p className="text-lg font-semibold text-orange-600 mb-2">
                          Drop image here
                        </p>
                      ) : (
                        <>
                          <p className="text-base font-semibold text-slate-700 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-slate-500">
                            PNG, JPG or GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="cursor-pointer border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* League */}
            <div className="space-y-2">
              <Label htmlFor="league">League</Label>
              <Select
                value={formData.league}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, league: value }));
                  if (formErrors.league) {
                    setFormErrors(prev => ({ ...prev, league: undefined }));
                  }
                }}
              >
                <SelectTrigger className={formErrors.league ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select league" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map(league => (
                    <SelectItem key={league} value={league}>
                      {league}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.league && (
                <p className="text-sm text-red-500">{formErrors.league}</p>
              )}
            </div>

            {/* Publish Status */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="space-y-0.5">
                <Label htmlFor="published" className="text-base font-semibold">
                  Publish Status
                </Label>
                <p className="text-sm text-slate-600">
                  Make this article visible to users
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, published: checked }))
                }
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCloseModal}
            >
              Save Draft
            </Button>
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleSubmit}
            >
              Publish News
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Article</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to delete this article?</p>
              <p className="font-semibold text-slate-900">
                Deleting: {articleToDelete?.title}
              </p>
              <p className="text-red-600 text-sm">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}