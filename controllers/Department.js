// departmentController.js

const Department = require('../models/Department');

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = new Department({ name, description });
    await department.save();

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all categories
exports.getAllDepartments = async (req, res) => {
  try {
    const categories = await Department.find();

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllDepartmentName = async (req, res) => {
  try {
    const departments = await Department.find();
    
    // Extract only the 'name' field from each category
    const names = departments.map(department => department.name);

    res.status(200).json({ success: true, data: names });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a department by ID
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const department = await Department.findByIdAndUpdate(id, { name, description }, { new: true, runValidators: true });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
