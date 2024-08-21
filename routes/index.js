const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/Symptom');
const accountController = require('../controllers/Auth');
const activationController = require('../controllers/Acctivation');
const passwordController = require('../controllers/ResetPassword');
const userController = require('../controllers/User');
const aboutPageController = require('../controllers/About');
const departmentController = require('../controllers/Department');
const uploadController = require('../controllers/ImageUpload');
const SearchController = require("../controllers/Search")

const { authenticateUser } = require('../middleware/auth');

router.post('/upload', uploadController.uploadImage);

// Import individual route modules
const indexRoute = require('./indexRoute');

// Use the individual route modules
router.use('/', indexRoute);
router.post('/search', SearchController.searchSymptoms);
router.post('/auth/register', accountController.Registration);
router.get('/auth/activate/:token', activationController.Activation);
router.post('/auth/resend-activation', activationController.ResendActivation);
router.post('/auth/login', accountController.Login);
router.post('/auth/logout', accountController.Logout);
router.post('/auth/reset-password-request', passwordController.ForgotPassword);
router.post('/auth/reset-password/', passwordController.ResetPassword);

 

router.get('/users', authenticateUser, userController.getAllUsers);
router.get('/users/:id', authenticateUser, userController.getUserById);
router.patch('/updateUser/:id', authenticateUser, userController.updateUser);
router.delete('/users/:id', authenticateUser, userController.deleteUser);
router.post('/doctors', userController.getDoctors);

router.get('/symptoms', symptomController.getAllSymptoms);
router.get('/symptom/:id', symptomController.getSymptomById);
router.get('/userSymptoms/', symptomController.getAllUserSymptoms);
router.post('/symptomByName', symptomController.getSymptomByName);
router.post('/symptom', authenticateUser, symptomController.createSymptom);
router.patch('/postSymptomById/:id', authenticateUser, symptomController.updateSymptomDetailsById);
router.put('/symptom/:id', authenticateUser, symptomController.replaceSymptom);
router.patch('/symptom/:id', authenticateUser, symptomController.updateSymptom);
router.delete('/symptom/:id', authenticateUser, symptomController.deleteSymptom);
router.get('/symptomByCategory/:catName', symptomController.getSymptomsByCategoryName);
router.get('/symptomBySubCategory/:catName', symptomController.getSymptomsByCategoryName);

router.get('/about', aboutPageController.getAboutPage);
router.patch('/about', aboutPageController.updateAboutPage);

router.get('/departments', departmentController.getAllDepartments);
router.get('/departmentsName', departmentController.getAllDepartmentName);




// Catch-all route for 404 errors
router.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

module.exports = router;