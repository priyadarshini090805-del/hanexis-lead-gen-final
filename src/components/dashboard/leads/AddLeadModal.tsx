'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  X,
  Plus,
  Loader2,
} from 'lucide-react';

interface AddLeadModalProps {
  open: boolean;

  onClose: () => void;

  onCreated?: () => void;
}

const initialForm = {
  fullName: '',
  email: '',
  company: '',
  jobTitle: '',
  linkedinUrl: '',
  instagramUrl: '',
  bio: '',
  tags: '',
};

export function AddLeadModal({
  open,
  onClose,
  onCreated,
}: AddLeadModalProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [form, setForm] =
    useState(initialForm);

  useEffect(() => {
    if (!open) {
      setError('');
    }
  }, [open]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError('');

      const response =
        await fetch(
          '/api/leads',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              {
                ...form,

                tags:
                  form.tags
                    .split(',')
                    .map(
                      (
                        tag
                      ) =>
                        tag.trim()
                    )
                    .filter(
                      Boolean
                    ),
              }
            ),
          }
        );

      if (!response.ok) {
        throw new Error(
          'Unable to create lead'
        );
      }

      setForm(initialForm);

      onCreated?.();

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        'Something went wrong while creating the lead.'
      );
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
            fixed inset-0 z-50
            flex items-center
            justify-center
            bg-black/30
            p-4
            backdrop-blur-sm
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: 10,
            }}
            transition={{
              duration: 0.18,
            }}
            className="
              w-full max-w-3xl
              overflow-hidden
              rounded-[32px]
              border border-neutral-200
              bg-white
              shadow-2xl
            "
          >

            {/* Header */}

            <div
              className="
                flex items-start
                justify-between
                border-b border-neutral-200
                px-7 py-6
              "
            >

              <div>

                <div
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Lead creation
                </div>

                <h2
                  className="
                    mt-1 text-3xl
                    font-semibold
                    tracking-tight
                    text-neutral-950
                  "
                >
                  Add new lead
                </h2>

                <p
                  className="
                    mt-3 max-w-lg
                    text-sm leading-7
                    text-neutral-500
                  "
                >
                  Create a new prospect profile
                  and organize outreach details
                  for future engagement.
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  flex h-11 w-11
                  items-center
                  justify-center
                  rounded-2xl
                  border border-neutral-200
                  bg-white
                  text-neutral-500
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-900
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                space-y-7
                px-7 py-7
              "
            >

              {/* Grid */}

              <div
                className="
                  grid gap-5
                  md:grid-cols-2
                "
              >

                <Field label="Full name">

                  <input
                    required
                    value={
                      form.fullName
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        fullName:
                          e.target
                            .value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="Sarah Johnson"
                  />
                </Field>

                <Field label="Email address">

                  <input
                    type="email"
                    value={
                      form.email
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        email:
                          e.target
                            .value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="sarah@company.com"
                  />
                </Field>

                <Field label="Company">

                  <input
                    value={
                      form.company
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        company:
                          e.target
                            .value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="TechFlow"
                  />
                </Field>

                <Field label="Job title">

                  <input
                    value={
                      form.jobTitle
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        jobTitle:
                          e.target
                            .value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="Marketing Director"
                  />
                </Field>

                <Field label="LinkedIn URL">

                  <input
                    value={
                      form.linkedinUrl
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        linkedinUrl:
                          e.target
                            .value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </Field>

                <Field label="Instagram URL">

                  <input
                    value={
                      form.instagramUrl
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        instagramUrl:
                          e.target
                            .value,
                      })
                    }
                    className={
                      inputClass
                    }
                    placeholder="https://instagram.com/..."
                  />
                </Field>
              </div>

              {/* Tags */}

              <Field label="Tags">

                <input
                  value={
                    form.tags
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      tags:
                        e.target
                          .value,
                    })
                  }
                  className={
                    inputClass
                  }
                  placeholder="startup, saas, outbound"
                />

                <p
                  className="
                    mt-2 text-xs
                    text-neutral-400
                  "
                >
                  Separate tags using commas.
                </p>
              </Field>

              {/* Notes */}

              <Field label="Notes">

                <textarea
                  rows={5}
                  value={form.bio}
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      bio: e.target
                        .value,
                    })
                  }
                  className={`
                    ${inputClass}
                    resize-none
                  `}
                  placeholder="Add context, conversation notes, or qualification details..."
                />
              </Field>

              {/* Error */}

              {error && (
                <div
                  className="
                    rounded-2xl
                    border border-red-200
                    bg-red-50
                    px-4 py-3
                    text-sm
                    text-red-700
                  "
                >
                  {error}
                </div>
              )}

              {/* Footer */}

              <div
                className="
                  flex flex-col-reverse
                  gap-3 border-t
                  border-neutral-200
                  pt-6 sm:flex-row
                  sm:items-center
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={onClose}
                  className="
                    h-12 rounded-2xl
                    border border-neutral-200
                    px-5
                    text-sm font-medium
                    text-neutral-700
                    transition
                    hover:bg-neutral-100
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex h-12
                    items-center
                    justify-center
                    gap-2 rounded-2xl
                    bg-neutral-950
                    px-5
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-black
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <Loader2
                      className="
                        h-4 w-4
                        animate-spin
                      "
                    />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}

                  {loading
                    ? 'Creating lead...'
                    : 'Create lead'}
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
  h-12 w-full
  rounded-2xl
  border border-neutral-200
  bg-neutral-50
  px-4
  text-sm
  text-neutral-900
  outline-none
  transition
  placeholder:text-neutral-400
  focus:border-neutral-300
  focus:bg-white
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

      <div
        className="
          mb-2 text-sm
          font-medium
          text-neutral-700
        "
      >
        {label}
      </div>

      {children}
    </label>
  );
}