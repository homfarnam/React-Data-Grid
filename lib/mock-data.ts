import { faker } from '@faker-js/faker';
import type { Document } from './types';

const generateSingleDocument = (id: number): Document => {
  faker.seed(id);

  return {
    id,
    documentNr: `DOC-${String(id).padStart(4, '0')}`,
    title: `${faker.commerce.productName()} ${faker.word.words(2)}`,
    description: faker.lorem.sentence(),
    revision: faker.number.int({ min: 1, max: 15 }),
    createdDate: faker.date
      .between({ from: '2023-01-01', to: '2024-12-31' })
      .toISOString(),
    owner: faker.person.fullName(),
    favourite: faker.datatype.boolean({ probability: 0.15 }),
  };
};

export const generateMockDocuments = (count = 1000): Document[] => {
  const documents: Document[] = [];
  for (let i = 1; i <= count; i++) {
    documents.push(generateSingleDocument(i));
  }
  return documents;
};

export const getAllOwners = (documents: Document[]): string[] => {
  const owners = new Set(documents.map((doc) => doc.owner));
  return Array.from(owners).sort();
};
