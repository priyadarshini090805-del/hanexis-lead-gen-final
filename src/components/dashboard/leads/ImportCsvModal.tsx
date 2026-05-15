'use client';

import {
  useRef,
  useState,
} from 'react';

import Papa from 'papaparse';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  Upload,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface ImportCsvModalProps {
  open: boolean;

  onClose: () => void;

  onImported?: () => void;
}

export function ImportCsvModal({
  open,
  onClose,
  onImported,
}: ImportCsvModalProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState('');

  const [fileName, setFileName] =
    useState('');

  const [rowCount, setRowCount] =
    useState(0);

  async function handleFile(
    file: File
  ) {
    setFileName(file.name);

    setError('');

    setSuccess(false);

    Papa.parse(file, {
      header: true,

      skipEmptyLines: true,

      complete: async (
        results
      ) => {
        try {
          setLoading(true);

          const rows = (
            results.data as any[]
          ).map((row) => ({
            fullName:
              row.fullName || '',

            email:
              row.email || '',

            company:
              row.company || '',

            jobTitle:
              row.jobTitle || '',

            linkedinUrl:
              row.linkedinUrl ||
              '',

            instagramUrl:
              row.instagramUrl ||
              '',

            bio:
              row.bio || '',

            tags: row.tags
              ? row.tags
                  .split(';')
                  .map(
                    (
                      tag: string
                    ) =>
                      tag.trim()
                  )
              : [],
          }));

          setRowCount(
            rows.length
          );

          const response =
            await fetch(
              '/api/leads/import',
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body: JSON.stringify(
                  {
                    rows,
                  }
                ),
              }
            );

          if (!response.ok) {
            throw new Error(
              'Import failed'
            );
          }

          setSuccess(true);

          onImported?.();

          setTimeout(() => {
            onClose();

            setSuccess(
              false
            );

            setFileName('');

            setRowCount(
              0
            );
          }, 1200);
        } catch (err) {
          console.error(err);

          setError(
            'Unable to import CSV file.'
          );
        } finally {
          setLoading(false);
        }
      },
    });
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
              y: 10,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
            }}
            className="
              w-full max-w-2xl
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
                  CSV import
                </div>

                <h2
                  className="
                    mt-1 text-3xl
                    font-semibold
                    tracking-tight
                    text-neutral-950
                  "
                >
                  Import leads
                </h2>

                <p
                  className="
                    mt-3 max-w-lg
                    text-sm leading-7
                    text-neutral-500
                  "
                >
                  Upload a CSV file to
                  bulk import prospect
                  data into your lead
                  pipeline.
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

            {/* Upload Area */}

            <div className="p-7">

              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="
                  flex w-full
                  flex-col items-center
                  justify-center
                  rounded-[30px]
                  border-2 border-dashed
                  border-neutral-300
                  bg-neutral-50
                  px-8 py-16
                  text-center
                  transition-all
                  hover:border-neutral-400
                  hover:bg-white
                "
              >

                <div
                  className="
                    flex h-16 w-16
                    items-center
                    justify-center
                    rounded-3xl
                    bg-neutral-900
                    text-white
                  "
                >

                  {loading ? (
                    <Loader2
                      className="
                        h-7 w-7
                        animate-spin
                      "
                    />
                  ) : success ? (
                    <CheckCircle2
                      className="
                        h-7 w-7
                      "
                    />
                  ) : (
                    <Upload
                      className="
                        h-7 w-7
                      "
                    />
                  )}
                </div>

                <div
                  className="
                    mt-6 text-xl
                    font-semibold
                    tracking-tight
                    text-neutral-950
                  "
                >
                  {loading
                    ? 'Importing CSV...'
                    : success
                    ? 'Import completed'
                    : 'Upload CSV file'}
                </div>

                <p
                  className="
                    mt-3 max-w-md
                    text-sm leading-7
                    text-neutral-500
                  "
                >
                  Supported columns:
                  fullName, email,
                  company, jobTitle,
                  linkedinUrl,
                  instagramUrl, bio,
                  tags
                </p>

                {fileName && (
                  <div
                    className="
                      mt-7 inline-flex
                      items-center gap-2
                      rounded-full
                      border border-neutral-200
                      bg-white
                      px-4 py-2
                      text-sm
                      font-medium
                      text-neutral-700
                    "
                  >
                    <FileSpreadsheet className="h-4 w-4" />

                    {fileName}

                    {rowCount > 0 &&
                      ` • ${rowCount} rows`}
                  </div>
                )}
              </button>

              {/* Hidden Input */}

              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => {
                  const file =
                    e.target
                      .files?.[0];

                  if (file) {
                    handleFile(
                      file
                    );
                  }
                }}
              />

              {/* Error */}

              {error && (
                <div
                  className="
                    mt-5 rounded-2xl
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
                  mt-7 flex
                  justify-end
                  border-t border-neutral-200
                  pt-6
                "
              >

                <button
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
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}