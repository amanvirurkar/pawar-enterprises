import FirestoreService from '../config/firestoreService.js';

export const Store = {
  find: (query = []) => FirestoreService.getAll('settings', query),
  findById: (id) => FirestoreService.getById('settings', id),
  create: (data, id) => FirestoreService.create('settings', data, id),
  findByIdAndUpdate: (id, data) => FirestoreService.update('settings', id, data),
  findByIdAndDelete: (id) => FirestoreService.delete('settings', id)
};

export default Store;
