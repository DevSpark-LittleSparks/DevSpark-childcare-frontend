import { useEffect, useState, type FormEvent } from 'react';
import { Send, Megaphone, AlertTriangle } from 'lucide-react';
import { alertsApi } from '@/services/alertsApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import type { AlertRecipient, AlertPriority, SentAlert } from '@/types/alerts.types';

import '@/pages/billing/BillingPage.css';

const ALERT_PRESETS = [
  { value: 'PARENT_MEETING', label: 'Parent Meeting', title: 'Parent Meeting', priority: 'NORMAL' },
  { value: 'EMERGENCY_ALERT', label: 'Emergency Alert', title: 'Emergency Alert', priority: 'HIGH' },
  { value: 'GENERAL', label: 'General Announcement', title: 'Announcement', priority: 'NORMAL' },
  { value: 'CUSTOM', label: 'Custom', title: '', priority: 'NORMAL' },
] as const satisfies readonly { value: string; label: string; title: string; priority: AlertPriority }[];

const AUDIENCES = [
  { value: 'TEACHER', label: 'All Staff' },
  { value: 'PARENT', label: 'All Parents' },
  { value: 'ALL', label: 'Everyone' },
  { value: 'INDIVIDUAL', label: 'Individual User' },
] as const;

export const AlertsPage = () => {
  const [preset, setPreset] = useState<string>('PARENT_MEETING');
  const [title, setTitle] = useState<string>(ALERT_PRESETS[0].title);
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<AlertPriority>(ALERT_PRESETS[0].priority);
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]['value']>('PARENT');
  const [recipients, setRecipients] = useState<AlertRecipient[]>([]);
  const [recipientId, setRecipientId] = useState('');
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);

  const [sentAlerts, setSentAlerts] = useState<SentAlert[]>([]);
  const [isLoadingSent, setIsLoadingSent] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadSentAlerts = () => {
    setIsLoadingSent(true);
    alertsApi
      .getSentAlerts()
      .then((res) => setSentAlerts(res.data?.data ?? []))
      .catch(() => setSentAlerts([]))
      .finally(() => setIsLoadingSent(false));
  };

  useEffect(() => {
    loadSentAlerts();
  }, []);

  useEffect(() => {
    if (audience !== 'INDIVIDUAL' || recipients.length > 0) return;
    setIsLoadingRecipients(true);
    alertsApi
      .getRecipients()
      .then((res) => setRecipients(res.data?.data ?? []))
      .catch(() => setRecipients([]))
      .finally(() => setIsLoadingRecipients(false));
  }, [audience, recipients.length]);

  const handlePresetChange = (value: string) => {
    setPreset(value);
    const chosen = ALERT_PRESETS.find((p) => p.value === value);
    if (chosen) {
      setTitle(chosen.title);
      setPriority(chosen.priority);
    }
  };

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!title.trim()) {
      setFormError('Enter a title for this alert.');
      return;
    }
    if (!body.trim()) {
      setFormError('Enter a message.');
      return;
    }
    if (audience === 'INDIVIDUAL' && !recipientId) {
      setFormError('Select who this alert is for.');
      return;
    }

    const selectedRecipient = recipients.find((r) => r.accountId === recipientId);
    const payload = {
      title: title.trim(),
      body: body.trim(),
      priority,
      targetType: audience === 'INDIVIDUAL' ? (selectedRecipient?.role ?? 'PARENT') : audience,
      targetRefId: audience === 'INDIVIDUAL' ? recipientId : null,
    };

    setIsSending(true);
    try {
      await alertsApi.sendAlert(payload);
      setSuccessMessage('Alert sent successfully.');
      setBody('');
      setRecipientId('');
      loadSentAlerts();
    } catch (err) {
      setFormError(getErrorMessage(err, 'Unable to send alert. Please try again.'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alerts</h1>
          <p className="page-description">Broadcast targeted notifications to staff, parents, or a specific person.</p>
        </div>
      </div>

      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title"><Megaphone size={18} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />Compose Alert</h2>
        </div>

        <form onSubmit={handleSend}>
          <div className="form-group">
            <label>Alert Type</label>
            <select className="form-control" value={preset} onChange={(e) => handlePresetChange(e.target.value)}>
              {ALERT_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Parent Meeting - Grade 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Write the alert message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value as AlertPriority)}>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Send To</label>
            <select className="form-control" value={audience} onChange={(e) => { setAudience(e.target.value as (typeof AUDIENCES)[number]['value']); setRecipientId(''); }}>
              {AUDIENCES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          {audience === 'INDIVIDUAL' && (
            <div className="form-group">
              <label>Recipient</label>
              <select
                className="form-control"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                disabled={isLoadingRecipients}
              >
                <option value="">{isLoadingRecipients ? 'Loading...' : 'Select a person'}</option>
                {recipients.map((r) => (
                  <option key={r.accountId} value={r.accountId}>
                    {r.name} ({r.role === 'TEACHER' ? 'Staff' : 'Parent'}) — {r.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formError && (
            <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>
          )}
          {successMessage && (
            <div style={{ color: '#059669', fontSize: '13px', marginBottom: '12px' }}>{successMessage}</div>
          )}

          <button type="submit" className="btn-primary" disabled={isSending}>
            <Send size={16} /> {isSending ? 'Sending...' : 'Send Alert'}
          </button>
        </form>
      </div>

      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Sent Alerts</h2>
        </div>

        {isLoadingSent && <p className="card-subtitle">Loading sent alerts...</p>}
        {!isLoadingSent && sentAlerts.length === 0 && <p className="card-subtitle">No alerts sent yet.</p>}

        {!isLoadingSent && sentAlerts.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Sent To</th>
                <th>Priority</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {sentAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <div className="text-bold">{alert.title}</div>
                    <div className="card-subtitle">{alert.body}</div>
                  </td>
                  <td>{alert.targetLabel}</td>
                  <td>
                    {alert.priority === 'HIGH' ? (
                      <span className="growth-badge inline negative"><AlertTriangle size={14} /> High</span>
                    ) : (
                      <span className="card-subtitle">Normal</span>
                    )}
                  </td>
                  <td>{alert.createdAt ? new Date(alert.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};
