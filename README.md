## E-commerce web app backend in MVC structure

The APIs(endpoints), built with Node.js, Express, and MongoDB, includes 
- user registration, 
- account activation, 
- secure login,
- JWT for authentication,
- authorization using middleware.

- Search using text index
- Product listing,
- Filters,
- product details,
- add to cart,
- add to wish list,
- cart,
- checkout,
- user account (profile, delivery addresses, orders list)

- Admin features
- Add products,
- Add Categories,
- Add Brands,
- Add Homepage Sliders,
- Add About Us page content



## Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)  
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Install locally or use MongoDB Atlas for a cloud-based solution.)
- [Git](https://git-scm.com/) (optional but recommended)

## Getting Started

1. **Clone the repository:**

   git clone https://github.com/bdlbbsr/mern-store.git


2. **Navigate to the Project Directory:**

   cd backend


3. **Install Dependencies:**

   npm install


4. **Configure Environment Variables:**

   Create a .env file in the root of the project and set the variables:

5. **Update Configurations:**

   Modify the configuration files in the `config` directory according to your needs.


6. **Run the Application:**

- For development:

  npm start

The server will run at http://localhost:8080 as per env file.

7. **Endpoints**

- `router.post('/search', SearchController.searchProducts)`
- `router.get('/auth/activate/:token', activationController.Activation)`
- `router.post('/auth/register', accountController.Registration)`
- `router.post('/auth/resend-activation', activationController.ResendActivation)`
- `router.post('/auth/login', accountController.Login)`
- `router.post('/auth/logout', accountController.Logout)`
- `router.post('/auth/reset-password-request', passwordController.ForgotPassword)`
- `router.post('/auth/reset-password/', passwordController.ResetPassword)`

- `router.get('/profile', authenticateUser, profileController.getUserProfile)`
- `router.patch('/profile', authenticateUser, profileController.updateUserProfile)`
- `router.post('/saveAddress', authenticateUser, profileController.addAddress)`

- `router.get('/home-slider', sliderController.getAllSlides)`
- `router.post('/home-slider', authenticateUser, sliderController.createSlide)`
- `router.patch('/home-slider/:index', authenticateUser, sliderController.updateSlide)`
- `router.delete('/home-slider/:index', authenticateUser, sliderController.deleteSlide)`

- `router.get('/users', userController.getAllUsers)`
- `router.get('/users/:id', userController.getUserById)`
- `router.put('/users/:id', userController.updateUser)`
- `router.delete('/users/:id', userController.deleteUser)`

- `router.get('/products', productController.getAllProducts)`
- `router.get('/products/:id', productController.getProductById)`
- `router.post('/products', authenticateUser, productController.createProduct)`
- `router.put('/products/:id', authenticateUser, productController.replaceProduct)`
- `router.patch('/products/:id', authenticateUser, productController.updateProduct)`
- `router.delete('/products/:id', authenticateUser, productController.deleteProduct)`
- `router.get('/product/:name', productController.getProductByName)`
- `router.get('/productsByCategory/:catName', productController.getProductsByCategoryName)`

- `router.post('/feedback', authenticateUser, feedbackController.createFeedback)`
- `router.get('/feedback/:productId', feedbackController.getFeedbackForProduct)`

- `router.get('/cart', cartController.getCart)`
- `router.post('/add', cartController.addToCart)`
- `router.post('/remove', cartController.removeFromCart)`

- `router.post('/order', orderController.createOrder)`
- `router.get('/order/:userId', orderController.getOrdersByUser)`
- `router.get('/orderDeatsil/:orderId', orderController.getOrderById)`
- `router.put('/order/:orderId', orderController.updateOrder)`

- `router.get('/about', aboutPageController.getAboutPage)`
- `router.patch('/about', aboutPageController.updateAboutPage)`

- `router.post('/category', authenticateUser, categoryController.createCategory)`
- `router.get('/category', categoryController.getAllCategories)`
- `router.get('/category/:id', categoryController.getCategoryById)`
- `router.patch('/category/:id', authenticateUser, categoryController.updateCategory)`
- `router.delete('/category/:id', authenticateUser, categoryController.deleteCategory)`

- `router.post('/brand', authenticateUser, brandController.createBrand)`
- `router.get('/brand', brandController.getAllBrands)`
- `router.get('/brand/:id', brandController.getBrandById)`
- `router.patch('/brand/:id', authenticateUser, brandController.updateBrand)`
- `router.delete('/brand/:id', authenticateUser, brandController.deleteBrand)`

8. **Middleware**
 Verifies the JWT token included in the Authorization header to applied in protected routes.

