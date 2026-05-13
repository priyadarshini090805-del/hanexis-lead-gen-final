'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = [
  '#111827',
  '#374151',
  '#6b7280',
  '#9ca3af',
  '#d1d5db',
];

const STATUS_ORDER = [
  'NEW',
  'CONTACTED',
  'RESPONDED',
  'CONVERTED',
  'ARCHIVED',
] as const;

export function DashboardCharts({
  byStatus,
}: {
  byStatus: Array<{
    status: string;
    _count: {
      status: number;
    };
  }>;
}) {

  const data = STATUS_ORDER.map((status) => ({
    name: status,
    value:
      byStatus.find((b) => b.status === status)?._count.status ?? 0,
  }));

  const activeData = data.filter((d) => d.value > 0);

  return (
    <div className="grid gap-6 xl:grid-cols-3">

      {/* Distribution */}

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Pipeline Distribution
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Current lead allocation by status.
          </p>
        </div>

        <div className="h-64">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={activeData}
                dataKey="value"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {activeData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="mt-4 space-y-2">
          {activeData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-gray-700">
                  {item.name}
                </span>
              </div>

              <span className="font-medium text-gray-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Analytics */}

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Lead Status Analytics
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Breakdown of pipeline movement across all stages.
          </p>
        </div>

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: '#6b7280',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: '#6b7280',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                }}
              />

              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                fill="#111827"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}