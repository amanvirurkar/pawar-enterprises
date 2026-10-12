import FirestoreService from '../config/firestoreService.js';

export const Enquiry = {
  find: (query = []) => FirestoreService.getAll('enquiries', query),
  findById: (id) => FirestoreService.getById('enquiries', id),
  create: (data, id) => FirestoreService.create('enquiries', data, id),
  findByIdAndUpdate: (id, data) => FirestoreService.update('enquiries', id, data),
  findByIdAndDelete: (id) => FirestoreService.delete('enquiries', id)
};

export default Enquiry;
