const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.get('/', async (req, res) => {
  try {
    await prisma.$connect();
    res.send('Connected to the database');
  } catch (error) {
    res.status(500).send('Error connecting to the database');
  } finally {
    await prisma.$disconnect();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
