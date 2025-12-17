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
  Drawer,
  Statistic,
  Timeline,
  Tooltip,
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
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  CalendarOutlined,
  ExportOutlined,
  ReloadOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  DashboardOutlined,
  InsuranceOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const API = "http://173.249.6.61:1337/api";
const TOTAL_WORK = 14;

// Government-style color palette
const COLORS = {
  primary: "#1e3a8a", // Deep Navy
  secondary: "#7c2d12", // Deep Orange
  success: "#15803d", // Deep Green
  warning: "#b45309", // Dark Orange
  danger: "#991b1b", // Deep Red
  info: "#0369a1", // Deep Blue
  light: "#f8fafc", // Very Light Gray
  border: "#cbd5e1", // Light Gray
  text: "#1e293b", // Dark Text
};

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

const CARD_GRADIENTS = {
  blue: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  orange: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  green: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
  purple: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
  cyan: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  rose: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
};

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "12px 16px",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          border: `3px solid ${payload[0]?.color || COLORS.primary}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: COLORS.text,
            fontSize: 13,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "6px 0 0 0",
            color: payload[0]?.color,
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          {payload[0]?.value}
        </p>
      </div>
    );
  }
  return null;
};

export default function A4() {
  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    { name: "Completed", value: sitesCompleted, fill: COLORS.success },
    { name: "In Progress", value: sitesInProgress, fill: COLORS.warning },
    { name: "Pending", value: sitesPending, fill: COLORS.danger },
  ];

  const barChartData = siteProgress.slice(0, 10).map((site) => ({
    name: site.name.length > 15 ? `${site.name.slice(0, 12)}...` : site.name,
    completed: site.completed,
    remaining: TOTAL_WORK - site.completed,
    percent: site.percent,
  }));

  const columns = [
    {
      title: "#",
      render: (_, __, i) => (
        <span style={{ fontWeight: 600, color: COLORS.primary }}>{i + 1}</span>
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
        <span style={{ fontWeight: 500, color: COLORS.text }}>{text}</span>
      ),
    },
    {
      title: "Task Status",
      dataIndex: "completed",
      render: (v) => (
        <Tag
          icon={<CheckCircleOutlined />}
          color="blue"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            fontWeight: 600,
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
            strokeColor={
              p === 100
                ? COLORS.success
                : p > 0
                ? COLORS.warning
                : COLORS.danger
            }
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
        let color = "red";
        let icon = <ClockCircleOutlined />;
        let text = "Pending";
        if (p === 100) {
          color = "green";
          icon = <CheckCircleOutlined />;
          text = "Completed";
        } else if (p > 0) {
          color = "orange";
          icon = <FireOutlined />;
          text = "In Progress";
        }
        return (
          <Tag icon={icon} color={color} style={{ fontWeight: 600 }}>
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
          background: `linear-gradient(135deg, ${COLORS.light} 0%, #e0f2fe 100%)`,
        }}
      >
        <Spin size="large" style={{ color: COLORS.primary }} />
      </div>
    );
  }

  const KPICard = ({ icon, title, value, color, suffix = "", gradient }) => (
    <Card
      hoverable
      style={{
        background: "#fff",
        border: "2px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.12)";
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: color,
          opacity: 0.05,
          borderRadius: "50%",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <Text
            style={{
              fontSize: 12,
              color: COLORS.text,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {title}
          </Text>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color,
              }}
            >
              {value}
              {suffix}
            </div>
            <Tooltip title="vs last week">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: "#f0fdf4",
                  cursor: "pointer",
                }}
              >
                <ArrowUpOutlined
                  style={{
                    color: COLORS.success,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.success,
                  }}
                >
                  12%
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: "#fff",
            boxShadow: `0 8px 20px ${color}30`,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  // 135deg,
  // #fff7da 0%,
  // #fffaf0 40%,
  // #ffffff 100%

  return (
    <div
      // className="bg-slate-100"

      style={{
        minHeight: "100vh",
        background: ` radial-gradient(circle at left center, rgb(242 237 217) 0%, transparent 45%), linear-gradient(135deg, rgb(244 231 201) 0%, rgb(255, 241, 198) 30%, rgb(255, 250, 237) 60%, rgb(255, 255, 255) 100%)`,

        //         background: ` radial-gradient(
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
        color: COLORS.text,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: `3px solid ${COLORS.primary}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: CARD_GRADIENTS.blue,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)",
                }}
              >
                <DashboardOutlined />
              </div>
              <div>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: COLORS.primary,
                    fontSize: 32,
                    fontWeight: 900,
                  }}
                >
                  Project Dashboard
                </Title>
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    fontWeight: 500,
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  APCRDA Urban Development Initiative - Real-time Monitoring
                  System
                </Text>
              </div>
            </div>
          </div>
          <Space>
            {/* <Button
              icon={<ReloadOutlined />}
              style={{
                borderRadius: 8,
                border: `2px solid ${COLORS.primary}`,
                color: COLORS.primary,
                fontWeight: 600,
                height: 40,
                fontSize: 13,
              }}
            >
              Refresh
            </Button> */}
            <Button
              icon={<ExportOutlined />}
              type="primary"
              style={{
                borderRadius: 8,
                background: CARD_GRADIENTS.blue,
                border: "none",
                fontWeight: 600,
                height: 40,
                fontSize: 13,
              }}
            >
              Export Report
            </Button>
          </Space>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Locations"
            value={totalLocations}
            icon={<EnvironmentOutlined />}
            color={COLORS.primary}
            gradient={CARD_GRADIENTS.blue}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Completed Projects"
            value={sitesCompleted}
            icon={<CheckCircleOutlined />}
            color={COLORS.success}
            gradient={CARD_GRADIENTS.green}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="In Progress"
            value={sitesInProgress}
            icon={<FireOutlined />}
            color={COLORS.warning}
            gradient={CARD_GRADIENTS.orange}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Overall Progress"
            value={overallPercent}
            icon={<TrophyOutlined />}
            color={COLORS.secondary}
            suffix="%"
            gradient={CARD_GRADIENTS.rose}
          />
        </Col>
      </Row>

      {/* Analytics Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 32 }}
        tabBarStyle={{
          borderBottom: `3px solid ${COLORS.border}`,
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
                📊 Overview Analytics
              </span>
            ),
            children: (
              <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: COLORS.primary,
                        }}
                      >
                        📈 Daily Activity Tracker
                      </span>
                    }
                    style={{
                      background: "#fff",
                      border: `2px solid ${COLORS.info}20`,
                      borderRadius: 12,
                      boxShadow: "0 4px 16px rgba(3, 105, 161, 0.1)",
                    }}
                    headStyle={{
                      borderBottom: "2px solid #f1f5f9",
                      color: COLORS.text,
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
                              stopColor={COLORS.info}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={COLORS.info}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="hour"
                          stroke={COLORS.text}
                          opacity={0.6}
                        />
                        <YAxis stroke={COLORS.text} opacity={0.6} />
                        <ChartTooltip content={<CustomChartTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke={COLORS.info}
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
                          color: COLORS.primary,
                        }}
                      >
                        📅 Weekly Performance
                      </span>
                    }
                    style={{
                      background: "#fff",
                      border: `2px solid ${COLORS.success}20`,
                      borderRadius: 12,
                      boxShadow: "0 4px 16px rgba(21, 128, 61, 0.1)",
                    }}
                    headStyle={{
                      borderBottom: "2px solid #f1f5f9",
                      color: COLORS.text,
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dayWiseStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          stroke={COLORS.text}
                          opacity={0.6}
                        />
                        <YAxis stroke={COLORS.text} opacity={0.6} />
                        <ChartTooltip content={<CustomChartTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke={COLORS.success}
                          strokeWidth={3}
                          dot={{ fill: COLORS.success, r: 6 }}
                          activeDot={{ r: 8 }}
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
                📍 Distribution & Status
              </span>
            ),
            children: (
              <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                <Col xs={24} md={12} lg={8}>
                  <Card
                    title={
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: COLORS.primary,
                        }}
                      >
                        🎯 Project Status
                      </span>
                    }
                    style={{
                      background: "#fff",
                      border: `2px solid ${COLORS.secondary}20`,
                      borderRadius: 12,
                      boxShadow: "0 4px 16px rgba(124, 45, 18, 0.1)",
                    }}
                    headStyle={{
                      borderBottom: "2px solid #f1f5f9",
                      color: COLORS.text,
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusChart}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {statusChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<CustomChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: COLORS.success,
                          }}
                        >
                          {sitesCompleted}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          Completed
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: COLORS.warning,
                          }}
                        >
                          {sitesInProgress}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          In Progress
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: COLORS.danger,
                          }}
                        >
                          {sitesPending}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          Pending
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12} lg={16}>
                  <Card
                    title={
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: COLORS.primary,
                        }}
                      >
                        📊 Location-wise Completion Rate
                      </span>
                    }
                    style={{
                      background: "#fff",
                      border: `2px solid #06b6d420`,
                      borderRadius: 12,
                      boxShadow: "0 4px 16px rgba(6, 182, 212, 0.1)",
                    }}
                    headStyle={{
                      borderBottom: "2px solid #f1f5f9",
                      color: COLORS.text,
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="name"
                          stroke={COLORS.text}
                          opacity={0.6}
                        />
                        <YAxis stroke={COLORS.text} opacity={0.6} />
                        <ChartTooltip content={<CustomChartTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="completed"
                          stackId="a"
                          fill={COLORS.success}
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
          {
            key: "reports",
            label: (
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                📋 Reports & Documents
              </span>
            ),
            children: (
              <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      background: "#fff",
                      border: `2px solid ${COLORS.primary}20`,
                      borderRadius: 12,
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <Title
                      level={4}
                      style={{ color: COLORS.primary, marginBottom: 16 }}
                    >
                      📄 Recent Reports
                    </Title>
                    <Timeline
                      items={[
                        {
                          children: (
                            <div>
                              <Text strong style={{ color: COLORS.text }}>
                                Quarterly Progress Report
                              </Text>
                              <Text
                                type="secondary"
                                style={{
                                  display: "block",
                                  fontSize: 12,
                                  marginTop: 4,
                                }}
                              >
                                Generated on Jan 15, 2024 • 2.4 MB
                              </Text>
                            </div>
                          ),
                          color: COLORS.success,
                        },
                        {
                          children: (
                            <div>
                              <Text strong style={{ color: COLORS.text }}>
                                Site Compliance Audit
                              </Text>
                              <Text
                                type="secondary"
                                style={{
                                  display: "block",
                                  fontSize: 12,
                                  marginTop: 4,
                                }}
                              >
                                Generated on Jan 10, 2024 • 1.8 MB
                              </Text>
                            </div>
                          ),
                          color: COLORS.warning,
                        },
                        {
                          children: (
                            <div>
                              <Text strong style={{ color: COLORS.text }}>
                                Monthly Performance Review
                              </Text>
                              <Text
                                type="secondary"
                                style={{
                                  display: "block",
                                  fontSize: 12,
                                  marginTop: 4,
                                }}
                              >
                                Generated on Jan 5, 2024 • 3.1 MB
                              </Text>
                            </div>
                          ),
                          color: COLORS.info,
                        },
                      ]}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    style={{
                      background: CARD_GRADIENTS.blue,
                      border: "none",
                      borderRadius: 12,
                      boxShadow: "0 8px 24px rgba(30, 58, 138, 0.2)",
                    }}
                    bodyStyle={{ padding: 32 }}
                  >
                    <div style={{ textAlign: "center", color: "#fff" }}>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                      <Title
                        level={3}
                        style={{ color: "#fff", marginBottom: 8 }}
                      >
                        Generate New Report
                      </Title>
                      <Paragraph
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          marginBottom: 20,
                        }}
                      >
                        Create comprehensive reports for project monitoring and
                        government stakeholders
                      </Paragraph>
                      <Button
                        size="large"
                        icon={<FileTextOutlined />}
                        style={{
                          background: "#fff",
                          color: COLORS.primary,
                          border: "none",
                          fontWeight: 700,
                          borderRadius: 8,
                        }}
                      >
                        Generate Report
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      {/* Main Data Table */}
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 4,
                  height: 24,
                  background: CARD_GRADIENTS.blue,
                  borderRadius: 2,
                }}
              />
              <span
                style={{ fontWeight: 700, fontSize: 16, color: COLORS.primary }}
              >
                Project Sites - Detailed Progress
              </span>
            </div>
            {/* <Badge
              count={totalLocations}
              style={{
                backgroundColor: COLORS.primary,
                fontSize: 12,
                fontWeight: 700,
              }}
            /> */}
          </div>
        }
        // style={{
        //   background: "#fff",
        //   border: `2px solid ${COLORS.border}`,
        //   borderRadius: 12,
        //   boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        // }}
        // headStyle={{
        //   borderBottom: `2px solid ${COLORS.border}`,
        //   background: "#f8fafc",
        //   color: COLORS.primary,
        //   fontWeight: 700,
        // }}
        // bodyStyle={{ padding: 0 }}
        // extra={
        //   <Button
        //     size="small"
        //     icon={<FilterOutlined />}
        //     style={{
        //       borderRadius: 6,
        //       borderColor: COLORS.primary,
        //       color: COLORS.primary,
        //       fontWeight: 600,
        //     }}
        //   >
        //     {/* Filter */}
        //   </Button>
        // }
      >
        <Table
          columns={columns}
          dataSource={siteProgress}
          // pagination={{
          //   pageSize: 10,
          //   position: ["bottomCenter"],
          //   style: { color: COLORS.text },
          //   showSizeChanger: true,
          //   showTotal: (total) => (
          //     <span style={{ color: COLORS.text, fontWeight: 600 }}>
          //       Total {total} locations
          //     </span>
          //   ),
          // }}
          scroll={{ x: 800 }}
          rowKey="key"
          style={{ color: COLORS.text }}
          rowClassName={(record, index) => {
            if (record.percent === 100) return "bg-green-50";
            // if (record.percent > 0) return "bg-amber-50";
            // return "bg-red-50";
          }}
        />
      </Card>

      {/* Footer Stats */}
      <Row gutter={[20, 20]} style={{ marginTop: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #cffafe 100%)",
              border: `2px solid ${COLORS.info}30`,
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}
                >
                  TOTAL TASKS
                </span>
              }
              value={tasks.length}
              suffix={
                <span style={{ fontSize: 20, color: COLORS.text }}>
                  {" "}
                  / {totalLocations * TOTAL_WORK}
                </span>
              }
              valueStyle={{ color: COLORS.info, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              border: `2px solid ${COLORS.success}30`,
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}
                >
                  SURVEYS COMPLETED
                </span>
              }
              value={surveys.length}
              valueStyle={{ color: COLORS.success, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: `2px solid ${COLORS.warning}30`,
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}
                >
                  AVERAGE PROGRESS
                </span>
              }
              value={Math.round(
                siteProgress.reduce((sum, s) => sum + s.percent, 0) /
                  (siteProgress.length || 1)
              )}
              suffix="%"
              valueStyle={{ color: COLORS.warning, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
              border: `2px solid ${COLORS.danger}30`,
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}
                >
                  PENDING SITES
                </span>
              }
              value={sitesPending}
              valueStyle={{ color: COLORS.danger, fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
