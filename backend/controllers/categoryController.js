import { FirestoreService } from '../config/firestoreService.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await FirestoreService.getAll('categories');
    return res.json(categories);
  } catch (error) {
    console.error('Error in getCategories:', error);
    return res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, colorTheme, iconName, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const calculatedSlug = slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat = await FirestoreService.create('categories', {
      name: name.trim(),
      slug: calculatedSlug,
      description: description ? description.trim() : '',
      image: image ? image.trim() : 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
      colorTheme: colorTheme || 'red',
      iconName: iconName || 'Home',
      status: status || 'Active'
    }, calculatedSlug);

    return res.status(201).json(newCat);
  } catch (error) {
    console.error('Error in createCategory:', error);
    return res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await FirestoreService.getById('categories', id);
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name.trim();
    if (req.body.slug !== undefined) updateData.slug = req.body.slug.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description.trim();
    if (req.body.image !== undefined) updateData.image = req.body.image.trim();
    if (req.body.colorTheme !== undefined) updateData.colorTheme = req.body.colorTheme;
    if (req.body.iconName !== undefined) updateData.iconName = req.body.iconName;
    if (req.body.status !== undefined) updateData.status = req.body.status;

    const updated = await FirestoreService.update('categories', id, updateData);
    return res.json(updated);
  } catch (error) {
    console.error('Error in updateCategory:', error);
    return res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FirestoreService.delete('categories', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json({ message: 'Category removed successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};
