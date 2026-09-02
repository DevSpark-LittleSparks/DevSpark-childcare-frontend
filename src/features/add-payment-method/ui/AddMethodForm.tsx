import { useState, type FormEvent } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import { stripePromise } from '@/utils/stripeConfig';
import { apiClient } from '@/services/axiosInstance';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
  },
};

interface AddMethodFormProps {
  parentId: string;
  onCancel: () => void;
  onSuccess: (savedCard: unknown) => void;
}

// 1. Rename your form content to an isolated inner component
const AddMethodFormContent = ({ parentId, onCancel, onSuccess }: AddMethodFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [cardError, setCardError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement(CardElement);
    if (!stripe || !elements || !cardElement || !cardholderName.trim()) return;

    setFormError('');
    setIsSubmitting(true);
    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: cardholderName.trim() },
      });

      if (stripeError) {
        setFormError(stripeError.message ?? 'Unable to save card. Please try again.');
        return;
      }

      const { data } = await apiClient.post('/api/v1/cards', {
        parentId,
        cardHolderName: cardholderName.trim(),
        stripePaymentMethodId: paymentMethod.id,
      });

      onSuccess(data.data);
    } catch (err) {
      setFormError(getErrorMessage(err, 'Unable to save card. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. John Doe"
          value={cardholderName}
          onChange={e => setCardholderName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Card Details</label>
        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(event) => setCardError(event.error?.message ?? '')}
          />
        </div>
        {cardError && (
          <small style={{ color: '#dc2626', marginTop: '4px', display: 'block', fontSize: '12px' }}>
            {cardError}
          </small>
        )}
        <small style={{ color: 'var(--text-tertiary)', marginTop: '4px', display: 'block', fontSize: '12px' }}>
          Secured by Stripe Elements
        </small>
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
        <button type="submit" className="btn-primary" disabled={!stripe || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Method'}
        </button>
      </div>
    </form>
  );
};

// 2. Export the component natively wrapped in Elements
export const AddMethodForm = (props: AddMethodFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <AddMethodFormContent {...props} />
    </Elements>
  );
}
