import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Bell, 
  MessageSquare, 
  User, 
  Download, 
  Plus,
  MoreHorizontal,
  Trash2,
  Check,
  X,
  CheckCircle2
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './App.css';

// Initialize Stripe with a test key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const AddMethodForm = ({ onCancel, onSuccess, newMethodData, setNewMethodData }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (newMethodData.type === 'BANK' && !newMethodData.bankName.trim()) return;
    if (newMethodData.type !== 'BANK' && !newMethodData.cardholderName.trim()) return;

    // Simulate Stripe payment method creation
    let styleClass = newMethodData.type === 'BANK' ? 'bank' : 'visa';
    if (newMethodData.type === 'MASTERCARD') styleClass = 'mastercard';

    let name = '';
    let expiry = '';

    if (newMethodData.type === 'BANK') {
        name = `${newMethodData.bankName} ••••${newMethodData.cardNumber ? newMethodData.cardNumber.slice(-4) : 'XXXX'}`;
        expiry = 'Direct Debit';
    } else {
        const typeName = newMethodData.type === 'VISA' ? 'Visa' : 'Mastercard';
        name = `${typeName} ending in 4242`; // Mocking the secure token return
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


function App() {
  const [invoices, setInvoices] = useState([
    { id: '#INV-2026-002', date: 'Mar 01, 2026', description: 'March - Leo', amount: 20000.00, status: 'Pending' },
    { id: '#INV-2026-001', date: 'Feb 01, 2026', description: 'February - Leo', amount: 20000.00, status: 'Paid' },
    { id: '#INV-2025-012', date: 'Jan 01, 2026', description: 'January - Leo', amount: 20000.00, status: 'Paid' },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { type: 'VISA', name: 'Visa ending in 4242', expiry: 'Expires 8/28', styleClass: 'visa' },
    { type: 'BANK', name: 'Chase Checking ••••8821', expiry: 'Direct Debit', styleClass: 'bank' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [newMethodData, setNewMethodData] = useState({
    type: 'VISA',
    bankName: '',
    cardholderName: '',
    cardNumber: ''
  });
  const [toastMessage, setToastMessage] = useState('');
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount).replace('₹', 'Rs');
  };

  const outstandingBalance = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const lastPayment = invoices.find(inv => inv.status === 'Paid')?.amount || 0;

  const executePayment = async () => {
    if (!invoiceToPay) return;
    
    if (paymentMethods.length === 0 || selectedMethodIndex === null || !paymentMethods[selectedMethodIndex]) {
        setInvoiceToPay(null);
        showToast('Transaction failed: No payment method selected or added.');
        return;
    }

    const id = invoiceToPay.id;
    setInvoiceToPay(null);
    showToast('Processing payment securely...');
    setTimeout(() => {
      setInvoices(invoices.map(inv => 
        inv.id === id ? { ...inv, status: 'Paid' } : inv
      ));
      showToast(`Payment for ${id} successful!`);
    }, 1500);
  };

  const handleAddMethodSuccess = (newMethod) => {
    const updated = [...paymentMethods, newMethod];
    setPaymentMethods(updated);
    if (selectedMethodIndex === null || paymentMethods.length === 0) {
      setSelectedMethodIndex(0);
    }
    setIsModalOpen(false);
    setNewMethodData({ type: 'VISA', bankName: '', cardholderName: '', cardNumber: '' });
    showToast('Payment method securely added via Stripe!');
  };

  const handleRemoveMethod = (indexToRemove) => {
    const updatedMethods = paymentMethods.filter((_, index) => index !== indexToRemove);
    setPaymentMethods(updatedMethods);
    if (selectedMethodIndex === indexToRemove) {
      setSelectedMethodIndex(updatedMethods.length > 0 ? 0 : null);
    } else if (selectedMethodIndex > indexToRemove) {
      setSelectedMethodIndex(selectedMethodIndex - 1);
    }
    showToast('Payment method removed');
  };

  const handleDownloadStatement = () => {
    setIsStatementModalOpen(true);
  };

  const executeDownload = () => {
    setIsStatementModalOpen(false);
    showToast('Statement downloaded successfully!');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo-icon"><Check size={20} /></div>
            <span>Sprouty</span>
          </div>
          
          <nav className="nav-links">
            <a href="#" className="nav-item">
              <Home className="nav-icon" /> Home
            </a>
            <a href="#" className="nav-item">
              <Users className="nav-icon" /> My Children
            </a>
            <a href="#" className="nav-item">
              <TrendingUp className="nav-icon" /> Progress
            </a>
            <a href="#" className="nav-item active">
              <CreditCard className="nav-icon" /> Payments
            </a>
            <a href="#" className="nav-item">
              <Bell className="nav-icon" /> Notifications
            </a>
            <a href="#" className="nav-item">
              <MessageSquare className="nav-icon" /> Messaging
            </a>
            <a href="#" className="nav-item">
              <User className="nav-icon" /> My Profile
            </a>
          </nav>

          <div className="user-profile">
            <div className="avatar">SJ</div>
            <div className="user-info">
              <span className="user-name">Sarah Jenkins</span>
              <span className="user-role">Parent</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">Payments & Invoices</h1>
              <p className="page-description">Manage your billing methods and view transaction history.</p>
            </div>
            <button className="btn-primary" onClick={handleDownloadStatement}>
              <Download size={18} /> Statement
            </button>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="card">
              <h3 className="card-title">Outstanding Balance</h3>
              <div className="card-amount outstanding">{formatCurrency(outstandingBalance)}</div>
              <p className="card-subtitle">Due by Mar 5, 2026</p>
            </div>
            <div className="card">
              <h3 className="card-title">Last Payment</h3>
              <div className="card-amount last-payment">{formatCurrency(lastPayment)}</div>
              <p className="card-subtitle">Processed on Feb 1, 2026</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Payment Methods</h2>
              <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> Add Method
              </button>
            </div>
            <div className="methods-list">
              {paymentMethods.map((method, idx) => (
                <div 
                  className="method-card" 
                  key={idx}
                  onClick={() => setSelectedMethodIndex(idx)}
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
                  <button className="more-btn" onClick={(e) => { e.stopPropagation(); handleRemoveMethod(idx); }} title="Remove method" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ef4444'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="section-container">
            <h2 className="section-title" style={{ marginBottom: '24px' }}>Recent Invoices</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>INVOICE ID</th>
                  <th>DATE</th>
                  <th>DESCRIPTION</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="text-bold">{invoice.id}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.description}</td>
                    <td className="text-bold">{formatCurrency(invoice.amount)}</td>
                    <td>
                      <span className={`status-badge ${invoice.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      {invoice.status === 'Pending' ? (
                        <button className="action-link" onClick={() => setInvoiceToPay(invoice)}>
                          Pay Now
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAB */}
          <div className="fab" onClick={() => showToast('Opening chat...')}>
            <MessageSquare size={24} />
          </div>
        </main>

        {/* Payment Confirmation Modal */}
        {invoiceToPay && (
          <div className="modal-overlay" onClick={() => setInvoiceToPay(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                <h2>Confirm Payment</h2>
                <button className="close-btn" onClick={() => setInvoiceToPay(null)}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>You are about to pay</p>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  {formatCurrency(invoiceToPay.amount)}
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'left', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Invoice</span>
                    <span style={{ fontWeight: 500 }}>{invoiceToPay.id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Description</span>
                    <span style={{ fontWeight: 500 }}>{invoiceToPay.description}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Payment Method</span>
                    <span style={{ fontWeight: 500 }}>
                      {paymentMethods[selectedMethodIndex] ? paymentMethods[selectedMethodIndex].name : 'None Selected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
                <button type="button" className="btn-outline" onClick={() => setInvoiceToPay(null)} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={executePayment} style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Method Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Payment Method</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <AddMethodForm 
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleAddMethodSuccess}
                newMethodData={newMethodData}
                setNewMethodData={setNewMethodData}
              />
            </div>
          </div>
        )}

        {/* Statement Preview Modal */}
        {isStatementModalOpen && (
          <div className="modal-overlay" onClick={() => setIsStatementModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2>Account Statement</h2>
                <button className="close-btn" onClick={() => setIsStatementModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="statement-preview" style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Sprouty Child Care</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>123 Learning Lane</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>Statement</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mar 2026</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Bill To:</p>
                  <p style={{ margin: 0, fontWeight: 500 }}>Sarah Jenkins</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Child: Leo Jenkins</p>
                </div>
                <table style={{ width: '100%', fontSize: '0.875rem', marginBottom: '16px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>Previous Balance</td>
                      <td style={{ padding: '4px 0', textAlign: 'right' }}>{formatCurrency(lastPayment)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>Recent Payments</td>
                      <td style={{ padding: '4px 0', textAlign: 'right', color: 'var(--success-text)' }}>-{formatCurrency(lastPayment)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0', color: 'var(--text-secondary)', fontWeight: 500 }}>New Charges (March)</td>
                      <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(20000)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0 0', fontWeight: 700, borderTop: '1px solid var(--border-color)' }}>Total Amount Due</td>
                      <td style={{ padding: '12px 0 0', textAlign: 'right', fontWeight: 700, borderTop: '1px solid var(--border-color)', color: 'var(--primary-teal)' }}>{formatCurrency(outstandingBalance)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsStatementModalOpen(false)}>
                  Close
                </button>
                <button type="button" className="btn-primary" onClick={executeDownload}>
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="toast">
            <CheckCircle2 size={20} color="var(--success-text)" />
            {toastMessage}
          </div>
        )}
      </div>
    </Elements>
  );
}

export default App;
