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
  Tooltip,
  Tabs,
  Badge,
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
  BgColorsOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API = "http://173.249.6.61:1337/api";
const TOTAL_WORK = 14;

const GRADIENT_COLORS = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  success: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  info: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  warning: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  danger: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
};

const chartColors = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#f5576c",
  "#4facfe",
  "#00f2fe",
];

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#1f2937",
          padding: "12px 16px",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          border: `2px solid ${payload[0]?.color || "#667eea"}`,
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: "#fff", fontSize: 13 }}>
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

export default function A3() {
  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

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
    { name: "Completed", value: sitesCompleted, fill: "#10b981" },
    { name: "In Progress", value: sitesInProgress, fill: "#f59e0b" },
    { name: "Pending", value: sitesPending, fill: "#ef4444" },
  ];

  const barChartData = siteProgress.slice(0, 10).map((site, idx) => ({
    name: site.name.length > 15 ? `${site.name.slice(0, 12)}...` : site.name,
    completed: site.completed,
    remaining: TOTAL_WORK - site.completed,
    percent: site.percent,
  }));

  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50, align: "center" },
    { title: "Location", dataIndex: "name", ellipsis: true, key: "name" },
    {
      title: "Tasks",
      dataIndex: "completed",
      render: (v) => (
        <Tag
          color="cyan"
          style={{ fontSize: 12, padding: "6px 14px", borderRadius: 20 }}
        >
          {v} / {TOTAL_WORK}
        </Tag>
      ),
      width: 120,
      align: "center",
    },
    {
      title: "Progress",
      dataIndex: "percent",
      render: (p) => (
        <Progress
          percent={p}
          size="small"
          strokeColor={p === 100 ? "#10b981" : p > 0 ? "#f59e0b" : "#ef4444"}
          format={() => `${p}%`}
        />
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "percent",
      render: (p) => {
        let color = "red";
        let text = "⏳ Pending";
        if (p === 100) {
          color = "green";
          text = "✓ Done";
        } else if (p > 0) {
          color = "orange";
          text = "⟳ Active";
        }
        return <Tag color={color}>{text}</Tag>;
      },
      width: 120,
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <Spin size="large" style={{ color: "#667eea" }} />
      </div>
    );
  }

  const KPICard = ({
    icon,
    title,
    value,
    color,
    suffix = "",
    trend = null,
  }) => (
    <Card
      hoverable
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}40`,
        borderRadius: 16,
        boxShadow: `0 12px 40px ${color}25`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px)";
        e.currentTarget.style.boxShadow = `0 20px 60px ${color}35`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 12px 40px ${color}25`;
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            {title}
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 12,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color,
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {value}
              {suffix}
            </div>
            {trend && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: trend > 0 ? "#d1fae5" : "#fee2e2",
                }}
              >
                {trend > 0 ? (
                  <ArrowUpOutlined style={{ color: "#10b981" }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "#ef4444" }} />
                )}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: trend > 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {Math.abs(trend)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 16,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "#fff",
            boxShadow: `0 12px 30px ${color}50`,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2d3748 100%)",
        padding: 12,
        color: "#fff",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          marginBottom: 40,
          paddingBottom: 24,
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
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
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              📊 APCRDA Dashboard
            </Title>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: 14,
                marginTop: 8,
                display: "block",
              }}
            >
              Real-time project analytics and site management
            </Text>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              style={{
                borderRadius: 8,
                background: GRADIENT_COLORS.primary,
                border: "none",
                fontWeight: 600,
              }}
            >
              Today
            </Button>
            <Button
              icon={<BgColorsOutlined />}
              style={{
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Export
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
            icon={<TeamOutlined />}
            color="#667eea"
            trend={5}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Completed"
            value={sitesCompleted}
            icon={<TrophyOutlined />}
            color="#10b981"
            trend={12}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="In Progress"
            value={sitesInProgress}
            icon={<ThunderboltOutlined />}
            color="#f59e0b"
            trend={-3}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Completion Rate"
            value={overallPercent}
            icon={<RiseOutlined />}
            color="#f5576c"
            suffix="%"
            trend={8}
          />
        </Col>
      </Row>

      {/* Main Charts Section */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 32 }}
        tabBarStyle={{
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: 12,
          padding: "0 16px",
        }}
        items={[
          {
            key: "1",
            label: "📈 Analytics",
            children: (
              <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#667eea",
                            boxShadow: "0 0 10px #667eea",
                          }}
                        />
                        <span>Hourly Activity</span>
                      </div>
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
                      border: "2px solid rgba(102, 126, 234, 0.3)",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
                    }}
                    headStyle={{ borderBottom: "none", color: "#fff" }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={hourlyStats}>
                        <defs>
                          <linearGradient
                            id="colorHour"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#667eea"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#667eea"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis
                          dataKey="hour"
                          stroke="rgba(255, 255, 255, 0.5)"
                        />
                        <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                        <ChartTooltip content={<CustomChartTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#667eea"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorHour)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#10b981",
                            boxShadow: "0 0 10px #10b981",
                          }}
                        />
                        <span>Weekly Trends</span>
                      </div>
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
                      border: "2px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(16, 185, 129, 0.2)",
                    }}
                    headStyle={{ borderBottom: "none", color: "#fff" }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dayWiseStats}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="rgba(255, 255, 255, 0.5)"
                        />
                        <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                        <ChartTooltip content={<CustomChartTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", r: 5 }}
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
            key: "2",
            label: "📊 Distribution",
            children: (
              <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                <Col xs={24} md={12} lg={8}>
                  <Card
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#f5576c",
                            boxShadow: "0 0 10px #f5576c",
                          }}
                        />
                        <span>Site Status</span>
                      </div>
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245, 87, 108, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
                      border: "2px solid rgba(245, 87, 108, 0.3)",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(245, 87, 108, 0.2)",
                    }}
                    headStyle={{ borderBottom: "none", color: "#fff" }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusChart}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
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
                  </Card>
                </Col>

                <Col xs={24} md={12} lg={16}>
                  <Card
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#00f2fe",
                            boxShadow: "0 0 10px #00f2fe",
                          }}
                        />
                        <span>Location Progress</span>
                      </div>
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
                      border: "2px solid rgba(0, 242, 254, 0.3)",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(0, 242, 254, 0.2)",
                    }}
                    headStyle={{ borderBottom: "none", color: "#fff" }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart data={barChartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="rgba(255, 255, 255, 0.5)"
                        />
                        <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                        <ChartTooltip content={<CustomChartTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="completed"
                          stackId="a"
                          fill="#10b981"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="remaining"
                          stackId="a"
                          fill="#fbbf24"
                          radius={[8, 8, 0, 0]}
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

      {/* Data Table */}
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#4facfe",
                  boxShadow: "0 0 10px #4facfe",
                }}
              />
              <span>Site Progress Tracker</span>
            </div>
            <Badge
              count={siteProgress.length}
              style={{ backgroundColor: "#4facfe" }}
            />
          </div>
        }
        style={{
          background:
            "linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
          border: "2px solid rgba(79, 172, 254, 0.3)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(79, 172, 254, 0.2)",
        }}
        headStyle={{ borderBottom: "none", color: "#fff" }}
        bodyStyle={{ padding: 20 }}
      >
        <Table
          columns={columns}
          dataSource={siteProgress}
          pagination={{
            pageSize: 10,
            position: ["bottomCenter"],
            style: { color: "#fff" },
          }}
          scroll={{ x: 800 }}
          rowKey="key"
          style={{ color: "#fff" }}
          rowClassName={(record) => {
            if (record.percent === 100) return "bg-warning-900";
            if (record.percent > 0) return "bg-warning-200";
            return "bg-white";
          }}
        />
      </Card>
    </div>
  );
}
