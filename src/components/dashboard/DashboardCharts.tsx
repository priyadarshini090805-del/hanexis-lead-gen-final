'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = [
  '#111111',
  '#404040',
  '#737373',
  '#a3a3a3',
  '#d4d4d4',
];

const STATUS_ORDER = [
  'NEW',
  'CONTACTED',
  'RESPONDED',
  'CONVERTED',
  'ARCHIVED',
] as const;

function percentage(
  value: number,
  total: number
) {
  if (!total) return 0;

  return Math.round(
    (value / total) * 100
  );
}

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
  const data =
    STATUS_ORDER.map(
      (status) => ({
        name: status,

        value:
          byStatus.find(
            (item) =>
              item.status ===
              status
          )?._count.status ?? 0,
      })
    );

  const total =
    data.reduce(
      (acc, item) =>
        acc + item.value,
      0
    );

  const activeData =
    data.filter(
      (item) =>
        item.value > 0
    );

  return (
    <div className="grid gap-6 xl:grid-cols-3">

      {/* Distribution */}

      <div
        className="
          rounded-[30px]
          border border-neutral-200
          bg-white p-6
        "
      >

        <div>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Distribution
          </div>

          <h3
            className="
              mt-1 text-2xl
              font-semibold
              tracking-tight
              text-neutral-950
            "
          >
            Lead pipeline
          </h3>
        </div>

        <div className="mt-8 h-[260px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={activeData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                strokeWidth={0}
              >
                {activeData.map(
                  (
                    _,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius:
                    16,

                  border:
                    '1px solid #e5e5e5',

                  background:
                    '#ffffff',

                  fontSize:
                    '12px',
                }}
              />

            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-3">

          {activeData.map(
            (
              item,
              index
            ) => (
              <div
                key={
                  item.name
                }
                className="
                  flex items-center
                  justify-between
                "
              >

                <div
                  className="
                    flex items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      h-3 w-3
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        COLORS[
                          index %
                            COLORS.length
                        ],
                    }}
                  />

                  <div>

                    <div
                      className="
                        text-sm
                        font-medium
                        text-neutral-800
                      "
                    >
                      {
                        item.name
                      }
                    </div>

                    <div
                      className="
                        text-xs
                        text-neutral-500
                      "
                    >
                      {percentage(
                        item.value,
                        total
                      )}
                      % of total
                    </div>
                  </div>
                </div>

                <div
                  className="
                    text-sm
                    font-semibold
                    text-neutral-950
                  "
                >
                  {item.value}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Analytics */}

      <div
        className="
          rounded-[30px]
          border border-neutral-200
          bg-white p-6
          xl:col-span-2
        "
      >

        <div>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Analytics
          </div>

          <h3
            className="
              mt-1 text-2xl
              font-semibold
              tracking-tight
              text-neutral-950
            "
          >
            Status overview
          </h3>
        </div>

        <div className="mt-8 h-[360px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
                strokeDasharray="4 4"
                stroke="#f3f3f3"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: '#737373',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: '#737373',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius:
                    16,

                  border:
                    '1px solid #e5e5e5',

                  background:
                    '#ffffff',

                  fontSize:
                    '12px',
                }}
              />

              <Bar
                dataKey="value"
                radius={[
                  10,
                  10,
                  0,
                  0,
                ]}
                fill="#111111"
              />

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}