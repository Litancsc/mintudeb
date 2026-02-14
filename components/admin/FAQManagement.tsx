'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FAQ>({ question: '', answer: '', order: 0, active: true });

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    setLoading(true);
    const res = await fetch('/api/admin/faqs');
    const data = await res.json();
    setFaqs(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/faqs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { ...form, _id: editing } : form),
    });
    if (res.ok) {
      toast.success('FAQ saved!');
      setForm({ question: '', answer: '', order: 0, active: true });
      setEditing(null);
      fetchFaqs();
    } else {
      toast.error('Error saving FAQ');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this FAQ?')) return;
    const res = await fetch('/api/admin/faqs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success('FAQ deleted');
      fetchFaqs();
    } else {
      toast.error('Error deleting FAQ');
    }
  }

  function startEdit(faq: FAQ) {
    setEditing(faq._id || null);
    setForm({ question: faq.question, answer: faq.answer, order: faq.order, active: faq.active });
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage FAQs</h1>
      <form onSubmit={handleSave} className="space-y-4 mb-8">
        <input
          type="text"
          className="input-field"
          placeholder="Question"
          value={form.question}
          onChange={e => setForm({ ...form, question: e.target.value })}
          required
        />
        <textarea
          className="input-field"
          placeholder="Answer"
          value={form.answer}
          onChange={e => setForm({ ...form, answer: e.target.value })}
          required
        />
        <input
          type="number"
          className="input-field"
          placeholder="Order"
          value={form.order}
          onChange={e => setForm({ ...form, order: Number(e.target.value) })}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })}
          />
          <span>Active</span>
        </label>
        <button type="submit" className="btn-primary">
          {editing ? 'Update FAQ' : 'Add FAQ'}
        </button>
        {editing && (
          <button type="button" className="btn-outline ml-2" onClick={() => { setEditing(null); setForm({ question: '', answer: '', order: 0, active: true }); }}>
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : faqs.length === 0 ? (
        <div>No FAQs found.</div>
      ) : (
        <ul className="space-y-4">
          {faqs.map(faq => (
            <li key={faq._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{faq.question}</span>
                <div>
                  <button className="btn-outline mr-2" onClick={() => startEdit(faq)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(faq._id!)}>Delete</button>
                </div>
              </div>
              <div className="text-gray-700 mb-2">{faq.answer}</div>
              <div className="text-xs text-gray-400">Order: {faq.order} | {faq.active ? 'Active' : 'Inactive'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
