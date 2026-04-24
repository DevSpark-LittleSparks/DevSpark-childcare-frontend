import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export const AddMethodForm = ({ onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [newMethodData, setNewMethodData] = useState({
    type: 'VISA',
    bankName: '',
    cardholderName: '',
    cardNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (newMethodData.type === 'BANK' && !newMethodData.bankName.trim()) return;
    if (newMethodData.type !== 'BANK' && !newMethodData.cardholderName.trim()) return;

    let styleClass = newMethodData.type === 'BANK' ? 'bank' : 'visa';
    if (newMethodData.type === 'MASTERCARD') styleClass = 'mastercard';

    let name = '';
    let expiry = '';

    if (newMethodData.type === 'BANK') {
        name = `${newMethodData.bankName} ••••${newMethodData.cardNumber ? newMethodData.cardNumber.slice(-4) : 'XXXX'}`;
        expiry = 'Direct Debit';
    } else {
        const typeName = newMethodData.type === 'VISA' ? 'Visa' : 'Mastercard';
        name = `${typeName} ending in 4242`;
        expiry = 'Expires 12/29';
    }

    onSuccess({
      type: newMethodData.type === 'MASTERCARD' ? 'MC' : newMethodData.type,
      name: name,
      expiry: expiry,
      styleClass: styleClass
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Method Type</label>
        <select 
          className="form-control"
          value={newMethodData.type}
          onChange={e => setNewMethodData({...newMethodData, type: e.target.value})}
        >
          <option value="VISA">Visa</option>
          <option value="MASTERCARD">Mastercard</option>
          <option value="BANK">Bank Account</option>
        </select>
      </div>

      {newMethodData.type === 'BANK' ? (
        <>
          <div className="form-group">
            <label>Bank Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Chase Bank"
              value={newMethodData.bankName}
              onChange={e => setNewMethodData({...newMethodData, bankName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Account Holder Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. John Doe"
              value={newMethodData.cardholderName}
              onChange={e => setNewMethodData({...newMethodData, cardholderName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. 123456789"
              value={newMethodData.cardNumber}
              onChange={e => setNewMethodData({...newMethodData, cardNumber: e.target.value})}
              required
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. John Doe"
              value={newMethodData.cardholderName}
              onChange={e => setNewMethodData({...newMethodData, cardholderName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Card Details</label>
            <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                },
              }}/>
            </div>
            <small style={{ color: 'var(--text-tertiary)', marginTop: '4px', display: 'block', fontSize: '12px' }}>
              Secured by Stripe Elements
            </small>
          </div>
        </>
      )}

      <div className="modal-actions">
        <button type="button" className="btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={!stripe}>
          Add Method
        </button>
      </div>
    </form>
  );
};
