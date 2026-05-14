'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function AddLeadModal({
  open,
  onClose,
  onCreated,
}: AddLeadModalProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    linkedinUrl: '',
    instagramUrl: '',
    bio: '',
    tags: '',
  });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/leads', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          ...form,

          tags: form.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create lead');
      }

      onCreated?.();

      onClose();

      setForm({
        fullName: '',
        email: '',
        company: '',
        jobTitle: '',
        linkedinUrl: '',
        instagramUrl: '',
        bio: '',
        tags: '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-sm
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >
            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-5
              "
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Lead
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create and manage high-quality outreach leads.
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  rounded-xl
                  p-2
                  text-gray-500
                  transition
                  hover:bg-gray-100
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name">
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fullName: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Sarah Johnson"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="sarah@company.com"
                  />
                </Field>

                <Field label="Company">
                  <input
                    value={form.company}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        company: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="TechFlow AI"
                  />
                </Field>

                <Field label="Job Title">
                  <input
                    value={form.jobTitle}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        jobTitle: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Marketing Director"
                  />
                </Field>

                <Field label="LinkedIn URL">
                  <input
                    value={form.linkedinUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        linkedinUrl: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="https://linkedin.com/in/..."
                  />
                </Field>

                <Field label="Instagram URL">
                  <input
                    value={form.instagramUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        instagramUrl: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="https://instagram.com/..."
                  />
                </Field>
              </div>

              <Field label="Tags">
                <input
                  value={form.tags}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="startup, saas, ai"
                />
              </Field>

              <Field label="Bio / Notes">
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bio: e.target.value,
                    })
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="Short lead summary..."
                />
              </Field>

              {/* Footer */}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-100
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-fuchsia-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    transition
                    hover:scale-[1.02]
                    disabled:opacity-50
                  "
                >
                  <Plus className="h-4 w-4" />

                  {loading
                    ? 'Creating...'
                    : 'Create Lead'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputClass = `
  w-full
  rounded-2xl
  border
  border-gray-200
  bg-gray-50
  px-4
  py-3
  text-sm
  text-gray-800
  outline-none
  transition-all
  placeholder:text-gray-400
  focus:border-violet-300
  focus:bg-white
  focus:ring-4
  focus:ring-violet-100
`;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      {children}
    </label>
  );
}