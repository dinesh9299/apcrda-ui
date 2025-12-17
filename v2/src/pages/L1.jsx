import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Button,
  Spin,
  Empty,
  Statistic,
  Divider,
  Tag,
  Input,
  Space,
} from "antd";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

const API = "http://173.249.6.61:1337/api";
const TOTAL_TASKS = 13;
const TOTAL_WORK = TOTAL_TASKS + 1;

// Color palette matching the design
const COLORS = {
  gold: "#FDB71A",
  orange: "#FB9F3D",
  coral: "#FF6B6B",
  teal: "#1E9CAD",
  purple: "#8B5CF6",
  green: "#52c41a",
  blue: "#1677ff",
  lightYellow: "#FFF1C6",
};

const CARD_COLORS = [
  { bg: "#FFF7E6", border: "#FFD591", accent: "#FB9F3D" },
  { bg: "#F6FFED", border: "#B7EB8F", accent: "#52c41a" },
  { bg: "#E6F7FF", border: "#91D5FF", accent: "#1677ff" },
  { bg: "#F9F0FF", border: "#D3ADF7", accent: "#8B5CF6" },
  { bg: "#E6F9F9", border: "#87E8DE", accent: "#1E9CAD" },
  { bg: "#FFE6E6", border: "#FFA8A8", accent: "#FF6B6B" },
];

export default function L1() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`${API}/locations`).then((r) => r.json()),
      fetch(`${API}/tasks?populate=location`).then((r) => r.json()),
      fetch(`${API}/surveys?populate=location`).then((r) => r.json()),
    ]).then(([locRes, taskRes, surveyRes]) => {
      setLocations(locRes.data || []);
      setTasks(taskRes.data || []);
      setSurveys(surveyRes.data || []);
      setLoading(false);
    });
  }, []);

  const filteredLocations = useMemo(() => {
    if (!search) return locations;
    return locations.filter((loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [locations, search]);

  // ================= HELPERS =================
  const getLocationStats = (locationDocId) => {
    const locationTasks = tasks.filter(
      (t) => t.location?.documentId === locationDocId
    );
    const uniqueCompletedTasks = new Set(locationTasks.map((t) => t.task_type))
      .size;
    const surveyDone = surveys.some(
      (s) => s.location?.documentId === locationDocId
    );
    const completed = uniqueCompletedTasks + (surveyDone ? 1 : 0);
    const percent = Math.round((completed / TOTAL_WORK) * 100);

    return { completed, percent };
  };

  // ================= DASHBOARD COUNTS =================
  const dashboardStats = useMemo(() => {
    let completedSites = 0;
    let inProgressSites = 0;

    locations.forEach((loc) => {
      const { percent } = getLocationStats(loc.documentId);
      if (percent === 100) completedSites++;
      else if (percent > 0) inProgressSites++;
    });

    return {
      total: locations.length,
      completed: completedSites,
      inProgress: inProgressSites,
      pending: locations.length - completedSites - inProgressSites,
    };
  }, [locations, tasks, surveys]);

  const getCardColor = (index) => {
    return CARD_COLORS[index % CARD_COLORS.length];
  };

  // ================= UI =================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f7fa",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
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
            Locations Dashboard
          </h1>
          <p style={{ color: "#8c8c8c", margin: "8px 0 0 0", fontSize: 14 }}>
            Manage and track progress across all project locations
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "2px solid #FFD591",
                boxShadow: "0 4px 12px rgba(253, 183, 26, 0.15)",
                height: "100%",
                background: "#FFF7E6",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      color: "#FB9F3D",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Total Locations
                  </span>
                }
                value={dashboardStats.total}
                prefix={
                  <TeamOutlined style={{ color: "#FB9F3D", marginRight: 8 }} />
                }
                valueStyle={{ color: "#FB9F3D", fontSize: 32, fontWeight: 700 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "2px solid #B7EB8F",
                boxShadow: "0 4px 12px rgba(82, 196, 26, 0.15)",
                height: "100%",
                background: "#F6FFED",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      color: "#52c41a",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Completed Sites
                  </span>
                }
                value={dashboardStats.completed}
                prefix={
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", marginRight: 8 }}
                  />
                }
                valueStyle={{ color: "#52c41a", fontSize: 32, fontWeight: 700 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "2px solid #91D5FF",
                boxShadow: "0 4px 12px rgba(22, 119, 255, 0.15)",
                height: "100%",
                background: "#E6F7FF",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      color: "#1677ff",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    In Progress
                  </span>
                }
                value={dashboardStats.inProgress}
                prefix={
                  <ClockCircleOutlined
                    style={{ color: "#1677ff", marginRight: 8 }}
                  />
                }
                valueStyle={{ color: "#1677ff", fontSize: 32, fontWeight: 700 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "2px solid #D3ADF7",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                height: "100%",
                background: "#F9F0FF",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{
                      color: "#8B5CF6",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Pending Sites
                  </span>
                }
                value={dashboardStats.pending}
                suffix={
                  dashboardStats.pending === dashboardStats.total
                    ? " (Not Started)"
                    : ""
                }
                valueStyle={{ color: "#8B5CF6", fontSize: 32, fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>

        {/* ================= SEARCH & FILTER ================= */}
        <div style={{ maxWidth: 400, margin: "16px 0 24px 0" }}>
          <Input.Search
            placeholder="Search location..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderRadius: 8,
            }}
          />
        </div>

        {/* ================= LOCATIONS GRID ================= */}
        {filteredLocations.length === 0 ? (
          <Card
            style={{
              borderRadius: 12,
              border: "2px dashed #FFBC1F",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
              padding: 60,
              background: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Empty
              description={
                search ? "No locations match your search" : "No locations found"
              }
              style={{ marginTop: 20 }}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredLocations.map((loc, index) => {
              const { completed, percent } = getLocationStats(loc.documentId);
              const cardColor = getCardColor(index);

              let tagColor = "default";
              let tagText = "Pending";
              let progressStatus = "normal";
              let progressColor = cardColor.accent;

              if (percent === 100) {
                tagColor = "success";
                tagText = "Completed";
                progressStatus = "success";
                progressColor = "#52c41a";
              } else if (percent > 0) {
                tagColor = "processing";
                tagText = "In Progress";
                progressStatus = "active";
              }

              return (
                <Col xs={24} sm={12} lg={8} key={loc.documentId}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      border: `2px solid ${cardColor.border}`,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      height: "100%",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      background: cardColor.bg,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(0, 0, 0, 0.15)";
                      e.currentTarget.style.transform = "translateY(-6px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Location Header */}
                    <div style={{ marginBottom: 16 }}>
                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size={8}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: "#262626",
                            fontSize: 16,
                            fontWeight: 700,
                            lineHeight: 1.5,
                          }}
                        >
                          {loc.name}
                        </h3>
                        <Tag
                          color={
                            percent === 100
                              ? "#52c41a"
                              : percent > 0
                              ? cardColor.accent
                              : "#d9d9d9"
                          }
                          style={{
                            color: percent === 100 ? "white" : "white",
                            fontWeight: 600,
                            width: "fit-content",
                          }}
                        >
                          {tagText}
                        </Tag>
                      </Space>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        marginBottom: 16,
                        padding: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        borderRadius: 8,
                        border: `1px solid ${cardColor.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#666666",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          Completed Tasks
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: cardColor.accent,
                            fontSize: 14,
                          }}
                        >
                          {completed} / {TOTAL_WORK}
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#666666",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {percent}% Complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 16 }}>
                      <Progress
                        percent={percent}
                        status={progressStatus}
                        strokeColor={progressColor}
                        format={(p) => `${p}%`}
                        strokeWidth={6}
                      />
                    </div>

                    {/* Action Button */}
                    <Button
                      type="primary"
                      block
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate(`/locations/${loc.documentId}`)}
                      style={{
                        height: 42,
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        background: cardColor.accent,
                        border: "none",
                        color: "white",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.85";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      View Details
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
}
