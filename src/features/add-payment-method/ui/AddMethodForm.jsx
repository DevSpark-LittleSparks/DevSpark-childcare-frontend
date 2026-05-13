import React, { useState } from 'react';
import { saveCard } from '@/shared/api/cardApi';
import { PARENT_ID } from '@/shared/lib/constants';

const mapCard = (card) => ({
  id: card.cardDetailsId,
  type: card.cardType,
  name: `${card.cardType === 'VISA' ? 'Visa' : 'Mastercard'} ending in ${card.cardLast4}`,
  expiry: card.expDate
    ? (() => {
        const d = Array.isArray(card.expDate)
          ? new Date(card.expDate[0], card.expDate[1] - 1, card.expDate[2])
          : new Date(card.expDate);
        return `Expires ${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
      })()
    : '',
  styleClass: card.cardType === 'VISA' ? 'visa' : 'mastercard',
});

export const AddMethodForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    cardType: 'VISA',
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const { cardHolderName, cardNumber, expiryDate, cardType } = formData;
    const digits = cardNumber.replace(/\s/g, '');

    if (!cardHolderName.trim()) return 'Cardholder name is required.';
    if (!/^[a-zA-Z\s]{2,}$/.test(cardHolderName.trim())) return 'Cardholder name must contain only letters.';

    if (!/^\d{16}$/.test(digits)) return 'Card number must be exactly 16 digits.';
    if (cardType === 'VISA' && !digits.startsWith('4')) return 'Visa card number must start with 4.';
    if (cardType === 'MASTERCARD' && !/^5[1-5]/.test(digits)) return 'Mastercard number must start with 51–55.';
    

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return 'Expiry date must be in MM/YY format.';
    const [month, year] = expiryDate.split('/').map(Number);
    const expiry = new Date(2000 + year, month - 1, 1);
    const now = new Date();
    now.setDate(1); now.setHours(0, 0, 0, 0);
    if (expiry < now) return 'Card has expired.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      const response = await saveCard({
        parentId: PARENT_ID,
        cardHolderName: formData.cardHolderName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardType: formData.cardType,
        expiryDate: formData.expiryDate,
      });
      onSuccess(mapCard(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Card Type</label>
        <select className="form-control" value={formData.cardType} onChange={set('cardType')}>
          <option value="VISA">Visa</option>
          <option value="MASTERCARD">Mastercard</option>
        </select>
      </div>

      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. John Doe"
          value={formData.cardHolderName}
          onChange={set('cardHolderName')}
          required
        />
      </div>

      <div className="form-group">
        <label>Card Number</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. 4111111111111111"
          value={formData.cardNumber}
          onChange={set('cardNumber')}
          maxLength={19}
          required
        />
      </div>

      <div className="form-group">
        <label>Expiry Date (MM/YY)</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. 08/28"
          value={formData.expiryDate}
          onChange={set('expiryDate')}
          maxLength={5}
          required
        />
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
      )}

      <div className="modal-actions">
        <button type="button" className="btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Add Card'}
        </button>
      </div>
    </form>
  );
};
