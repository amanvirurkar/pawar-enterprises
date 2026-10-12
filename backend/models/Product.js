import FirestoreService from '../config/firestoreService.js';

export const Product = {
  find: (query = []) => FirestoreService.getAll('products', query),
  findById: (id) => FirestoreService.getById('products', id),
  findOne: (field, value) => FirestoreService.findOne('products', field, value),
  create: (data, id) => FirestoreService.create('products', data, id),
  findByIdAndUpdate: (id, data) => FirestoreService.update('products', id, data),
  findByIdAndDelete: (id) => FirestoreService.delete('products', id)
};

export default Product;
