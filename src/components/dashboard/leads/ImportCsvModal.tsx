'use client';

import {
  useCallback,
  useState,
} from 'react';

import { useDropzone } from 'react-dropzone';

import Papa from 'papaparse';

import toast from 'react-hot-toast';

import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ParsedRow {
  fullName: string;

  email?: string;

  company?: string;

  jobTitle?: string;

  linkedinUrl?: string;

  instagramUrl?: string;

  bio?: string;
}

export function ImportCsvModal({
  open,
  onClose,
  onImported,
}: {
  open: boolean;

  onClose: () => void;

  onImported: () => void;
}) {
  const [rows, setRows] =
    useState<ParsedRow[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const onDrop = useCallback(
    (
      acceptedFiles: File[]
    ) => {
      const file =
        acceptedFiles[0];

      if (!file) return;

      Papa.parse(file, {
        header: true,

        skipEmptyLines:
          true,

        complete: (
          results
        ) => {
          const parsed =
            (
              results.data as any[]
            ).map(
              (
                row
              ) => ({
                fullName:
                  row.fullName ||
                  row.name ||
                  '',

                email:
                  row.email,

                company:
                  row.company,

                jobTitle:
                  row.jobTitle,

                linkedinUrl:
                  row.linkedinUrl,

                instagramUrl:
                  row.instagramUrl,

                bio:
                  row.bio,
              })
            );

          const validationErrors:
            string[] = [];

          const uniqueEmails =
            new Set();

          parsed.forEach(
            (
              row,
              index
            ) => {
              if (
                !row.fullName
              ) {
                validationErrors.push(
                  `Row ${
                    index + 1
                  }: Missing fullName`
                );
              }

              if (
                row.email
              ) {
                if (
                  uniqueEmails.has(
                    row.email
                  )
                ) {
                  validationErrors.push(
                    `Duplicate email: ${row.email}`
                  );
                }

                uniqueEmails.add(
                  row.email
                );
              }
            }
          );

          setErrors(
            validationErrors
          );

          setRows(parsed);
        },

        error: () => {
          toast.error(
            'Invalid CSV file'
          );
        },
      });
    },
    []
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },

    multiple: false,

    onDrop,
  });

  async function importRows() {
    try {
      setLoading(true);

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
        throw new Error();
      }

      toast.success(
        `${rows.length} leads imported`
      );

      setRows([]);

      onImported();

      onClose();
    } catch {
      toast.error(
        'Import failed'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center
        justify-center
        bg-black/40
        p-4
      "
    >

      <div
        className="
          w-full max-w-5xl
          rounded-[32px]
          bg-white
          p-7
          shadow-2xl
        "
      >

        {/* Header */}

        <div
          className="
            flex items-start
            justify-between
          "
        >

          <div>

            <div
              className="
                text-sm
                text-neutral-500
              "
            >
              Lead import
            </div>

            <h2
              className="
                mt-1 text-3xl
                font-semibold
                tracking-tight
                text-neutral-950
              "
            >
              Import CSV
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-2xl
              border border-neutral-200
              px-4 py-2
              text-sm
              text-neutral-600
              hover:bg-neutral-100
            "
          >
            Close
          </button>
        </div>

        {/* Upload */}

        <div
          {...getRootProps()}
          className={`
            mt-7 cursor-pointer
            rounded-[28px]
            border-2 border-dashed
            p-10 text-center
            transition-all

            ${
              isDragActive
                ? `
                  border-neutral-900
                  bg-neutral-100
                `
                : `
                  border-neutral-300
                  bg-neutral-50
                `
            }
          `}
        >

          <input
            {...getInputProps()}
          />

          <div
            className="
              mx-auto flex
              h-16 w-16
              items-center
              justify-center
              rounded-3xl
              bg-white
              shadow-sm
            "
          >
            <Upload className="h-7 w-7 text-neutral-700" />
          </div>

          <h3
            className="
              mt-5 text-lg
              font-medium
              text-neutral-900
            "
          >
            Drag and drop CSV
          </h3>

          <p
            className="
              mt-2 text-sm
              text-neutral-500
            "
          >
            Upload lead data with
            columns like fullName,
            email, company,
            jobTitle.
          </p>
        </div>

        {/* Errors */}

        {errors.length > 0 && (
          <div
            className="
              mt-5 rounded-3xl
              border border-red-200
              bg-red-50
              p-5
            "
          >

            <div
              className="
                flex items-center
                gap-2 text-red-700
              "
            >
              <AlertCircle className="h-4 w-4" />

              <span className="font-medium">
                Validation issues
              </span>
            </div>

            <div className="mt-3 space-y-2">

              {errors.map(
                (
                  error,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                      text-sm
                      text-red-600
                    "
                  >
                    {error}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Preview */}

        {rows.length > 0 && (
          <div className="mt-7">

            <div
              className="
                mb-4 flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex items-center
                  gap-2
                "
              >
                <FileSpreadsheet className="h-5 w-5 text-neutral-700" />

                <span
                  className="
                    font-medium
                    text-neutral-900
                  "
                >
                  CSV Preview
                </span>
              </div>

              <div
                className="
                  rounded-full
                  bg-neutral-100
                  px-3 py-1
                  text-sm
                  text-neutral-700
                "
              >
                {rows.length} rows
              </div>
            </div>

            <div
              className="
                max-h-[350px]
                overflow-auto
                rounded-3xl
                border border-neutral-200
              "
            >

              <table className="w-full">

                <thead
                  className="
                    sticky top-0
                    bg-neutral-100
                  "
                >
                  <tr>

                    {[
                      'Name',
                      'Email',
                      'Company',
                      'Role',
                    ].map(
                      (
                        heading
                      ) => (
                        <th
                          key={
                            heading
                          }
                          className="
                            px-4 py-3
                            text-left
                            text-sm
                            font-medium
                            text-neutral-700
                          "
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>

                  {rows
                    .slice(0, 10)
                    .map(
                      (
                        row,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="
                            border-t
                            border-neutral-100
                          "
                        >

                          <td className="px-4 py-3 text-sm">
                            {
                              row.fullName
                            }
                          </td>

                          <td className="px-4 py-3 text-sm text-neutral-600">
                            {
                              row.email
                            }
                          </td>

                          <td className="px-4 py-3 text-sm text-neutral-600">
                            {
                              row.company
                            }
                          </td>

                          <td className="px-4 py-3 text-sm text-neutral-600">
                            {
                              row.jobTitle
                            }
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>

            {/* CTA */}

            <div
              className="
                mt-6 flex
                justify-end
              "
            >

              <button
                disabled={
                  loading ||
                  errors.length >
                    0
                }
                onClick={
                  importRows
                }
                className="
                  inline-flex
                  h-12 items-center
                  gap-2 rounded-2xl
                  bg-neutral-950
                  px-5
                  text-sm
                  font-medium
                  text-white
                  disabled:opacity-50
                "
              >

                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {loading
                  ? 'Importing...'
                  : 'Import Leads'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}