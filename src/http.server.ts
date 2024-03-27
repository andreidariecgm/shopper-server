import express from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.use((request, response, next) => {
  console.group('\x1b[36m%s\x1b[0m', '>>> NEW REQUEST')
  console.log('url:', request.url);
  console.log('method:', request.method);
  console.log('body:', request.body);
  console.log('params:', request.params);
  console.groupEnd();

  next();
  // setTimeout(next, 5000);
})

let createProduct = (seed: number) => {
  faker.seed(seed);
  return ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 100, max: 1000 }),
    category: faker.commerce.department(),
    image: `https://picsum.photos/seed/${faker.string.uuid()}/96/96`,
  });
}

let createProductsList = (term?) => {
  if (term) {
    console.log(term);
  }

  const products: any[] = [];

  for (let i = 0; i < 50; i++) {
    const newProduct = createProduct(i + 1)
    products.push(newProduct);
  }

  return products;
}

const products: any[] = createProductsList();

app.get('/products', (request, response) => {
  response.send(products);
});

app.get('/products/:term', (request, response) => {
  const term = request.params.term.toLowerCase();
  const filteredProducts: any[] = [...products].filter(product => {
    const name = product.name.toLowerCase();
    return name.includes(term);
  });
  response.send(filteredProducts);
  // response.status(500).send({ message: 'Internal server error' })
});

app.post('/buy', (request, response) => {
  console.log(request.body);

  response.send({
    status: 'OK',
  });

  // response.status(500).send({ error: 'Internal server error' })
});

app.listen(port, () => {
  console.log('-----------------------------------------------------------------------------------')
  console.log('\x1b[33m%s\x1b[0m', `http server started at http://localhost:${port}`);
  console.log('-----------------------------------------------------------------------------------')
});
