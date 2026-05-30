const User = require('./users.model');

const findAll = (filter, skip, limit) =>
  User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }).lean();

const count = (filter) => User.countDocuments(filter);

const findById = (id) => User.findById(id).select('-password').lean();

const findByEmail = (email) => User.findOne({ email: email.toLowerCase() });

const create = (data) => User.create(data);

const updateById = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password').lean();

const deleteById = (id) => User.findByIdAndDelete(id);

module.exports = { findAll, count, findById, findByEmail, create, updateById, deleteById };
