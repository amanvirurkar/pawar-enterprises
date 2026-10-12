import { FirestoreService } from '../config/firestoreService.js';

// @desc    Get store settings
// @route   GET /api/store
// @access  Public
export const getStore = async (req, res) => {
  try {
    const homepage = await FirestoreService.getById('settings', 'homepage');
    const about = await FirestoreService.getById('settings', 'about');
    const storeInfo = await FirestoreService.getById('settings', 'storeInfo');
    const seo = await FirestoreService.getById('settings', 'seo');

    return res.json({
      homepage: homepage || {},
      about: about || {},
      storeInfo: storeInfo || {},
      seo: seo || {}
    });
  } catch (error) {
    console.error('Error in getStore:', error);
    return res.status(500).json({ message: 'Failed to fetch store settings', error: error.message });
  }
};

// @desc    Update store settings
// @route   PUT /api/store
// @access  Private/Admin
export const updateStore = async (req, res) => {
  try {
    const { homepage, about, storeInfo, seo } = req.body;

    if (homepage) {
      await FirestoreService.create('settings', homepage, 'homepage');
    }
    if (about) {
      await FirestoreService.create('settings', about, 'about');
    }
    if (storeInfo) {
      await FirestoreService.create('settings', storeInfo, 'storeInfo');
    }
    if (seo) {
      await FirestoreService.create('settings', seo, 'seo');
    }

    const updated = await getStore(req, res);
    return updated;
  } catch (error) {
    console.error('Error in updateStore:', error);
    return res.status(500).json({ message: 'Failed to update store settings', error: error.message });
  }
};
