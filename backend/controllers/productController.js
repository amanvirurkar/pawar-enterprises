import { FirestoreService } from '../config/firestoreService.js';

// @desc    Fetch all products (with filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    let products = await FirestoreService.getAll('products');

    const { category, brand, search, featured, inStock } = req.query;

    if (category) {
      const catLower = category.toLowerCase();
      products = products.filter(p => 
        (p.category && p.category.toLowerCase() === catLower) ||
        (p.categorySlug && p.categorySlug.toLowerCase() === catLower)
      );
    }

    if (brand) {
      const brandLower = brand.toLowerCase();
      products = products.filter(p => p.brand && p.brand.toLowerCase() === brandLower);
    }

    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.brand && p.brand.toLowerCase().includes(s))
      );
    }

    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      products = products.filter(p => Boolean(p.isFeatured) === isFeatured);
    }

    if (inStock !== undefined) {
      const isInStock = inStock === 'true';
      products = products.filter(p => Boolean(p.inStock) === isInStock);
    }

    return res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let product = await FirestoreService.findOne('products', 'slug', slug);
    if (!product) {
      // Also check by ID if client requested by id
      product = await FirestoreService.getById('products', slug);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/id/:id
// @access  Private/Admin
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await FirestoreService.getById('products', id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      price, 
      originalPrice, 
      category, 
      brand, 
      images, 
      image, 
      features, 
      specifications, 
      inStock, 
      isFeatured 
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const calculatedSlug = slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productImages = images || (image ? [image] : []);

    const newProduct = await FirestoreService.create('products', {
      name: name.trim(),
      slug: calculatedSlug,
      description: description ? description.trim() : '',
      price: Number(price) || 0,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category: category ? category.trim() : '',
      brand: brand ? brand.trim() : '',
      images: productImages,
      image: productImages[0] || '',
      features: Array.isArray(features) ? features : [],
      specifications: typeof specifications === 'object' ? specifications : {},
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isFeatured: Boolean(isFeatured)
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await FirestoreService.getById('products', id);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData._id;

    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);

    const updated = await FirestoreService.update('products', id, updateData);
    return res.json(updated);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FirestoreService.delete('products', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
