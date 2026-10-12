import { FirestoreService } from '../config/firestoreService.js';

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await FirestoreService.getAll('enquiries');
    return res.json(enquiries);
  } catch (error) {
    console.error('Error in getEnquiries:', error);
    return res.status(500).json({ message: 'Failed to fetch enquiries', error: error.message });
  }
};

// @desc    Create new enquiry (Contact form submission)
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, productId, productName } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const newEnquiry = await FirestoreService.create('enquiries', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      productId: productId || null,
      productName: productName || null,
      status: 'New'
    });

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: newEnquiry
    });
  } catch (error) {
    console.error('Error in createEnquiry:', error);
    return res.status(500).json({ message: 'Failed to submit enquiry', error: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const existing = await FirestoreService.getById('enquiries', id);
    if (!existing) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const updated = await FirestoreService.update('enquiries', id, { status });
    return res.json(updated);
  } catch (error) {
    console.error('Error in updateEnquiryStatus:', error);
    return res.status(500).json({ message: 'Failed to update enquiry status', error: error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FirestoreService.delete('enquiries', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    return res.json({ message: 'Enquiry removed successfully' });
  } catch (error) {
    console.error('Error in deleteEnquiry:', error);
    return res.status(500).json({ message: 'Failed to delete enquiry', error: error.message });
  }
};
