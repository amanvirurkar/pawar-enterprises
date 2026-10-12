import { FirestoreService } from '../config/firestoreService.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await FirestoreService.getAll('brands');
    return res.json(brands);
  } catch (error) {
    console.error('Error in getBrands:', error);
    return res.status(500).json({ message: 'Failed to fetch brands', error: error.message });
  }
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = async (req, res) => {
  try {
    const { name, description, logo, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const docId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newBrand = await FirestoreService.create('brands', {
      name: name.trim(),
      description: description ? description.trim() : '',
      logo: logo ? logo.trim() : 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=200',
      status: status || 'Active'
    }, docId);

    return res.status(201).json(newBrand);
  } catch (error) {
    console.error('Error in createBrand:', error);
    return res.status(500).json({ message: 'Failed to create brand', error: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await FirestoreService.getById('brands', id);
    if (!existing) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description.trim();
    if (req.body.logo !== undefined) updateData.logo = req.body.logo.trim();
    if (req.body.status !== undefined) updateData.status = req.body.status;

    const updated = await FirestoreService.update('brands', id, updateData);
    return res.json(updated);
  } catch (error) {
    console.error('Error in updateBrand:', error);
    return res.status(500).json({ message: 'Failed to update brand', error: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FirestoreService.delete('brands', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    return res.json({ message: 'Brand removed successfully' });
  } catch (error) {
    console.error('Error in deleteBrand:', error);
    return res.status(500).json({ message: 'Failed to delete brand', error: error.message });
  }
};
