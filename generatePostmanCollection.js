const fs = require('fs');
const { Collection, Item, Request, Url, Header, RequestBody } = require('postman-collection');

// Define the collection
const collection = new Collection({
  info: {
    name: 'My Store API',
    description: 'Collection of REST API endpoints for the My Store application.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [],
});

// Helper function to create a request
const createRequest = (name, method, url, headers, body) => {
  const request = new Request({
    name,
    method,
    url: new Url(url),
    header: headers ? headers.map(header => new Header(header)) : [],
    body: body ? new RequestBody(body) : undefined,
  });

  return new Item({
    name,
    request,
  });
};

// Add requests to the collection
const addRequestsToCollection = () => {
  collection.items.add(createRequest(
    'Register User',
    'POST',
    'http://localhost:8080/api/register',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Activate Account',
    'GET',
    'http://localhost:8080/api/activate/:token',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Resend Activation Email',
    'POST',
    'http://localhost:8080/api/resend-activation',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        email: 'john.doe@example.com',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Login User',
    'POST',
    'http://localhost:8080/api/login',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Forget Password',
    'POST',
    'http://localhost:8080/api/forget-password',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        email: 'john.doe@example.com',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Reset Password',
    'POST',
    'http://localhost:8080/api/reset-password/:token',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        password: 'newpassword123',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Get User Profile',
    'GET',
    'http://localhost:8080/api/profile',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    null
  ));

  collection.items.add(createRequest(
    'Get All Users',
    'GET',
    'http://localhost:8080/api/users',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Get User By ID',
    'GET',
    'http://localhost:8080/api/users/:id',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Update User',
    'PUT',
    'http://localhost:8080/api/users/:id',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        name: 'John Updated',
        email: 'john.updated@example.com',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Delete User',
    'DELETE',
    'http://localhost:8080/api/users/:id',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Get All Products',
    'GET',
    'http://localhost:8080/api/products',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Get Product By ID',
    'GET',
    'http://localhost:8080/api/products/:id',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Create Product',
    'POST',
    'http://localhost:8080/api/products',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    {
      mode: 'raw',
      raw: JSON.stringify({
        name: 'Sample Product',
        price: 99.99,
        description: 'This is a sample product.',
        category: 'Sample Category',
        thumbnail: 'http://example.com/thumbnail.jpg',
        ratings: 4.5,
        images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
        stock: 10,
      }),
    }
  ));

  collection.items.add(createRequest(
    'Replace Product',
    'PUT',
    'http://localhost:8080/api/products/:id',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    {
      mode: 'raw',
      raw: JSON.stringify({
        name: 'Updated Product',
        price: 79.99,
        description: 'This is an updated product.',
        category: 'Updated Category',
        thumbnail: 'http://example.com/updated-thumbnail.jpg',
        ratings: 4.7,
        images: ['http://example.com/updated-image1.jpg', 'http://example.com/updated-image2.jpg'],
        stock: 15,
      }),
    }
  ));

  collection.items.add(createRequest(
    'Update Product',
    'PATCH',
    'http://localhost:8080/api/products/:id',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    {
      mode: 'raw',
      raw: JSON.stringify({
        price: 89.99,
        stock: 20,
      }),
    }
  ));

  collection.items.add(createRequest(
    'Delete Product',
    'DELETE',
    'http://localhost:8080/api/products/:id',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    null
  ));

  collection.items.add(createRequest(
    'Create Feedback',
    'POST',
    'http://localhost:8080/api/feedback',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    {
      mode: 'raw',
      raw: JSON.stringify({
        userId: '60d5f9e7e3177e20d8d49b56',
        productId: '60d5fa0be3177e20d8d49b59',
        rating: 5,
        comment: 'Great product!',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Get Feedback for Product',
    'GET',
    'http://localhost:8080/api/feedback/:productId',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Get Cart',
    'GET',
    'http://localhost:8080/api/cart',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    null
  ));

  collection.items.add(createRequest(
    'Add to Cart',
    'POST',
    'http://localhost:8080/api/add',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    {
      mode: 'raw',
      raw: JSON.stringify({
        productId: '60d5fa0be3177e20d8d49b59',
        quantity: 2,
      }),
    }
  ));

  collection.items.add(createRequest(
    'Remove from Cart',
    'POST',
    'http://localhost:8080/api/remove',
    [{ key: 'Authorization', value: 'Bearer <JWT_TOKEN>', type: 'text' }],
    {
      mode: 'raw',
      raw: JSON.stringify({
        productId: '60d5fa0be3177e20d8d49b59',
      }),
    }
  ));

  collection.items.add(createRequest(
    'Get About Page',
    'GET',
    'http://localhost:8080/api/about',
    [],
    null
  ));

  collection.items.add(createRequest(
    'Update About Page',
    'PUT',
    'http://localhost:8080/api/updateAbout',
    [],
    {
      mode: 'raw',
      raw: JSON.stringify({
        content: 'This is the updated about page content.',
      }),
    }
  ));
};

// Add the requests to the collection
addRequestsToCollection();

// Write the collection to a file
fs.writeFileSync('ecommerce-api-postman-collection.json', JSON.stringify(collection.toJSON(), null, 2));

console.log('Postman collection generated successfully.');
