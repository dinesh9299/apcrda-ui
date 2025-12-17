// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

// const API = 'http://173.249.6.61:1337/api';

// export default function UpdateTaskModal({ open, onClose, locationDocumentId, pendingTasks, onSuccess }) {
//   const [taskType, setTaskType] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [images, setImages] = useState([]);
//   const [saving, setSaving] = useState(false);

//   const handleSubmit = async () => {
//     if (!taskType) return alert('Select a task');

//     setSaving(true);

//     let uploadedImageIds = [];

//     if (images.length > 0) {
//       const fd = new FormData();
//       images.forEach((f) => fd.append('files', f));

//       const res = await fetch(`${API}/upload`, {
//         method: 'POST',
//         body: fd
//       });

//       if (!res.ok) {
//         setSaving(false);
//         alert('Image upload failed');
//         return;
//       }

//       const uploaded = await res.json();
//       uploadedImageIds = uploaded.map((f) => f.id);
//     }

//     const res = await fetch(`${API}/tasks`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         data: {
//           task_type: taskType,
//           state: 'completed',
//           completed_at: new Date().toISOString(),
//           remarks,
//           images: uploadedImageIds,
//           location: {
//             connect: [{ documentId: locationDocumentId }]
//           }
//         }
//       })
//     });

//     if (!res.ok) {
//       setSaving(false);
//       alert('Task creation failed');
//       return;
//     }

//     setSaving(false);
//     onSuccess();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       <DialogTitle>Update Task</DialogTitle>

//       <DialogContent>
//         <TextField select fullWidth label="Select Task" margin="normal" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
//           {pendingTasks.map((task) => (
//             <MenuItem key={task} value={task}>
//               {task}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           label="Remarks"
//           margin="normal"
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//         />

//         <input type="file" multiple onChange={(e) => setImages([...e.target.files])} style={{ marginTop: 16 }} />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit} disabled={saving}>
//           {saving ? 'Saving...' : 'Update Task'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import {
  Modal,
  Select,
  Input,
  Button,
  Upload,
  Space,
  message,
  Spin,
} from "antd";
import { FileImageOutlined } from "@ant-design/icons";

const API = "http://173.249.6.61:1337/api";

export default function UpdateTaskModal({
  open,
  onClose,
  locationDocumentId,
  pendingTasks,
  onSuccess,
}) {
  const [taskType, setTaskType] = useState("");
  const [remarks, setRemarks] = useState("");
  const [fileList, setFileList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const getPreviewUrl = (file) => {
    return file.url || file.thumbUrl || URL.createObjectURL(file.originFileObj);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.filter((f) => f.originFileObj || f.response));
  };

  const handleSubmit = async () => {
    if (!taskType) {
      message.error("Please select a task");
      return;
    }

    setSaving(true);

    try {
      let uploadedImageIds = [];

      // Upload images if present
      if (fileList.length > 0) {
        const fd = new FormData();
        fileList.forEach((f) => {
          if (f.originFileObj) {
            fd.append("files", f.originFileObj);
          }
        });

        const uploadRes = await fetch(`${API}/upload`, {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          message.error("Image upload failed");
          setSaving(false);
          return;
        }

        const uploaded = await uploadRes.json();
        uploadedImageIds = uploaded.map((f) => f.id);
      }

      // Create task
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            task_type: taskType,
            state: "completed",
            completed_at: new Date().toISOString(),
            remarks: remarks || "",
            images: uploadedImageIds,
            location: {
              connect: [{ documentId: locationDocumentId }],
            },
          },
        }),
      });

      if (!res.ok) {
        message.error("Task creation failed");
        setSaving(false);
        return;
      }

      message.success("Task updated successfully");
      setTaskType("");
      setRemarks("");
      setFileList([]);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const taskOptions = pendingTasks.map((task) => ({
    label: task,
    value: task,
  }));

  return (
    <Modal
      title="Update Task"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Spin spinning={saving}>
        <div
          style={{
            paddingTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Select Task <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <Select
              value={taskType}
              onChange={setTaskType}
              placeholder="Choose a task to complete"
              allowClear
              style={{ width: "100%" }}
              options={taskOptions}
            />
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Remarks
            </label>
            <Input.TextArea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              placeholder="Add any notes or comments about the completed task..."
              showCount
              maxLength={500}
            />
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: 12, fontWeight: 500 }}
            >
              Upload Images
            </label>
            {/* <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              accept="image/*"
              multiple
              listType="picture-card"
              maxCount={5}
            >
              <div style={{ textAlign: 'center' }}>
                <FileImageOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <p style={{ marginTop: 8, fontSize: 14 }}>Click to upload or drag images</p>
                <p style={{ fontSize: 12, color: '#8c8c8c', margin: 0 }}>Max 5 images</p>
              </div>
            </Upload> */}
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              accept="image/*"
              multiple
              listType="picture-card"
              maxCount={5}
              onPreview={async (file) => {
                const src = getPreviewUrl(file);
                setPreviewImage(src);
                setPreviewTitle(
                  file.name || src.substring(src.lastIndexOf("/") + 1)
                );
                setPreviewOpen(true);
              }}
            >
              {/* your upload slot */}
              <div style={{ textAlign: "center" }}>
                <FileImageOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <p style={{ marginTop: 8, fontSize: 14 }}>
                  Click to upload or drag images
                </p>
                <p style={{ fontSize: 12, color: "#8c8c8c", margin: 0 }}>
                  Max 5 images
                </p>
              </div>
            </Upload>

            {/* Custom Preview Modal */}
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={() => setPreviewOpen(false)}
            >
              <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>

          <Space
            style={{ width: "100%", justifyContent: "flex-end", marginTop: 8 }}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit} loading={saving}>
              Update Task
            </Button>
          </Space>
        </div>
      </Spin>
    </Modal>
  );
}
