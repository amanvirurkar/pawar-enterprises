import FirestoreService from '../config/firestoreService.js';

export const Brand = {
  find: (query = []) => FirestoreService.getAll('brands', query),
  findById: (id) => FirestoreService.getById('brands', id),
  create: (data, id) => FirestoreService.create('brands', data, id),
  findByIdAndUpdate: (id, data) => FirestoreService.update('brands', id, data),
  findByIdAndDelete: (id) => FirestoreService.delete('brands', id)
};

export default Brand;
