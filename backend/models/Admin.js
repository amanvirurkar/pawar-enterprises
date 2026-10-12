import FirestoreService from '../config/firestoreService.js';

export const Admin = {
  find: (query = []) => FirestoreService.getAll('admins', query),
  findById: (id) => FirestoreService.getById('admins', id),
  findOne: (field, value) => FirestoreService.findOne('admins', field, value),
  create: (data, id) => FirestoreService.create('admins', data, id),
  findByIdAndUpdate: (id, data) => FirestoreService.update('admins', id, data),
  findByIdAndDelete: (id) => FirestoreService.delete('admins', id)
};

export default Admin;
