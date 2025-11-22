import React, { useState } from 'react';
import { FormField } from '../../types';
import { CheckCircle, Send } from 'lucide-react';

interface ContactFormProps {
  id: string;
  title: string;
  fields: FormField[];
  submitLabel: string;
  successMessage: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ title, fields, submitLabel, successMessage }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form Data Submitted:", formData);
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center bg-green-50 rounded-xl border border-green-100 mt-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-800">Received!</h3>
        <p className="text-green-700 mt-2">{successMessage}</p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="mt-6 text-sm font-medium text-green-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  rows={4}
                  className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                />
              ) : field.type === 'select' ? (
                 <select
                   id={field.name}
                   name={field.name}
                   required={field.required}
                   className="w-full rounded-lg border-slate-300 border p-3 bg-white"
                   onChange={handleChange}
                 >
                    <option value="">Select an option</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending...' : (
                <>
                    {submitLabel} <Send className="ml-2 h-4 w-4" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
