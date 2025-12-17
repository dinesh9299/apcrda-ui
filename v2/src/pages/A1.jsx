import { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Spin,
  Typography,
  Empty,
  Space,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import Chart from "react-apexcharts";

import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API = "http://173.249.6.61:1337/api";
const TOTAL_WORK = 14;

const COLORS = {
  completed: "#10b981",
  inProgress: "#3b82f6",
  pending: "#ef4444",
  warning: "#f59e0b",
  success: "#06b6d4",
  purple: "#8b5cf6",
  pink: "#ec4899",
};

export default function A1() {
  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

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

      return {
        key: loc.documentId,
        name: loc.name,
        completed,
        percent,
      };
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
    { name: "Completed", value: sitesCompleted },
    { name: "In Progress", value: sitesInProgress },
    { name: "Pending", value: sitesPending },
  ];

  const barChartData = siteProgress.map((site) => ({
    name: site.name.length > 20 ? `${site.name.slice(0, 17)}...` : site.name,
    completed: site.completed,
    remaining: TOTAL_WORK - site.completed,
  }));

  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50, align: "center" },
    { title: "Location", dataIndex: "name", ellipsis: true, key: "name" },
    {
      title: "Completed",
      dataIndex: "completed",
      render: (v) => (
        <Tag
          color="green"
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
          strokeColor={
            p === 100
              ? COLORS.success
              : p > 0
              ? COLORS.inProgress
              : COLORS.pending
          }
          format={(percent) => `${percent}%`}
        />
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "percent",
      render: (p) => {
        let color = "red";
        let text = "Pending";
        if (p === 100) {
          color = "green";
          text = "✓ Completed";
        } else if (p > 0) {
          color = "blue";
          text = "⟳ In Progress";
        }
        return <Tag color={color}>{text}</Tag>;
      },
      width: 140,
      align: "center",
    },
  ];

  const allWork = useMemo(() => {
    return [
      ...tasks.map((t) => ({
        type: "task",
        createdAt: t.createdAt,
      })),
      ...surveys.map((s) => ({
        type: "survey",
        createdAt: s.createdAt,
      })),
    ];
  }, [tasks, surveys]);

  const hourlyStats = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
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

  const hourlyOptions = {
    chart: { toolbar: { show: false } },
    colors: ["#3b82f6"],
    xaxis: { categories: hourlyStats.map((h) => h.hour) },
    dataLabels: { enabled: false },
    grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
  };

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
      days[key] = { date: `${dayName} ${key.slice(5)}`, count: 0 };
    }

    allWork.forEach((w) => {
      const d = w.createdAt?.slice(0, 10);
      if (days[d]) days[d].count += 1;
    });

    return Object.values(days);
  }, [allWork]);

  const dailyOptions = {
    stroke: { curve: "smooth", width: 3 },
    colors: ["#10b981"],
    xaxis: { categories: dayWiseStats.map((d) => d.date) },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const KPICard = ({ icon, title, value, color, suffix = "" }) => (
    <Card
      hoverable
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: 12,
        boxShadow: `0 8px 24px ${color}20`,
        transition: "all 0.3s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = `0 12px 32px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`;
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Text>
          <div style={{ fontSize: 32, fontWeight: 700, color, marginTop: 8 }}>
            {value}
            {suffix}
          </div>
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: "#fff",
            boxShadow: `0 8px 20px ${color}40`,
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
        background: "linear-gradient(135deg, #f0f9ff 0%, #f3e8ff 100%)",
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#1f2937", fontSize: 32, fontWeight: 800 }}
        >
          📊 Dashboard Overview
        </Title>
        <Text type="secondary" style={{ fontSize: 14, marginTop: 8 }}>
          Real-time project progress and performance metrics
        </Text>
      </div>

      {/* KPI CARDS */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Completed Sites"
            value={sitesCompleted}
            icon={<TrophyOutlined />}
            color="#10b981"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="In Progress"
            value={sitesInProgress}
            icon={<ThunderboltOutlined />}
            color="#f59e0b"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Pending Sites"
            value={sitesPending}
            icon={<ClockCircleOutlined />}
            color="#ef4444"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Completion Rate"
            value={overallPercent}
            icon={<RiseOutlined />}
            color="#8b5cf6"
            suffix="%"
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                📈 Hourly Work Updates (Today)
              </span>
            }
            style={{
              borderRadius: 12,
              border: "2px solid #3b82f630",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
            }}
          >
            {hourlyStats.some((h) => h.count > 0) ? (
              <Chart
                options={hourlyOptions}
                series={[
                  { name: "Work", data: hourlyStats.map((h) => h.count) },
                ]}
                type="bar"
                height={300}
              />
            ) : (
              <Empty
                description="No data available"
                style={{ marginTop: 50 }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                📊 Day-wise Work Updates (Last 7 Days)
              </span>
            }
            style={{
              borderRadius: 12,
              border: "2px solid #10b98130",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)",
              background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
            }}
          >
            {dayWiseStats.some((d) => d.count > 0) ? (
              <Chart
                options={dailyOptions}
                series={[
                  { name: "Work", data: dayWiseStats.map((d) => d.count) },
                ]}
                type="line"
                height={300}
              />
            ) : (
              <Empty
                description="No data available"
                style={{ marginTop: 50 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                🎯 Site Status Overview
              </span>
            }
            style={{
              borderRadius: 12,
              border: "2px solid #ec489930",
              boxShadow: "0 4px 20px rgba(236, 72, 153, 0.1)",
              background: "linear-gradient(135deg, #fce7f3 0%, #ffffff 100%)",
            }}
          >
            {totalLocations > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChart}
                    dataKey="value"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      borderRadius: 12,
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                description="No data available"
                style={{ marginTop: 50 }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12} lg={16}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                📍 Location-wise Work Distribution
              </span>
            }
            style={{
              borderRadius: 12,
              border: "2px solid #f59e0b30",
              boxShadow: "0 4px 20px rgba(245, 158, 11, 0.1)",
              background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
            }}
          >
            {siteProgress.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={barChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 12,
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                        border: "none",
                      }}
                      formatter={(value, key) => [
                        value,
                        key === "completed" ? "Completed" : "Remaining",
                      ]}
                    />
                    <Bar
                      dataKey="completed"
                      stackId="a"
                      fill="#10b981"
                      radius={[0, 8, 8, 0]}
                    />
                    <Bar
                      dataKey="remaining"
                      stackId="a"
                      fill="#fbbf24"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Empty
                description="No data available"
                style={{ marginTop: 50 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card
        title={
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
            📋 Location Progress Details
          </span>
        }
        style={{
          borderRadius: 12,
          border: "2px solid #06b6d430",
          boxShadow: "0 4px 20px rgba(6, 182, 212, 0.1)",
          background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)",
        }}
      >
        {siteProgress.length > 0 ? (
          <Table
            columns={columns}
            dataSource={siteProgress}
            pagination={{ pageSize: 10, position: ["bottomCenter"] }}
            scroll={{ x: 800 }}
            rowKey="key"
            style={{ fontSize: 13 }}
            rowClassName={(record) =>
              record.percent === 100
                ? "bg-green-50"
                : record.percent > 0
                ? "bg-blue-50"
                : "bg-red-50"
            }
          />
        ) : (
          <Empty
            description="No location data available"
            style={{ marginTop: 50 }}
          />
        )}
      </Card>
    </div>
  );
}
