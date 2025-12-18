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

export default function LocationsPage() {
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
      // style={{
      //   padding: "24px",
      //   backgroundColor: "#f5f7fa",
      //   minHeight: "100vh",
      // }}
      className="bg-slate-200"
      style={{
        minHeight: "100vh",
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
        // color: COLORS.text,
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
                borderRadius: 8,
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                height: "100%",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#8c8c8c", fontSize: 12, fontWeight: 500 }}
                  >
                    Total Locations
                  </span>
                }
                value={dashboardStats.total}
                prefix={
                  <TeamOutlined style={{ color: "#1677ff", marginRight: 8 }} />
                }
                valueStyle={{ color: "#262626", fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                height: "100%",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#8c8c8c", fontSize: 12, fontWeight: 500 }}
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
                valueStyle={{ color: "#52c41a", fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                height: "100%",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#8c8c8c", fontSize: 12, fontWeight: 500 }}
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
                valueStyle={{ color: "#1677ff", fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                height: "100%",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#8c8c8c", fontSize: 12, fontWeight: 500 }}
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
                valueStyle={{ color: "#d9d9d9", fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>

        {/* ================= SEARCH & FILTER ================= */}
        <div style={{ maxWidth: 320, margin: "16px 0 24px 0" }}>
          <Input.Search
            placeholder="Search location..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ================= LOCATIONS GRID ================= */}
        {filteredLocations.length === 0 ? (
          <Card
            style={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
              padding: 60,
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
            {filteredLocations.map((loc) => {
              const { completed, percent } = getLocationStats(loc.documentId);

              let tagColor = "default";
              let tagText = "Pending";
              let progressStatus = "normal";

              if (percent === 100) {
                tagColor = "success";
                tagText = "Completed";
                progressStatus = "success";
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
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                      height: "100%",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.12)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.06)";
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
                            fontWeight: 600,
                            lineHeight: 1.5,
                          }}
                        >
                          {loc.name}
                        </h3>
                        <Tag color={tagColor}>{tagText}</Tag>
                      </Space>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        marginBottom: 16,
                        padding: "12px",
                        backgroundColor: "#fafafa",
                        borderRadius: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ color: "#8c8c8c", fontSize: 13 }}>
                          Completed Tasks
                        </span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>
                          {completed} / {TOTAL_WORK}
                        </span>
                      </div>
                      <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                        {percent}% Complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 16 }}>
                      <Progress
                        percent={percent}
                        status={progressStatus}
                        strokeColor={
                          percent === 100
                            ? "#52c41a"
                            : percent > 0
                            ? "#1677ff"
                            : "#d9d9d9"
                        }
                        format={(p) => `${p}%`}
                      />
                    </div>

                    {/* Action Button */}
                    <Button
                      type="primary"
                      block
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate(`/locations/${loc.documentId}`)}
                      style={{
                        height: 40,
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 500,
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
