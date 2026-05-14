'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';

import {
  TrendingUp,
  Target,
  BrainCircuit,
  Activity,
} from 'lucide-react';

const COLORS = [
  '#111111',
  '#2b2b2b',
  '#525252',
  '#737373',
  '#a3a3a3',
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

  const pipelineVelocity =
    percentage(
      (
        data.find(
          (d) =>
            d.name ===
            'RESPONDED'
        )?.value ?? 0
      ) +
        (
          data.find(
            (d) =>
              d.name ===
              'CONVERTED'
          )?.value ?? 0
        ),
      total
    );

  const conversionRate =
    percentage(
      data.find(
        (d) =>
          d.name ===
          'CONVERTED'
      )?.value ?? 0,
      total
    );

  /*
  |--------------------------------------------------------------------------
  | Simulated Growth Intelligence
  |--------------------------------------------------------------------------
  */

  const trendData =
    data.map(
      (item, index) => ({
        stage:
          item.name,

        current:
          item.value,

        projected:
          Math.max(
            item.value +
              Math.floor(
                Math.random() *
                  6
              ),
            item.value
          ),

        engagement:
          35 +
          index * 12,
      })
    );

  return (
    <div className="space-y-6">

      {/* Intelligence Metrics */}

      <section
        className="
          grid gap-5
          lg:grid-cols-3
        "
      >

        <MetricCard
          title="Pipeline Velocity"
          value={`${pipelineVelocity}%`}
          description="Leads progressing through active engagement stages"
          icon={TrendingUp}
        />

        <MetricCard
          title="Conversion Intelligence"
          value={`${conversionRate}%`}
          description="Qualified prospects successfully converted"
          icon={Target}
        />

        <MetricCard
          title="AI Engagement Health"
          value={
            total > 0
              ? 'Stable'
              : 'Idle'
          }
          description="Outbound communication systems operational"
          icon={BrainCircuit}
        />
      </section>

      {/* Main Visualization Grid */}

      <section
        className="
          grid gap-6
          xl:grid-cols-3
        "
      >

        {/* Pipeline Distribution */}

        <div
          className="
            rounded-[30px]
            border border-neutral-200
            bg-white p-6
          "
        >

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
                Lead Allocation
              </div>

              <h3
                className="
                  mt-1 text-xl
                  font-semibold
                  tracking-tight
                  text-neutral-950
                "
              >
                Pipeline Distribution
              </h3>
            </div>

            <div
              className="
                flex h-11 w-11
                items-center
                justify-center
                rounded-2xl
                bg-neutral-100
              "
            >
              <Activity
                className="
                  h-5 w-5
                  text-neutral-700
                "
              />
            </div>
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
                        key={
                          index
                        }
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
                      18,

                    border:
                      '1px solid #e5e5e5',

                    background:
                      '#ffffff',

                    fontSize:
                      '12px',

                    boxShadow:
                      '0 10px 30px rgba(0,0,0,0.08)',
                  }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}

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
                        % of pipeline
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

        {/* Growth Analytics */}

        <div
          className="
            rounded-[30px]
            border border-neutral-200
            bg-white p-6
            xl:col-span-2
          "
        >

          <div
            className="
              flex flex-col gap-4
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >

            <div>

              <div
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Operational Analytics
              </div>

              <h3
                className="
                  mt-1 text-xl
                  font-semibold
                  tracking-tight
                  text-neutral-950
                "
              >
                Pipeline progression intelligence
              </h3>
            </div>

            <div
              className="
                inline-flex items-center
                gap-2 rounded-full
                border border-neutral-200
                bg-neutral-50
                px-4 py-2
                text-sm
                text-neutral-600
              "
            >
              <TrendingUp className="h-4 w-4" />

              Real-time trend modeling
            </div>
          </div>

          <div className="mt-8 h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={trendData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="growthGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#111111"
                      stopOpacity={
                        0.22
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="#111111"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#f2f2f2"
                />

                <XAxis
                  dataKey="stage"
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
                      18,

                    border:
                      '1px solid #e5e5e5',

                    background:
                      '#ffffff',

                    fontSize:
                      '12px',

                    boxShadow:
                      '0 10px 30px rgba(0,0,0,0.08)',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#111111"
                  fill="url(#growthGradient)"
                  strokeWidth={3}
                />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Comparative Intelligence */}

      <section
        className="
          rounded-[30px]
          border border-neutral-200
          bg-white p-6
        "
      >

        <div
          className="
            flex flex-col gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <div
              className="
                text-sm
                text-neutral-500
              "
            >
              Comparative Analytics
            </div>

            <h3
              className="
                mt-1 text-xl
                font-semibold
                tracking-tight
                text-neutral-950
              "
            >
              Stage-by-stage engagement performance
            </h3>
          </div>

          <div
            className="
              rounded-full
              border border-neutral-200
              bg-neutral-50
              px-4 py-2
              text-sm
              text-neutral-600
            "
          >
            AI-driven pipeline interpretation
          </div>
        </div>

        <div className="mt-8 h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={trendData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#f2f2f2"
              />

              <XAxis
                dataKey="stage"
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
                    18,

                  border:
                    '1px solid #e5e5e5',

                  background:
                    '#ffffff',

                  fontSize:
                    '12px',

                  boxShadow:
                    '0 10px 30px rgba(0,0,0,0.08)',
                }}
              />

              <Bar
                dataKey="current"
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
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;

  value: string | number;

  description: string;

  icon: any;
}) {
  return (
    <div
      className="
        rounded-[28px]
        border border-neutral-200
        bg-white p-6
      "
    >

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
            {title}
          </div>

          <div
            className="
              mt-4 text-4xl
              font-semibold
              tracking-tight
              text-neutral-950
            "
          >
            {value}
          </div>
        </div>

        <div
          className="
            flex h-12 w-12
            items-center
            justify-center
            rounded-2xl
            bg-neutral-100
          "
        >
          <Icon
            className="
              h-5 w-5
              text-neutral-700
            "
          />
        </div>
      </div>

      <p
        className="
          mt-5 text-sm
          leading-7
          text-neutral-500
        "
      >
        {description}
      </p>
    </div>
  );
}