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

import StatCard from "../components/StatCard";
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API = "http://173.249.6.61:1337/api";
const TOTAL_WORK = 14;

const STATUS_COLORS = {
  completed: "#52c41a",
  inProgress: "#1677ff",
  pending: "#d9d9d9",
};

export default function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
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

  /* ================= LOGIC ================= */
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
        <Tag color="green" style={{ fontSize: 12, padding: "4px 12px" }}>
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
          strokeColor={p === 100 ? "#52c41a" : p > 0 ? "#1677ff" : "#d9d9d9"}
        />
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
          color = "blue";
          text = "In Progress";
        }
        return <Tag color={color}>{text}</Tag>;
      },
      width: 120,
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
    colors: ["#1677ff"],
    xaxis: { categories: hourlyStats.map((h) => h.hour) },
    dataLabels: { enabled: false },
  };

  const chartTheme = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
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
    colors: ["#faad14"],
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

  /* ================= RESPONSIVE UI ================= */
  return (
    <div
      className="min-h-full p-6 bg-slate-200"
      // style={{ background: "var(--bg-app)" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        {/* <Title level={2} style={{ margin: 0, color: '#262626' }}>
          Dashboard
        </Title> */}
        <Text type="secondary" style={{ fontSize: 14 }}>
          Real-time project progress and performance metrics
        </Text>
      </div>

      {/* KPI CARDS - Responsive Grid */}
      <Row gutter={[16, 16]} className="py-3">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed Sites"
            value={sitesCompleted}
            icon={<CheckCircleOutlined className="text-white text-xl" />}
            color="linear-gradient(135deg,#22c55e,#4ade80)"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed Sites"
            value={sitesCompleted}
            icon={<CheckCircleOutlined />}
            color="linear-gradient(135deg,#52c41a,#95de64)"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="In Progress"
            value={sitesInProgress}
            icon={<ClockCircleOutlined />}
            color="linear-gradient(135deg,#faad14,#ffd666)"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completion Rate"
            value={overallPercent}
            icon={<RiseOutlined />}
            color="linear-gradient(135deg,#722ed1,#b37feb)"
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                Hourly Work Updates (Today)
              </span>
            }
            style={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
          >
            <Chart
              options={hourlyOptions}
              series={[{ name: "Work", data: hourlyStats.map((h) => h.count) }]}
              type="bar"
              height={300}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                Day-wise Work Updates (Last 7 Days)
              </span>
            }
            style={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
          >
            <Chart
              options={dailyOptions}
              series={[
                { name: "Work", data: dayWiseStats.map((d) => d.count) },
              ]}
              type="line"
              height={300}
            />
            ;
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                Site Status Overview
              </span>
            }
            style={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
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
                    <Cell fill="#52c41a" />
                    <Cell fill="#1677ff" />
                    <Cell fill="#d9d9d9" />
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
          <Card title="Location-wise Work Distribution">
            <div style={{ overflowX: "auto" }}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={barChartData} layout="horizontal">
                  <XAxis type="category" dataKey="name" tick={false} />
                  <YAxis type="number" />
                  <ReTooltip
                    formatter={(value, key) => [
                      value,
                      key === "completed" ? "Completed" : "Pending",
                    ]}
                    labelFormatter={(label) => `Location: ${label}`}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#52c41a" />
                  <Bar dataKey="remaining" stackId="a" fill="#faad14" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card
        title={
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            Location Progress Details
          </span>
        }
        style={{
          borderRadius: 8,
          border: "none",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
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
