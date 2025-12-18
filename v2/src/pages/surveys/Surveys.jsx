// import { useEffect, useMemo, useState } from "react";
// import {
//   Table,
//   Card,
//   Tag,
//   Image,
//   Spin,
//   Typography,
//   Space,
//   Badge,
//   Input,
// } from "antd";
// import {
//   ThunderboltOutlined,
//   EnvironmentOutlined,
//   CalendarOutlined,
// } from "@ant-design/icons";
// import { Select } from "antd";

// const { Title, Text } = Typography;

// const API = "http://173.249.6.61:1337";

// export default function SurveysPage() {
//   const [surveys, setSurveys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [powerFilter, setPowerFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   const filteredSurveys = useMemo(() => {
//     return surveys.filter((s) => {
//       const matchPower =
//         powerFilter === "all" ||
//         s.power_available?.toLowerCase() === powerFilter;

//       const matchSearch = search
//         ? s.location?.name?.toLowerCase().includes(search.toLowerCase())
//         : true;

//       return matchPower && matchSearch;
//     });
//   }, [surveys, powerFilter, search]);

//   useEffect(() => {
//     fetch(`${API}/api/surveys?populate=*`)
//       .then((r) => r.json())
//       .then((res) => {
//         setSurveys(res?.data || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const columns = [
//     {
//       title: "#",
//       render: (_, __, i) => <b>{i + 1}</b>,
//       width: 60,
//     },
//     {
//       title: "Location",
//       dataIndex: ["location", "name"],
//       render: (_, record) => (
//         <Space direction="vertical" size={0}>
//           <Text strong>
//             <EnvironmentOutlined /> {record.location?.name}
//           </Text>
//           <Text type="secondary" style={{ fontSize: 12 }}>
//             {record.location?.latitude}, {record.location?.longitude}
//           </Text>
//         </Space>
//       ),
//     },
//     {
//       title: "Survey Date",
//       dataIndex: "survey_date",
//       render: (v) => (
//         <Space>
//           <CalendarOutlined />
//           {v}
//         </Space>
//       ),
//     },
//     {
//       title: "Network",
//       dataIndex: "network_type",
//       render: (v) => <Tag color="blue">{v}</Tag>,
//     },
//     {
//       title: "Power",
//       dataIndex: "power_available",
//       align: "center",
//       render: (v) =>
//         v === "Yes" ? (
//           <Badge status="success" text="Available" />
//         ) : (
//           <Badge status="error" text="Not Available" />
//         ),
//     },
//     {
//       title: "Remarks",
//       dataIndex: "remarks",
//       ellipsis: true,
//     },
//     {
//       title: "Images",
//       dataIndex: "images",
//       render: (images = []) =>
//         images.length ? (
//           <Image.PreviewGroup>
//             <Space>
//               {images.map((img) => (
//                 <Image
//                   key={img.id}
//                   width={50}
//                   height={50}
//                   style={{ objectFit: "cover", borderRadius: 6 }}
//                   src={`${API}${img.formats?.thumbnail?.url || img.url}`}
//                 />
//               ))}
//             </Space>
//           </Image.PreviewGroup>
//         ) : (
//           <Text type="secondary">No Images</Text>
//         ),
//     },
//   ];

//   if (loading) {
//     return (
//       <div style={{ padding: 40, textAlign: "center" }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 24 }}>
//       <Title level={3}>📋 Surveys Overview</Title>
//       <Text type="secondary">
//         All surveys raised across locations with power & network details
//       </Text>

//       <Card
//         style={{
//           marginTop: 24,
//           borderRadius: 12,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//         }}
//       >
//         <Space style={{ marginTop: 16, marginBottom: 20 }} wrap>
//           <Text strong>Power Filter:</Text>

//           <Select
//             value={powerFilter}
//             onChange={setPowerFilter}
//             style={{ width: 200 }}
//           >
//             <Select.Option value="all">All Surveys</Select.Option>
//             <Select.Option value="yes">🟢 Power Available</Select.Option>
//             <Select.Option value="no">🔴 Power Not Available</Select.Option>
//           </Select>

//           <Input
//             placeholder="Search by location name"
//             allowClear
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{ width: 240 }}
//           />
//         </Space>

//         <Table
//           columns={columns}
//           dataSource={filteredSurveys}
//           rowKey="documentId"
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Image,
  Spin,
  Typography,
  Space,
  Badge,
  Input,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  ThunderboltOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Select } from "antd";

const { Title, Text } = Typography;

const API = "http://173.249.6.61:1337";

// Color palette matching the design
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

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [powerFilter, setPowerFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredSurveys = useMemo(() => {
    return surveys.filter((s) => {
      const matchPower =
        powerFilter === "all" ||
        s.power_available?.toLowerCase() === powerFilter;

      const matchSearch = search
        ? s.location?.name?.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchPower && matchSearch;
    });
  }, [surveys, powerFilter, search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSurveys = surveys.length;
    const withPower = surveys.filter(
      (s) => s.power_available?.toLowerCase() === "yes"
    ).length;
    const withoutPower = surveys.filter(
      (s) => s.power_available?.toLowerCase() === "no"
    ).length;

    return {
      total: totalSurveys,
      withPower,
      withoutPower,
      powerPercentage:
        totalSurveys > 0 ? Math.round((withPower / totalSurveys) * 100) : 0,
    };
  }, [surveys]);

  useEffect(() => {
    fetch(`${API}/api/surveys?populate=*`)
      .then((r) => r.json())
      .then((res) => {
        setSurveys(res?.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "#",
      render: (_, __, i) => (
        <span style={{ fontWeight: 600, color: "#FB9F3D" }}>{i + 1}</span>
      ),
      width: 60,
    },
    {
      title: "Location",
      dataIndex: ["location", "name"],
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: "#262626" }}>
            <EnvironmentOutlined /> {record.location?.name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.location?.latitude}, {record.location?.longitude}
          </Text>
        </Space>
      ),
    },
    {
      title: "Survey Date",
      dataIndex: "survey_date",
      render: (v) => (
        <Space>
          <CalendarOutlined style={{ color: "#FB9F3D" }} />
          <span style={{ color: "#262626", fontWeight: 500 }}>{v}</span>
        </Space>
      ),
      width: 120,
    },
    {
      title: "Network",
      dataIndex: "network_type",
      render: (v) => (
        <Tag color="#1E9CAD" style={{ color: "black", fontWeight: 600 }}>
          {v}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Power",
      dataIndex: "power_available",
      align: "center",
      render: (v) =>
        v?.toLowerCase() === "yes" ? (
          <Badge
            status="success"
            text="Available"
            style={{ color: "#52c41a", fontWeight: 600 }}
          />
        ) : (
          <Badge
            status="error"
            text="Not Available"
            style={{ color: "#FF6B6B", fontWeight: 600 }}
          />
        ),
      width: 130,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      ellipsis: true,
      render: (v) => <Text style={{ color: "#666666" }}>{v || "N/A"}</Text>,
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (images = []) =>
        images.length ? (
          <Image.PreviewGroup>
            <Space>
              {images.map((img) => (
                <Image
                  key={img.id}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: 6 }}
                  src={`${API}${img.formats?.thumbnail?.url || img.url}`}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        ) : (
          <Text type="secondary">No Images</Text>
        ),
      width: 120,
    },
  ];

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
            Surveys Overview
          </h1>
          <p style={{ color: "#8c8c8c", margin: "8px 0 0 0", fontSize: 14 }}>
            All surveys raised across locations with power & network details
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Total Surveys"
              value={stats.total}
              icon={<CalendarOutlined />}
              colorIndex={0}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Power Available"
              value={stats.withPower}
              icon={<ThunderboltOutlined />}
              colorIndex={1}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Power Unavailable"
              value={stats.withoutPower}
              icon={<ClockCircleOutlined />}
              colorIndex={2}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <KPICard
              title="Power Coverage"
              value={stats.powerPercentage}
              suffix="%"
              icon={<CheckCircleOutlined />}
              colorIndex={3}
            />
          </Col>
        </Row>

        {/* ================= FILTERS SECTION ================= */}
        <Card
          style={{
            background: "#fff",
            border: `2px solid #FFD591`,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            marginBottom: 24,
          }}
          headStyle={{
            borderBottom: `2px solid #FFD591`,
            background: "#FFF7E6",
          }}
          title={
            <span style={{ fontWeight: 700, fontSize: 15, color: "#262626" }}>
              🔍 Filters & Search
            </span>
          }
        >
          <Space style={{ width: "100%" }} wrap>
            <div>
              <Text strong style={{ color: "#262626", marginRight: 12 }}>
                Power Status:
              </Text>
              <Select
                value={powerFilter}
                onChange={setPowerFilter}
                style={{ width: 200 }}
              >
                <Select.Option value="all">All Surveys</Select.Option>
                <Select.Option value="yes">✅ Power Available</Select.Option>
                <Select.Option value="no">❌ Power Not Available</Select.Option>
              </Select>
            </div>

            <Input
              placeholder="Search by location name..."
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 280,
                borderRadius: 8,
                border: `2px solid #FFD591`,
              }}
            />
          </Space>
        </Card>

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
                Survey Records - {filteredSurveys.length} Results
              </span>
            </div>
          }
          style={{
            background: "#fff",
            border: `2px solid #FFD591`,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
          headStyle={{
            borderBottom: `2px solid #FFD591`,
            background: "#FFF7E6",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            columns={columns}
            dataSource={filteredSurveys}
            rowKey="documentId"
            scroll={{ x: 1200 }}
            style={{ color: "#262626" }}
            // pagination={{
            //   pageSize: 10,
            //   position: ["bottomCenter"],
            //   style: { color: "#262626" },
            //   showSizeChanger: true,
            //   showTotal: (total) => (
            //     <span style={{ color: "#262626", fontWeight: 600 }}>
            //       Total {total} surveys
            //     </span>
            //   ),
            // }}
            rowClassName={(record, index) => {
              if (record.power_available?.toLowerCase() === "yes")
                return "bg-green-50";
            }}
          />
        </Card>

        {/* ================= STATISTICS SUMMARY ================= */}
        {/* <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
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
                    Total Surveys
                  </span>
                }
                value={stats.total}
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
                    With Power
                  </span>
                }
                value={stats.withPower}
                valueStyle={{
                  color: CARD_COLORS.teal.accent,
                  fontSize: 28,
                }}
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
                    Without Power
                  </span>
                }
                value={stats.withoutPower}
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
                    Filtered Results
                  </span>
                }
                value={filteredSurveys.length}
                valueStyle={{ color: "#FF6B6B", fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row> */}
      </div>
    </div>
  );
}
