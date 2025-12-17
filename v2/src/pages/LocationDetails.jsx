// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Typography,
//   Progress,
//   Divider,
//   Button,
//   Tag,
//   Space,
//   Spin,
//   Empty,
//   List,
//   Modal,
//   Badge,
// } from "antd";
// import {
//   ArrowLeftOutlined,
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   EyeOutlined,
//   EditOutlined,
// } from "@ant-design/icons";
// import { useParams, useNavigate } from "react-router-dom";

// import UpdateTaskModal from "../components/UpdatetaskModal";
// import RaiseSurveyModal from "../components/RaiseSurveyModal";
// import ViewTaskModal from "../components/ViewTaskModal";
// import ViewSurveyModal from "../components/ViewSurveyModal";

// const { Title, Text } = Typography;

// const API = "http://173.249.6.61:1337/api";

// const TASK_ENUM = [
//   "ESCALATION",
//   "IRON_WORK",
//   "BASEMENT",
//   "POLE_ELEVATION",
//   "ROCK_FIXING",
//   "WIRING",
//   "CAMERA_FIXING",
//   "POE_SWITCH_INSTALLATION",
//   "CONFIGURATION",
//   "COMMISSIONING",
//   "INTERNET_STATUS",
//   "ELECTRICITY_STATUS",
//   "FINAL_HANDOVER",
// ];

// const TOTAL_WORK = TASK_ENUM.length + 1; // +1 Survey

// export default function LocationDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [location, setLocation] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [survey, setSurvey] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [openTaskModal, setOpenTaskModal] = useState(false);
//   const [openSurveyModal, setOpenSurveyModal] = useState(false);
//   const [openViewSurvey, setOpenViewSurvey] = useState(false);
//   const [openViewTask, setOpenViewTask] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const user = JSON.parse(sessionStorage.getItem("user"));

//   const isAdmin = user?.role?.type === "admin";

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       fetch(`${API}/locations/${id}`).then((r) => r.json()),
//       fetch(
//         `${API}/tasks?filters[location][documentId]=${id}&populate=images`
//       ).then((r) => r.json()),
//       fetch(
//         `${API}/surveys?filters[location][documentId]=${id}&populate=images`
//       ).then((r) => r.json()),
//     ]).then(([locRes, taskRes, surveyRes]) => {
//       setLocation(locRes?.data || null);
//       setTasks(taskRes?.data || []);
//       setSurvey((surveyRes?.data || [])[0] || null);
//       setLoading(false);
//     });
//   }, [id]);

//   /* ---------------- DERIVED DATA ---------------- */
//   const completedTaskTypes = useMemo(
//     () => tasks.map((t) => t.task_type),
//     [tasks]
//   );

//   const pendingTasks = useMemo(
//     () => TASK_ENUM.filter((t) => !completedTaskTypes.includes(t)),
//     [completedTaskTypes]
//   );

//   const completedCount = completedTaskTypes.length + (survey ? 1 : 0);
//   const progressPercent = Math.round((completedCount / TOTAL_WORK) * 100);

//   /* ---------------- STATES ---------------- */
//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: "70vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!location) {
//     return <Empty description="Location not found" />;
//   }

//   /* ---------------- UI ---------------- */
//   return (
//     <div
//       style={{
//         padding: 24,
//         background: ` radial-gradient(circle at left center, rgb(242 237 217) 0%, transparent 45%), linear-gradient(135deg, rgb(244 231 201) 0%, rgb(255, 241, 198) 30%, rgb(255, 250, 237) 60%, rgb(255, 255, 255) 100%)`,
//       }}
//     >
//       {/* BACK */}
//       <Button
//         type="link"
//         icon={<ArrowLeftOutlined />}
//         onClick={() => navigate(-1)}
//         style={{ paddingLeft: 0 }}
//       >
//         Back to Locations
//       </Button>

//       {/* HEADER */}
//       <Card style={{ marginBottom: 24 }}>
//         <Row justify="space-between" align="middle">
//           <Col>
//             <Title level={3} style={{ marginBottom: 4 }}>
//               {location.name}
//             </Title>
//             <Text type="secondary">
//               📍 {location.latitude} | {location.longitude}
//             </Text>
//           </Col>
//           <Col>
//             <Tag
//               color={
//                 progressPercent === 100
//                   ? "green"
//                   : progressPercent > 0
//                   ? "orange"
//                   : "default"
//               }
//             >
//               {progressPercent === 100 ? "COMPLETED" : "IN PROGRESS"}
//             </Tag>
//           </Col>
//         </Row>

//         <Divider />

//         <Text strong>
//           Progress: {completedCount} / {TOTAL_WORK}
//         </Text>

//         <Progress
//           percent={progressPercent}
//           status={progressPercent === 100 ? "success" : "active"}
//           style={{ marginTop: 8 }}
//         />
//       </Card>

//       <Row gutter={[24, 24]}>
//         {/* LEFT */}
//         <Col xs={24} lg={12}>
//           {/* SURVEY */}
//           <Card
//             title={
//               <Space>
//                 <Badge status={survey ? "success" : "processing"} />
//                 Survey
//               </Space>
//             }
//             style={{ marginBottom: 24 }}
//           >
//             {survey ? (
//               <Space direction="vertical">
//                 <Text type="success">✓ Survey Completed</Text>
//                 <Button
//                   icon={<EyeOutlined />}
//                   onClick={() => setOpenViewSurvey(true)}
//                 >
//                   View Survey
//                 </Button>
//               </Space>
//             ) : isAdmin ? (
//               <Button type="primary" onClick={() => setOpenSurveyModal(true)}>
//                 Raise Survey
//               </Button>
//             ) : (
//               <div>Pending</div>
//             )}
//           </Card>

//           {/* COMPLETED TASKS */}
//           <Card
//             title={
//               <Space>
//                 <CheckCircleOutlined style={{ color: "#52c41a" }} />
//                 Completed Tasks ({tasks.length})
//               </Space>
//             }
//           >
//             {tasks.length === 0 ? (
//               <Empty description="No tasks completed" />
//             ) : (
//               <List
//                 dataSource={tasks}
//                 renderItem={(task) => (
//                   <List.Item
//                     actions={[
//                       <Button
//                         type="link"
//                         icon={<EyeOutlined />}
//                         onClick={() => {
//                           setSelectedTask(task);
//                           setOpenViewTask(true);
//                         }}
//                       >
//                         View
//                       </Button>,
//                     ]}
//                   >
//                     <List.Item.Meta
//                       title={task.task_type}
//                       description={`Completed on ${new Date(
//                         task.updatedAt
//                       ).toLocaleDateString()}`}
//                     />
//                   </List.Item>
//                 )}
//               />
//             )}
//           </Card>
//         </Col>

//         {/* RIGHT */}
//         <Col xs={24} lg={12}>
//           <Card
//             title={
//               <Space>
//                 <ClockCircleOutlined style={{ color: "#faad14" }} />
//                 Pending Tasks ({pendingTasks.length})
//               </Space>
//             }
//           >
//             {pendingTasks.length === 0 ? (
//               <Text type="success">🎉 All tasks completed</Text>
//             ) : (
//               <Space wrap>
//                 {pendingTasks.map((t) => (
//                   <Tag key={t} color="orange">
//                     {t}
//                   </Tag>
//                 ))}
//               </Space>
//             )}

//             <Divider />

//             {isAdmin && (
//               <Button
//                 type="primary"
//                 icon={<EditOutlined />}
//                 block
//                 onClick={() => setOpenTaskModal(true)}
//               >
//                 Update Task
//               </Button>
//             )}
//           </Card>
//         </Col>
//       </Row>

//       {/* MODALS */}
//       <UpdateTaskModal
//         open={openTaskModal}
//         onClose={() => setOpenTaskModal(false)}
//         locationDocumentId={id}
//         pendingTasks={pendingTasks}
//         onSuccess={() => window.location.reload()}
//       />

//       <RaiseSurveyModal
//         open={openSurveyModal}
//         onClose={() => setOpenSurveyModal(false)}
//         locationDocumentId={id}
//         onSuccess={() => window.location.reload()}
//       />

//       <ViewSurveyModal
//         open={openViewSurvey}
//         onClose={() => setOpenViewSurvey(false)}
//         survey={survey}
//       />

//       <ViewTaskModal
//         open={openViewTask}
//         onClose={() => setOpenViewTask(false)}
//         task={selectedTask}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Divider,
  Button,
  Tag,
  Space,
  Spin,
  Empty,
  List,
  Modal,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

import UpdateTaskModal from "../components/UpdatetaskModal";
import RaiseSurveyModal from "../components/RaiseSurveyModal";
import ViewTaskModal from "../components/ViewTaskModal";
import ViewSurveyModal from "../components/ViewSurveyModal";

const { Title, Text } = Typography;

const API = "http://173.249.6.61:1337/api";

const TASK_ENUM = [
  "ESCALATION",
  "IRON_WORK",
  "BASEMENT",
  "POLE_ELEVATION",
  "ROCK_FIXING",
  "WIRING",
  "CAMERA_FIXING",
  "POE_SWITCH_INSTALLATION",
  "CONFIGURATION",
  "COMMISSIONING",
  "INTERNET_STATUS",
  "ELECTRICITY_STATUS",
  "FINAL_HANDOVER",
];

const TOTAL_WORK = TASK_ENUM.length + 1; // +1 Survey

// Color constants - matching the dashboard
const CARD_COLORS = {
  orange: {
    bg: "#FFF7E6",
    border: "#FFD591",
    accent: "#FB9F3D",
    black: "#000",
  },
  teal: { bg: "#E6F9F9", border: "#87E8DE", accent: "#1E9CAD" },
  purple: { bg: "#F9F0FF", border: "#D3ADF7", accent: "#8B5CF6" },
};

export default function LocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openSurveyModal, setOpenSurveyModal] = useState(false);
  const [openViewSurvey, setOpenViewSurvey] = useState(false);
  const [openViewTask, setOpenViewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const isAdmin = user?.role?.type === "admin";

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/locations/${id}`).then((r) => r.json()),
      fetch(
        `${API}/tasks?filters[location][documentId]=${id}&populate=images`
      ).then((r) => r.json()),
      fetch(
        `${API}/surveys?filters[location][documentId]=${id}&populate=images`
      ).then((r) => r.json()),
    ]).then(([locRes, taskRes, surveyRes]) => {
      setLocation(locRes?.data || null);
      setTasks(taskRes?.data || []);
      setSurvey((surveyRes?.data || [])[0] || null);
      setLoading(false);
    });
  }, [id]);

  /* ---------------- DERIVED DATA ---------------- */
  const completedTaskTypes = useMemo(
    () => tasks.map((t) => t.task_type),
    [tasks]
  );

  const pendingTasks = useMemo(
    () => TASK_ENUM.filter((t) => !completedTaskTypes.includes(t)),
    [completedTaskTypes]
  );

  const completedCount = completedTaskTypes.length + (survey ? 1 : 0);
  const progressPercent = Math.round((completedCount / TOTAL_WORK) * 100);

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!location) {
    return <Empty description="Location not found" />;
  }

  /* ---------------- UI ---------------- */
  return (
    <div
      style={{
        padding: 24,
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
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* BACK BUTTON */}
        <Button
          type="link"
          //   icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ paddingLeft: 0, marginBottom: 16, fontSize: 14 }}
        >
          ← Back to Locations
        </Button>

        {/* HEADER CARD */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 12,
            border: `2px solid ${CARD_COLORS.orange.border}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            background: CARD_COLORS.orange.bg,
          }}
        >
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} sm={16}>
              <Title level={2} style={{ marginBottom: 4, color: "#262626" }}>
                {location.name}
              </Title>
              <Text style={{ fontSize: 14, color: "#666666" }}>
                📍 Lat: {location.latitude} | Long: {location.longitude}
              </Text>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: "right" }}>
              <Tag
                color={
                  progressPercent === 100
                    ? "#52c41a"
                    : progressPercent > 0
                    ? CARD_COLORS.orange.accent
                    : "#d9d9d9"
                }
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 12px",
                  color: "black",
                }}
              >
                {progressPercent === 100 ? "✓ COMPLETED" : "IN PROGRESS"}
              </Tag>
            </Col>
          </Row>

          <Divider style={{ margin: "16px 0" }} />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Text strong style={{ color: "#262626", fontSize: 14 }}>
                Overall Progress
              </Text>
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={progressPercent}
                  status={progressPercent === 100 ? "success" : "active"}
                  strokeColor={CARD_COLORS.orange.accent}
                  format={(p) => `${completedCount} / ${TOTAL_WORK}`}
                />
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong style={{ color: "#262626", fontSize: 14 }}>
                Completion Status
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: CARD_COLORS.orange.accent,
                  }}
                >
                  {progressPercent}%
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* CONTENT ROW */}
        <Row gutter={[24, 24]}>
          {/* LEFT COLUMN */}
          <Col xs={24} lg={12}>
            {/* SURVEY CARD */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 12,
                border: `2px solid ${CARD_COLORS.teal.border}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                background: CARD_COLORS.teal.bg,
              }}
              title={
                <Space style={{ fontSize: 16, fontWeight: 600 }}>
                  <Badge
                    status={survey ? "success" : "processing"}
                    color={survey ? "#52c41a" : CARD_COLORS.teal.accent}
                  />
                  <span style={{ color: "#262626" }}>Survey</span>
                </Space>
              }
            >
              {survey ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "rgba(82, 196, 26, 0.1)",
                      borderRadius: 8,
                      borderLeft: "4px solid #52c41a",
                    }}
                  >
                    <Text strong style={{ color: "#52c41a", fontSize: 14 }}>
                      ✓ Survey Completed
                    </Text>
                  </div>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => setOpenViewSurvey(true)}
                    style={{
                      borderRadius: 8,
                      height: 40,
                      fontWeight: 600,
                      border: `2px solid ${CARD_COLORS.teal.accent}`,
                      color: CARD_COLORS.teal.accent,
                    }}
                    block
                  >
                    View Survey Details
                  </Button>
                </Space>
              ) : isAdmin ? (
                <Button
                  type="primary"
                  onClick={() => setOpenSurveyModal(true)}
                  style={{
                    background: CARD_COLORS.teal.accent,
                    borderColor: CARD_COLORS.teal.accent,
                    borderRadius: 8,
                    height: 40,
                    fontWeight: 600,
                  }}
                  block
                >
                  + Raise Survey
                </Button>
              ) : (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "rgba(159, 159, 159, 0.1)",
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <Text type="secondary">Pending Survey</Text>
                </div>
              )}
            </Card>

            {/* COMPLETED TASKS CARD */}
            <Card
              style={{
                borderRadius: 12,
                border: `2px solid ${CARD_COLORS.purple.border}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                // background: CARD_COLORS.purple.bg,
              }}
              title={
                <Space style={{ fontSize: 16, fontWeight: 600 }}>
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: 18 }}
                  />
                  <span style={{ color: "#262626" }}>
                    Completed Tasks ({tasks.length})
                  </span>
                </Space>
              }
            >
              {tasks.length === 0 ? (
                <Empty description="No tasks completed yet" />
              ) : (
                <List
                  dataSource={tasks}
                  renderItem={(task) => (
                    <List.Item
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                      }}
                      actions={[
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenViewTask(true);
                          }}
                          style={{ color: CARD_COLORS.purple.accent }}
                        >
                          View
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <CheckCircleOutlined
                            style={{ color: "#52c41a", fontSize: 18 }}
                          />
                        }
                        title={
                          <Text strong style={{ color: "#262626" }}>
                            {task.task_type}
                          </Text>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          {/* RIGHT COLUMN */}
          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: 12,
                border: `2px solid ${CARD_COLORS.orange.border}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                background: CARD_COLORS.orange.bg,
                height: "100%",
              }}
              title={
                <Space style={{ fontSize: 16, fontWeight: 600 }}>
                  <ClockCircleOutlined
                    style={{
                      color: CARD_COLORS.orange.black,
                      fontSize: 18,
                    }}
                  />
                  <span style={{ color: "#262626" }}>
                    Pending Tasks ({pendingTasks.length})
                  </span>
                </Space>
              }
            >
              <div>
                {pendingTasks.length === 0 ? (
                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      backgroundColor: "rgba(82, 196, 26, 0.1)",
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                      🎉 All tasks completed!
                    </Text>
                  </div>
                ) : (
                  <Space wrap style={{ marginBottom: 16 }}>
                    {pendingTasks.map((t) => (
                      <Tag
                        key={t}
                        color={CARD_COLORS.orange.black}
                        style={{
                          padding: "6px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          //   color: "white",
                        }}
                      >
                        {t}
                      </Tag>
                    ))}
                  </Space>
                )}

                <Divider style={{ margin: "16px 0" }} />

                {isAdmin && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    block
                    onClick={() => setOpenTaskModal(true)}
                    style={{
                      background: CARD_COLORS.orange.accent,
                      borderColor: CARD_COLORS.orange.accent,
                      borderRadius: 8,
                      height: 42,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Update Task Status
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* MODALS */}
      <UpdateTaskModal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        locationDocumentId={id}
        pendingTasks={pendingTasks}
        onSuccess={() => window.location.reload()}
      />

      <RaiseSurveyModal
        open={openSurveyModal}
        onClose={() => setOpenSurveyModal(false)}
        locationDocumentId={id}
        onSuccess={() => window.location.reload()}
      />

      <ViewSurveyModal
        open={openViewSurvey}
        onClose={() => setOpenViewSurvey(false)}
        survey={survey}
      />

      <ViewTaskModal
        open={openViewTask}
        onClose={() => setOpenViewTask(false)}
        task={selectedTask}
      />
    </div>
  );
}
