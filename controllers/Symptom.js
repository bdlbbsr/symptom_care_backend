const Symptom = require('../models/Symptom')

exports.createSymptom = async (req, res) => {
  const { name, department, description, thumbnail } = req.body;
  const newSymptom = new Symptom({
    name,
    department,
    description,
    thumbnail,
  });

  try {
    const savedSymptom = await newSymptom.save();
    res.status(201).json({ success: true, message: "Your data added successfully!", data: savedSymptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.status(200).json({ success: true, data: symptoms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUserSymptoms = async (req, res) => {
  try {
    // Find symptoms where description is not available (null, undefined, or empty string)
    const symptoms = await Symptom.find({
      $or: [
        { description: { $exists: false } },  // Description does not exist
        { description: null },                // Description is null
        { description: '' }                   // Description is an empty string
      ]
    });

    res.status(200).json({ success: true, data: symptoms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSymptomDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the symptom by ID and update it
    const updatedSymptom = await Symptom.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      //runValidators: true, // Run schema validation on the updated data
    });

    if (!updatedSymptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }

    res.status(200).json({ success: true,  message: 'Updated Successfully!', data: updatedSymptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);

    if (!symptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }
    res.status(200).json({ success: true, data: symptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSymptomByName = async (req, res) => {
  const { query } = req.body;
  
  try {
    //const symptomName = query.replace(/-/g, ' ');
    
    const symptom = await Symptom.findOne({ name: query });

    if (!symptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }

    res.status(200).json({ success: true, data: symptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSymptomsByCategoryName = async (req, res) => {
  let condition = {}
  const categoryName = req.params.catName.replace(/_/g, ' ');
  // const query = req.query;
  //const symptoms = await Symptom.find({ category: categoryName });
  const { price, brands, isAvailable, sort } = req.query
  let query = Symptom.find(condition);

  query = Symptom.find({ category: { $in: [categoryName] } });


  if (brands) {
    const brandsArray = brands.split(',');
    query = query.find({ brand: { $in: brandsArray } });
  } else {

  }





  if (sort == '1') {
    query = query.sort({ price: 1 });
  } else if (sort == '2') {
    query = query.sort({ price: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }



  const availavleLogic = { stock: isAvailable == 'available' ? { $gt: 0 } : { $gte: 0 } };

  if (isAvailable) {
    query = query.find(availavleLogic);
  }

  const queryabc = {
    price: { $gte: 1, $lte: price }
  };

  if (price != undefined) {
    query = query.find(queryabc);
  }

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page if not provided
  
  // Calculate the number of documents to skip
  const skip = (page - 1) * pageSize;



  try {
    //const allSymptoms = await query.exec();

    const allSymptoms = await query.find()
    .sort({ _id: 1 })
    .skip(skip)
    .limit(pageSize)
    .exec();

// Optionally, get the total count of documents for pagination metadata
const totalSymptoms = await Symptom.countDocuments();

res.json({
symptoms: allSymptoms,
currentPage: page,
totalPages: Math.ceil(totalSymptoms / pageSize),
totalSymptoms: totalSymptoms
});

    //res.status(200).json({ success: true, data: symptoms });
  } catch (err) {
    res.status(400).json(err);
  }







  // Symptom.aggregate([
  //   {
  //     $match:
  //     {
  //       'category': categoryName
  //     }
  //   },
  // ])
  //   // .exec()
  //   //.then((orderStatuses) => { orderStatuses.forEach(orderStatus => console.log(orderStatus)) })            
  //   //.then((orderStatuses) => { res.send({ orderStatuses }) })
  //   .then((symptoms) => {
  //     res.status(200).json({ success: true, data: symptoms })
  //   })
  //   .catch((err) => {
  //     res.send(err)
  //     //throw err;
  //   });



  //try {

  //const symptoms = await Symptom.find({ category: categoryName });

  // const filteredSymptoms = symptoms.filter(symptom => {
  //   //console.log('Symptom:', symptom);
  //   return Object.keys(query).every(key => {
  //     console.log('Query:', key, 'Key-',query[key]);
  //     const includes = symptom[key] && symptom[key].toString().includes(query[key]);
  //     console.log('Includes:', includes, 'prdkey', symptom[key]);
  //     return includes;
  //   });
  // });

  // const filteredSymptoms = symptoms.filter(symptom => {
  //   return Object.keys(query).every(key => {
  //     if (symptom[key] === undefined) {
  //       return false; // If the symptom does not have the key, exclude it
  //     }
  //     return symptom[key].toString().toLowerCase().includes(query[key].toLowerCase());
  //   });
  // });

  //console.log('filteredSymptoms:', filteredSymptoms);

  //   if (!symptoms) {
  //     return res.status(404).json({ success: false, message: 'Symptom not found' });
  //   }

  //   res.status(200).json({ success: true, data: symptoms });
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message });
  // }
};



exports.updateSymptom = async (req, res) => {
  try {
    const updatedSymptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSymptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }
    res.status(200).json({ success: true, data: updatedSymptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSymptom = async (req, res) => {
  try {
    const deletedSymptom = await Symptom.findByIdAndDelete(req.params.id);
    if (!deletedSymptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }
    res.status(200).json({ success: true, message: 'Symptom deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};















// exports.getAllSymptoms = async (req, res) => {
//     try {
//         const symptoms = await Symptom.find();
//         res.json(symptoms);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// exports.getSymptomById = async (req, res) => {
//     try {
//         const symptom = await Symptom.findById(req.params.id);
//         if (!symptom) return res.status(404).json({ message: 'Symptom not found' });
//         res.json(symptom);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// exports.createSymptom = async (req, res) => {
//     const symptom = new Symptom(req.body);
//     try {
//         const newSymptom = await symptom.save();
//         res.status(201).json(newSymptom);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.updateSymptom = async (req, res) => {
//     try {
//         const updatedSymptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedSymptom) return res.status(404).json({ message: 'Symptom not found' });
//         res.json(updatedSymptom);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.deleteSymptom = async (req, res) => {
//     try {
//         const symptom = await Symptom.findByIdAndDelete(req.params.id);
//         if (!symptom) return res.status(404).json({ message: 'Symptom not found' });
//         res.json({ message: 'Symptom deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.replaceSymptom = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Symptom.findOneAndReplace({ _id: id }, req.body, { new: true })
    res.status(201).json(doc);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

