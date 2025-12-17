import { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  Table,
  Tag,
  Spin,
  Typography,
  Empty,
  Button,
  Space,
  Badge,
  Tabs,
  Statistic,
} from "antd";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  TeamOutlined,
  ExportOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { LocateFixed } from "lucide-react";

const { Title, Text } = Typography;

const API = "http://173.249.6.61:1337/api";
const TOTAL_WORK = 14;

// Color palette matching Locations Page
const STAT_CARD_COLORS = [
  { bg: "#FFF7E6", border: "#FFD591", accent: "#FB9F3D" }, // Orange
  { bg: "#E6F9F9", border: "#87E8DE", accent: "#1E9CAD" }, // Teal
  { bg: "#F9F0FF", border: "#D3ADF7", accent: "#8B5CF6" }, // Purple
  { bg: "#E6F7FF", border: "#91D5FF", accent: "#1677ff" }, // Blue
];

const CARD_COLORS = {
  orange: { bg: "#FFF7E6", border: "#FFD591", accent: "#FB9F3D" },
  teal: { bg: "#E6F9F9", border: "#87E8DE", accent: "#1E9CAD" },
  purple: { bg: "#F9F0FF", border: "#D3ADF7", accent: "#8B5CF6" },
};

const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload; // 🔥 this holds full row data

    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "12px 16px",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          border: `3px solid ${payload[0]?.color || "#FB9F3D"}`,
          maxWidth: 220,
        }}
      >
        {/* FULL LOCATION NAME */}
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#262626",
            fontSize: 13,
            wordWrap: "break-word",
          }}
        >
          {data?.fullName}
        </p>

        {/* VALUE */}
        <p
          style={{
            margin: "6px 0 0 0",
            color: payload[0]?.color,
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Completed: {payload[0]?.value}
        </p>
      </div>
    );
  }
  return null;
};

export default function A5() {
  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/locations?populate=*`).then((r) => r.json()),
      fetch(`${API}/tasks?populate=*`).then((r) => r.json()),
      fetch(`${API}/surveys?populate=*`).then((r) => r.json()),
    ])
      .then(([l, t, s]) => {
        setLocations(l?.data || []);
        setTasks(t?.data || []);
        setSurveys(s?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const siteProgress = useMemo(() => {
    return locations.map((loc) => {
      const taskCount = tasks.filter(
        (t) => t.location?.documentId === loc.documentId
      ).length;
      const surveyDone = surveys.some(
        (s) => s.location?.documentId === loc.documentId
      );
      const completed = taskCount + (surveyDone ? 1 : 0);
      const percent = Math.round((completed / TOTAL_WORK) * 100);
      return { key: loc.documentId, name: loc.name, completed, percent };
    });
  }, [locations, tasks, surveys]);

  const totalLocations = locations.length;
  const sitesCompleted = siteProgress.filter((s) => s.percent === 100).length;
  const sitesInProgress = siteProgress.filter(
    (s) => s.percent > 0 && s.percent < 100
  ).length;
  const sitesPending = totalLocations - sitesCompleted - sitesInProgress;

  const completedWork = siteProgress.reduce((sum, s) => sum + s.completed, 0);
  const overallWork = totalLocations * TOTAL_WORK;
  const overallPercent = Math.round((completedWork / overallWork) * 100);

  const statusChart = [
    { name: "Completed", value: sitesCompleted, fill: "#52c41a" },
    { name: "In Progress", value: sitesInProgress, fill: "#FB9F3D" },
    { name: "Pending", value: sitesPending, fill: "#d9d9d9" },
  ];

  const PieTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div
          style={{
            background: "#fff",
            padding: 10,
            borderRadius: 8,
            border: "2px solid #FB9F3D",
            fontWeight: 600,
          }}
        >
          {payload[0].name}: {payload[0].value} sites
        </div>
      );
    }
    return null;
  };

  // const barChartData = siteProgress.slice(0, 10).map((site) => ({
  //   name: site.name.length > 20 ? `${site.name.slice(0, 16)}...` : site.name,
  //   completed: site.completed,
  //   remaining: TOTAL_WORK - site.completed,
  // }));

  const barChartData = siteProgress.slice(0, 10).map((site) => ({
    fullName: site.name, // ✅ full name for hover
    name: site.name.length > 15 ? `${site.name.slice(0, 12)}...` : site.name, // short label for X-axis
    completed: site.completed,
    remaining: TOTAL_WORK - site.completed,
  }));

  const columns = [
    {
      title: "#",
      render: (_, __, i) => (
        <span style={{ fontWeight: 600, color: "#FB9F3D" }}>{i + 1}</span>
      ),
      width: 50,
      align: "center",
    },
    {
      title: "Location Name",
      dataIndex: "name",
      ellipsis: true,
      key: "name",
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#262626" }}>{text}</span>
      ),
    },
    {
      title: "Task Status",
      dataIndex: "completed",
      render: (v) => (
        <Tag
          icon={<CheckCircleOutlined />}
          color="#FB9F3D"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            fontWeight: 600,
            color: "black",
          }}
        >
          {v} / {TOTAL_WORK}
        </Tag>
      ),
      width: 130,
      align: "center",
    },
    {
      title: "Progress",
      dataIndex: "percent",
      render: (p) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Progress
            percent={p}
            size="small"
            strokeColor={p === 100 ? "#52c41a" : p > 0 ? "#FB9F3D" : "#d9d9d9"}
            format={() => `${p}%`}
            style={{ flex: 1 }}
          />
        </div>
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "percent",
      render: (p) => {
        let color = "default";
        let text = "Pending";
        if (p === 100) {
          color = "green";
          text = "Completed";
        } else if (p > 0) {
          color = "orange";
          text = "In Progress";
        }
        return (
          <Tag color={color} style={{ fontWeight: 600, color: "black" }}>
            {text}
          </Tag>
        );
      },
      width: 130,
      align: "center",
    },
  ];

  const allWork = useMemo(() => {
    return [
      ...tasks.map((t) => ({ type: "task", createdAt: t.createdAt })),
      ...surveys.map((s) => ({ type: "survey", createdAt: s.createdAt })),
    ];
  }, [tasks, surveys]);

  const hourlyStats = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({
      hour: `${String(h).padStart(2, "0")}:00`,
      count: 0,
    }));
    const today = new Date().toISOString().slice(0, 10);
    allWork.forEach((w) => {
      const date = new Date(w.createdAt);
      if (date.toISOString().slice(0, 10) === today) {
        hours[date.getHours()].count += 1;
      }
    });
    return hours;
  }, [allWork]);

  const dayWiseStats = useMemo(() => {
    const days = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        d.getDay()
      ];
      days[key] = { date: dayName, fullDate: key.slice(5), count: 0 };
    }
    allWork.forEach((w) => {
      const d = w.createdAt?.slice(0, 10);
      if (days[d]) days[d].count += 1;
    });
    return Object.values(days);
  }, [allWork]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(
  circle at left,
  #fff3c4 0%,
  transparent 45%
),
linear-gradient(
  135deg,
  #FBD177 0%,
  #FFF1C6 30%,
  #FFFAED 60%,
  #FFFFFF 100%
)`,
        }}
      >
        <Spin size="large" style={{ color: "#FB9F3D" }} />
      </div>
    );
  }

  const KPICard = ({ icon, title, value, suffix = "", colorIndex }) => {
    const color = STAT_CARD_COLORS[colorIndex];
    return (
      <Card
        hoverable
        style={{
          borderRadius: 12,
          border: `2px solid ${color.border}`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          height: "100%",
          background: color.bg,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Statistic
          title={
            <span
              style={{
                color: color.accent,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </span>
          }
          value={value}
          suffix={suffix}
          prefix={
            icon ? (
              <span style={{ color: color.accent, marginRight: 8 }}>
                {icon}
              </span>
            ) : null
          }
          valueStyle={{
            color: color.accent,
            fontSize: 32,
            fontWeight: 700,
          }}
        />
      </Card>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: ` radial-gradient(circle at left center, rgb(242 237 217) 0%, transparent 45%), linear-gradient(135deg, rgb(244 231 201) 0%, rgb(255, 241, 198) 30%, rgb(255, 250, 237) 60%, rgb(255, 255, 255) 100%)`,

        //         background: `radial-gradient(
        //   circle at left,
        //   #fff3c4 0%,
        //   transparent 45%
        // ),
        // linear-gradient(
        //   135deg,
        //   #FBD177 0%,
        //   #FFF1C6 30%,
        //   #FFFAED 60%,
        //   #FFFFFF 100%
        // )`,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* ================= HEADER ================= */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              color: "#262626",
            }}
          >
            Analytics Dashboard
          </h1>
          <p style={{ color: "#8c8c8c", margin: "8px 0 0 0", fontSize: 14 }}>
            Real-time project monitoring and performance analytics
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Total Locations"
              value={totalLocations}
              icon={<EnvironmentOutlined />}
              colorIndex={0}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Completed Sites"
              value={sitesCompleted}
              icon={<CheckCircleOutlined />}
              colorIndex={1}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="In Progress"
              value={sitesInProgress}
              icon={<FireOutlined />}
              colorIndex={2}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Overall Progress"
              value={overallPercent}
              suffix="%"
              icon={<TrophyOutlined />}
              colorIndex={3}
            />
          </Col>
        </Row>

        {/* ================= ANALYTICS TABS ================= */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 32 }}
          tabBarStyle={{
            borderBottom: `2px solid #FFD591`,
            background: "#fff",
            borderRadius: "12px 12px 0 0",
            padding: "0 16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
          items={[
            {
              key: "overview",
              label: (
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  <BarChartOutlined /> Charts & Analytics
                </span>
              ),
              children: (
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#262626",
                          }}
                        >
                          📈 Daily Activity
                        </span>
                      }
                      style={{
                        background: "#fff",
                        border: `2px solid ${CARD_COLORS.teal.border}`,
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      }}
                      headStyle={{
                        borderBottom: `2px solid ${CARD_COLORS.teal.border}`,
                        background: CARD_COLORS.teal.bg,
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={hourlyStats}>
                          <defs>
                            <linearGradient
                              id="colorArea"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#1E9CAD"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#1E9CAD"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="hour" stroke="#666" opacity={0.6} />
                          <YAxis stroke="#666" opacity={0.6} />
                          <ChartTooltip content={<CustomChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#1E9CAD"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorArea)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#262626",
                          }}
                        >
                          📅 Weekly Trend
                        </span>
                      }
                      style={{
                        background: "#fff",
                        border: `2px solid ${CARD_COLORS.purple.border}`,
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      }}
                      headStyle={{
                        borderBottom: `2px solid ${CARD_COLORS.purple.border}`,
                        background: CARD_COLORS.purple.bg,
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dayWiseStats}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="date" stroke="#666" opacity={0.6} />
                          <YAxis stroke="#666" opacity={0.6} />
                          <ChartTooltip content={<CustomChartTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ fill: "#8B5CF6", r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              ),
            },

            {
              key: "distribution",
              label: (
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  <PieChartOutlined /> Distribution & Status
                </span>
              ),
              children: (
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#262626",
                          }}
                        >
                          🎯 Project Status
                        </span>
                      }
                      style={{
                        background: "#fff",
                        border: `2px solid ${CARD_COLORS.orange.border}`,
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      }}
                      headStyle={{
                        borderBottom: `2px solid ${CARD_COLORS.orange.border}`,
                        background: CARD_COLORS.orange.bg,
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      <ResponsiveContainer width="100%" height={242}>
                        <PieChart>
                          <Pie data={statusChart} dataKey="value" />
                          <ChartTooltip content={<PieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          justifyContent: "space-around",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 900,
                              color: "#52c41a",
                            }}
                          >
                            {sitesCompleted}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#666",
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            Complete
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 900,
                              color: "#FB9F3D",
                            }}
                          >
                            {sitesInProgress}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#666",
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            In Progress
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 900,
                              color: "#d9d9d9",
                            }}
                          >
                            {sitesPending}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#666",
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            Pending
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#262626",
                          }}
                        >
                          📊 Completion Rate
                        </span>
                      }
                      style={{
                        background: "#fff",
                        border: `2px solid #91D5FF`,
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      }}
                      headStyle={{
                        borderBottom: `2px solid #91D5FF`,
                        background: "#E6F7FF",
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="name" stroke="#666" opacity={0.6} />
                          <YAxis stroke="#666" opacity={0.6} />
                          <ChartTooltip content={<CustomChartTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="completed"
                            stackId="a"
                            fill="#52c41a"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="remaining"
                            stackId="a"
                            fill="#cbd5e1"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />

        {/* ================= DATA TABLE ================= */}
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 4,
                  height: 24,
                  background: "#FB9F3D",
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#262626",
                }}
              >
                Project Sites - Detailed Progress
              </span>
            </div>
          }
          style={{
            background: "#fff",
            border: `2px solid #FFD591`,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            marginBottom: 32,
          }}
          headStyle={{
            borderBottom: `2px solid #FFD591`,
            background: "#FFF7E6",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            columns={columns}
            dataSource={siteProgress}
            scroll={{ x: 800 }}
            rowKey="key"
            style={{ color: "#262626" }}
            // pagination={{
            //   pageSize: 10,
            //   position: ["bottomCenter"],
            //   style: { color: "#262626" },
            //   showSizeChanger: true,
            //   showTotal: (total) => (
            //     <span style={{ color: "#262626", fontWeight: 600 }}>
            //       Total {total} locations
            //     </span>
            //   ),
            // }}
          />
        </Card>

        {/* ================= FOOTER STATS ================= */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: CARD_COLORS.teal.bg,
                border: `2px solid ${CARD_COLORS.teal.border}`,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#262626",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Tasks
                  </span>
                }
                value={tasks.length}
                suffix={
                  <span style={{ fontSize: 16, color: "#262626" }}>
                    {" "}
                    / {totalLocations * TOTAL_WORK}
                  </span>
                }
                valueStyle={{ color: CARD_COLORS.teal.accent, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: CARD_COLORS.purple.bg,
                border: `2px solid ${CARD_COLORS.purple.border}`,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#262626",
                      textTransform: "uppercase",
                    }}
                  >
                    Surveys Completed
                  </span>
                }
                value={surveys.length}
                valueStyle={{
                  color: CARD_COLORS.purple.accent,
                  fontSize: 28,
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: CARD_COLORS.orange.bg,
                border: `2px solid ${CARD_COLORS.orange.border}`,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#262626",
                      textTransform: "uppercase",
                    }}
                  >
                    Avg Progress
                  </span>
                }
                value={Math.round(
                  siteProgress.reduce((sum, s) => sum + s.percent, 0) /
                    (siteProgress.length || 1)
                )}
                suffix="%"
                valueStyle={{
                  color: CARD_COLORS.orange.accent,
                  fontSize: 28,
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "#FFE6E6",
                border: `2px solid #FFA8A8`,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#262626",
                      textTransform: "uppercase",
                    }}
                  >
                    Pending Sites
                  </span>
                }
                value={sitesPending}
                valueStyle={{ color: "#FF6B6B", fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
