const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/User')
const validator = require('validator');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
   
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getDoctors = async (req, res) => {
    try {
        const { country, state, city, postalCode, department, experienceyrs } = req.body;

        const searchCountry = country || 'India'; 

        // if (!country) {
        //     return res.status(400).json({ message: 'Country is required' });
        // }

        // Base query
        const baseQuery = {
            role: 'doctor',
            country: { $regex: new RegExp(searchCountry, 'i') },
            ...(department && { department: { $regex: new RegExp(department, 'i') } }),
            ...(experienceyrs && { experienceyrs: { $gte: experienceyrs } })
        };

        // Search results
        let results = [];

        // Step 1: Search by postal code
        if (postalCode) {
            const postalCodeQuery = { ...baseQuery, postalCode: postalCode };
            results = await User.find(postalCodeQuery);
        }

        // Step 2: If results from postal code are fewer than 5, add city results
        if (results.length < 5 && city) {
            const cityQuery = { ...baseQuery, city: { $regex: new RegExp(city, 'i') } };
            const cityResults = await User.find(cityQuery);

            // Filter out results already included from postal code search
            const postalCodeIds = results.map(user => user._id.toString());
            const additionalCityResults = cityResults.filter(user => !postalCodeIds.includes(user._id.toString()));

            // Combine results and limit to 5
            results = [...results, ...additionalCityResults].slice(0, 5);
        }

        // Step 3: If results are still fewer than 5, add state results
        if (results.length < 5 && state) {
            const stateQuery = { ...baseQuery, state: { $regex: new RegExp(state, 'i') } };
            const stateResults = await User.find(stateQuery);

            // Filter out results already included from postal code and city searches
            const existingIds = results.map(user => user._id.toString());
            const additionalStateResults = stateResults.filter(user => !existingIds.includes(user._id.toString()));

            // Combine results and limit to 5
            results = [...results, ...additionalStateResults].slice(0, 5);
        }

        // If results are still empty when country is provided
        if (results.length === 0) {
            const allCountryResults = await User.find(baseQuery);
            results = allCountryResults;
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No doctors found' });
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};





 
// exports.getDoctors = async (req, res) => {
//     try {
//         const { country, state, city, postalCode } = req.body;

//         if (!country) {
//             return res.status(400).json({ message: 'Country is required' });
//         }

//         // Create a base query with country
//         const baseQuery = {
//             role: 'doctor',
//             country: { $regex: new RegExp(country, 'i') },
//         };

//         let results = [];

//         // Step 1: Search by postal code
//         if (postalCode) {
//             const postalCodeQuery = { ...baseQuery, postalCode: postalCode };
//             results = await User.find(postalCodeQuery);
//         }

//         // Step 2: If results from postal code are fewer than 5, add city results
//         if (results.length < 5 && city) {
//             const cityQuery = { ...baseQuery, city: { $regex: new RegExp(city, 'i') } };
//             const cityResults = await User.find(cityQuery);

//             // Filter out results already included from postal code search
//             const postalCodeIds = results.map(user => user._id.toString());
//             const additionalCityResults = cityResults.filter(user => !postalCodeIds.includes(user._id.toString()));

//             // Combine results and limit to 5
//             results = [...results, ...additionalCityResults].slice(0, 5);
//         }

//         // Step 3: If results are still fewer than 5, add state results
//         if (results.length < 5 && state) {
//             const stateQuery = { ...baseQuery, state: { $regex: new RegExp(state, 'i') } };
//             const stateResults = await User.find(stateQuery);

//             // Filter out results already included from postal code and city searches
//             const existingIds = results.map(user => user._id.toString());
//             const additionalStateResults = stateResults.filter(user => !existingIds.includes(user._id.toString()));

//             // Combine results and limit to 5
//             results = [...results, ...additionalStateResults].slice(0, 5);
//         }

//         // If results are still empty when country is provided
//         if (results.length === 0) {
//             const allCountryResults = await User.find(baseQuery);
//             results = allCountryResults;
//         }

//         if (!results || results.length === 0) {
//             return res.status(404).json({ message: 'No doctors found' });
//         }

//         res.json(results);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };










 


// exports.createUser = async (req, res) => {
//     const user = new User(req.body);
//     try {
//         const newUser = await user.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

exports.updateUser = async (req, res) => {
    try {
        const { password, state, city, postalCode, location, mobile, department, title, experienceyrs, degrees, experiences, photo } = req.body;

        // Find the existing user
        const existingUser = await User.findById(req.params.id);

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare the update object
        const updatedFields = {};

        if (state) {
            updatedFields.state = validator.escape(state);
        }

        if (city) {
            updatedFields.city = validator.escape(city);
        }

        if (postalCode) {
            updatedFields.postalCode = validator.escape(postalCode);
        }

        if (location) {
            updatedFields.location = validator.escape(location);
        }

        if (mobile) {
            updatedFields.mobile = validator.escape(mobile);
        }
        if (department) {
            updatedFields.department = department;
        }
        if (title) {
            updatedFields.title = title;
        }
        if (photo) {
            updatedFields.photo = photo;
        }
        if (experienceyrs) {
            updatedFields.experienceyrs = validator.escape(experienceyrs);
        }
        if (degrees) {
            updatedFields.degrees = validator.escape(degrees);
        }
        if (experiences) {
            updatedFields.experiences = validator.escape(experiences);
        }

        if (password) {
            // Sanitize and hash the password
            const sanitizedPassword = validator.escape(password);
            const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
            updatedFields.password = hashedPassword;
        }

        // Ensure `updatedAt` is always set
        updatedFields.updatedAt = new Date();

        // Update the user with only the provided fields
        const updatedUserData = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        res.json(updatedUserData);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
