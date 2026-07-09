import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';

const MODULE_OPTIONS = ['drugs', 'trials', 'companies', 'drugprice', 'cot', 'irp'];

// This is deliberately NOT the instant "Ask AI" panel — it's a ticket to a human
// analyst team, hence the 24-48h SLA messaging rather than an immediate answer.
export default function AskAnalystModal({ open, onClose, modules, currentModuleKey, showToast }) {
  const [relatedModule, setRelatedModule] = useState('');
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (open) setRelatedModule(modules[currentModuleKey] ? currentModuleKey : '');
  }, [open, currentModuleKey, modules]);

  const submit = () => {
    if (!question.trim()) {
      showToast('Add your question before submitting.');
      return;
    }
    onClose();
    setQuestion('');
    showToast('Question submitted — our analyst team will reply within 24–48 hours.');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ask an Analyst"
      subtitle="Get a personalized answer from our analyst team — not AI-generated"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit}>
            Submit question
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Related module (optional)</label>
        <select
          value={relatedModule}
          onChange={(e) => setRelatedModule(e.target.value)}
          style={{
            width: '100%',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '9px 11px',
            fontSize: 13,
            background: 'var(--surface)',
          }}
        >
          <option value="">General question</option>
          {MODULE_OPTIONS.map((key) => (
            <option key={key} value={key}>
              {modules[key].label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Your question</label>
        <textarea
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Can you help me understand the biosimilar risk for Trevocitinib in the EU5 markets over the next 18 months?"
          style={{
            width: '100%',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 13,
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      <div className="note">
        <b style={{ fontFamily: 'inherit' }}>⏱ Standard reply time: 24–48 hours</b> during customer support hours
        (Mon–Fri, 9am–6pm ET). You&apos;ll receive a reply by email and in your notifications.
      </div>
    </Modal>
  );
}
