import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const PaymentMethodsList = ({
  paymentMethods,
  selectedMethodIndex,
  onSelectMethod,
  onRemoveMethod,
  onAddMethodClick
}) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Payment Methods</h2>
        <button className="btn-outline" onClick={onAddMethodClick}>
          <Plus size={16} /> Add Method
        </button>
      </div>
      <div className="methods-list">
        {paymentMethods.map((method, idx) => (
          <div
            className="method-card"
            key={idx}
            onClick={() => onSelectMethod(idx)}
            style={{
              cursor: 'pointer',
              border: selectedMethodIndex === idx ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
              boxShadow: selectedMethodIndex === idx ? '0 0 0 2px rgba(0, 196, 159, 0.2)' : 'none'
            }}
          >
            <div className={`method-icon ${method.styleClass}`}>{method.type}</div>
            <div className="method-details">
              <div className="method-name">{method.name}</div>
              <div className="method-expiry">{method.expiry}</div>
            </div>
            <button
              className="more-btn"
              onClick={(e) => { e.stopPropagation(); onRemoveMethod(idx); }}
              title="Remove method"
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
