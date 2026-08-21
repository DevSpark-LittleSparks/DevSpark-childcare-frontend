import React, { useState } from 'react';

const CHARGE_TYPES = [
  { value: 'REGISTRATION_FEE', label: 'Registration Fee' },
  { value: 'FACILITY_FEE', label: 'Facility Fee' },
  { value: 'OTHER', label: 'Other' },
];

export const AddChargeForm = ({ onCancel, onSubmit }) => {
  const [chargeType, setChargeType] = useState('REGISTRATION_FEE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Enter a valid amount.');
      return;
    }
    if (chargeType === 'OTHER' && !description.trim()) {
      setFormError('Enter a description for this charge.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        chargeType,
        description: chargeType === 'OTHER' ? description.trim() : undefined,
        amount: numericAmount,
      });
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Unable to add charge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Charge Type</label>
        <select
          className="form-control"
          value={chargeType}
          onChange={(e) => setChargeType(e.target.value)}
        >
          {CHARGE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {chargeType === 'OTHER' && (
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Uniform replacement"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          className="form-control"
          placeholder="0.00"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      {formError && (
        <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>
          {formError}
        </div>
      )}

      <div className="modal-actions">
        <button type="button" className="btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Charge'}
        </button>
      </div>
    </form>
  );
};
