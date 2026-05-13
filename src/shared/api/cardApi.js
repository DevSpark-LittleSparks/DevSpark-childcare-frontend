import apiClient from './apiClient';

export const saveCard = (data) =>
  apiClient.post('/cards', data);

export const getCardsByParent = (parentId) =>
  apiClient.get(`/cards/parent/${parentId}`);

export const deleteCard = (cardId) =>
  apiClient.delete(`/cards/${cardId}`);
