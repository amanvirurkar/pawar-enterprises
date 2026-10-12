import FirestoreService from '../config/firestoreService.js';

export const Category = {
  find: (query = []) => FirestoreService.getAll('categories', query),
  findById: (id) => FirestoreService.getById('categories', id),
  create: (data, id) => FirestoreService.create('categories', data, id),
  findByIdAndUpdate: (id, data) => FirestoreService.update('categories', id, data),
  findByIdAndDelete: (id) => FirestoreService.delete('categories', id)
};

export default Category;
