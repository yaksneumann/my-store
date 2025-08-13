import { Product } from '../models/product.interface';

export const DUMMY_PRODUCTS: Product[] = [
    {
      id: 1,
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling and an ergonomic design for all-day comfort.',
      price: 348.00,
      creationDate: new Date('2025-01-15'),
      imageUrl: 'img.png'
    },
    {
      id: 2,
      name: 'Kindle Paperwhite',
      description: 'A glare-free display and adjustable warm light make this the perfect e-reader for book lovers, with up to 10 weeks of battery life.',
      price: 139.99,
      creationDate: new Date('2024-02-20'),
      imageUrl: 'img.png'
    },
    {
      id: 3,
      name: 'Hydro Flask',
      description: 'Keep beverages cold for up to 24 hours and hot for up to 12 hours with this durable, vacuum-insulated stainless steel water bottle.',
      price: 49.95,
      creationDate: new Date('2023-04-10'),
      imageUrl: 'img.png'
    },
    {
      id: 4,
      name: 'Anker PowerCore 20100',
      description: 'A high-capacity portable charger that provides multiple charges for phones and other USB devices, featuring Anker\'s high-speed charging technology.',
      price: 59.99,
      creationDate: new Date('2024-11-05'),
      imageUrl: 'img.png'
    }
  ];