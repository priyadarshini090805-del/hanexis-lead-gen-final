'use client';

import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState('');

  async function handleFile(
    file: File
  ) {
    setFileName(file.name);

    Papa.parse(file, {
      header: true,

      skipEmptyLines: true,

      complete: async (results) => {
        try {
          setLoading(true);

          const rows = (results.data as any[]).map((row) => ({
            fullName: row.fullName || '',
            email: row.email || '',
            company: row.company || '',
            jobTitle: row.jobTitle || '',
            linkedinUrl: row.linkedinUrl || '',
            instagramUrl: row.instagramUrl || '',
            bio: row.bio || '',

            tags: row.tags
              ? row.tags
                  .split(';')
                  .map((tag: string) => tag.trim())
              : [],
          }));

          const res = await fetch(
            '/api/leads/import',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                rows,
              }),
            }
          );

          if (!res.ok) {
            throw new Error(
              'Import failed'
            );
          }

          onImported?.();

          onClose();
        } catch (error) {
          console.error(error);
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
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            className="
              w-full
              max-w-xl
              rounded-3xl
              bg-white
              p-6
              shadow-2xl
            "
          >
            {/* Header */}

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Import Leads
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload CSV files and
                  instantly populate your
                  pipeline.
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  rounded-xl
                  p-2
                  text-gray-500
                  hover:bg-gray-100
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Upload */}

            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="
                flex
                w-full
                flex-col
                items-center
                justify-center
                rounded-3xl
                border-2
                border-dashed
                border-violet-200
                bg-violet-50/40
                px-6
                py-14
                text-center
                transition-all
                hover:border-violet-400
                hover:bg-violet-50
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-600
                  to-fuchsia-600
                  text-white
                  shadow-lg
                "
              >
                <Upload className="h-7 w-7" />
              </div>

              <div className="text-lg font-semibold text-gray-900">
                Click to upload CSV
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Supported columns:
                fullName, email,
                company, jobTitle,
                linkedinUrl,
                instagramUrl, bio,
                tags
              </div>

              {fileName && (
                <div
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-violet-700
                    shadow-sm
                  "
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  {fileName}
                </div>
              )}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  handleFile(file);
                }
              }}
            />

            {/* Footer */}

            <div className="mt-6 flex justify-end gap-3">
              <button
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
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>

              <button
                disabled
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  opacity-80
                "
              >
                {loading
                  ? 'Importing...'
                  : 'Ready to Import'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}