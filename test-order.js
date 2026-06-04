const http = require('http');

const payload = JSON.stringify({
  name: "John Doe",
  email: "john@test.com",
  phone: "08012345678",
  address: "123 Test Street",
  location: "Lagos",
  notes: "Test order for verification",
  items: [
    {
      id: 1,
      quantity: 2,
      product: {
        id: 1,
        name: "Test Product A",
        price: 5000
      }
    },
    {
      id: 2,
      quantity: 1,
      product: {
        id: 2,
        name: "Test Product B",
        price: 7500
      }
    }
  ],
  subtotal: 17500,
  deliveryFee: 5000,
  total: 1
});

const options = {
  hostname: '127.0.0.1',
  port: 3002,
  path: '/api/order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    const result = JSON.parse(data);
    console.log('Success:', result.success);
    console.log('Order Number:', result.orderNumber);
    if (result.invoiceBase64) {
      console.log('Invoice Base64 Length:', result.invoiceBase64.length);
      console.log('Invoice Generated: Yes');
    } else {
      console.log('Invoice Generated: No');
    }
    if (result.error) {
      console.log('Error:', result.error);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.write(payload);
req.end();
