// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

// const API = 'http://173.249.6.61:1337/api';

// export default function RaiseSurveyModal({ open, onClose, locationDocumentId, onSuccess }) {
//   const [surveyDate, setSurveyDate] = useState('');
//   const [networkType, setNetworkType] = useState('');
//   const [powerAvailable, setPowerAvailable] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [images, setImages] = useState([]);
//   const [saving, setSaving] = useState(false);

//   const handleSubmit = async () => {
//     if (!surveyDate) return alert('Survey date is required');
//     if (!powerAvailable) return alert('Select power availability');

//     setSaving(true);

//     try {
//       // 1️⃣ Upload images first
//       let uploadedImageIds = [];

//       if (images.length > 0) {
//         const fd = new FormData();
//         images.forEach((f) => fd.append('files', f));

//         const uploadRes = await fetch(`${API}/upload`, {
//           method: 'POST',
//           body: fd
//         });

//         if (!uploadRes.ok) {
//           setSaving(false);
//           alert('Image upload failed');
//           return;
//         }

//         const uploaded = await uploadRes.json();
//         uploadedImageIds = uploaded.map((f) => f.id); // IMPORTANT
//       }

//       // 2️⃣ Create survey
//       const res = await fetch(`${API}/surveys`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           data: {
//             survey_date: surveyDate,
//             network_type: networkType || null,
//             power_available: powerAvailable, // "Yes" | "No"
//             remarks,
//             images: uploadedImageIds,
//             location: {
//               connect: [{ documentId: locationDocumentId }]
//             }
//           }
//         })
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         console.error('Survey create failed:', err);
//         alert('Failed to raise survey');
//         setSaving(false);
//         return;
//       }

//       onSuccess();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Raise Survey</DialogTitle>

//       <DialogContent>
//         <TextField
//           type="date"
//           fullWidth
//           label="Survey Date"
//           margin="normal"
//           InputLabelProps={{ shrink: true }}
//           value={surveyDate}
//           onChange={(e) => setSurveyDate(e.target.value)}
//         />

//         <TextField
//           select
//           fullWidth
//           label="Network Type"
//           margin="normal"
//           value={networkType}
//           onChange={(e) => setNetworkType(e.target.value)}
//         >
//           <MenuItem value="ok">OK</MenuItem>
//           <MenuItem value="not_possible">Not Possible</MenuItem>
//           <MenuItem value="rf_link">RF Link</MenuItem>
//         </TextField>

//         <TextField
//           select
//           fullWidth
//           label="Power Available"
//           margin="normal"
//           value={powerAvailable}
//           onChange={(e) => setPowerAvailable(e.target.value)}
//         >
//           <MenuItem value="Yes">Yes</MenuItem>
//           <MenuItem value="No">No</MenuItem>
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

//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={(e) => setImages(Array.from(e.target.files || []))}
//           style={{ marginTop: 16 }}
//         />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit} disabled={saving}>
//           {saving ? 'Saving...' : 'Submit Survey'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import {
  Modal,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  Space,
  message,
  Spin,
} from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const API = "http://173.249.6.61:1337/api";

export default function RaiseSurveyModal({
  open,
  onClose,
  locationDocumentId,
  onSuccess,
}) {
  const [surveyDate, setSurveyDate] = useState(null);
  const [networkType, setNetworkType] = useState("");
  const [powerAvailable, setPowerAvailable] = useState("");
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
    if (!surveyDate) {
      message.error("Survey date is required");
      return;
    }
    if (!powerAvailable) {
      message.error("Please select power availability");
      return;
    }

    setSaving(true);

    try {
      let uploadedImageIds = [];

      // 1️⃣ Upload images if present
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

      // 2️⃣ Create survey
      const surveyDateStr = surveyDate.format("YYYY-MM-DD");

      const res = await fetch(`${API}/surveys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            survey_date: surveyDateStr,
            network_type: networkType || null,
            power_available: powerAvailable,
            remarks: remarks || "",
            images: uploadedImageIds,
            location: {
              connect: [{ documentId: locationDocumentId }],
            },
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Survey create failed:", err);
        message.error("Failed to raise survey");
        setSaving(false);
        return;
      }

      message.success("Survey submitted successfully");
      setSurveyDate(null);
      setNetworkType("");
      setPowerAvailable("");
      setRemarks("");
      setFileList([]);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Raise Survey"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Spin spinning={saving}>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Survey Date <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <DatePicker
              value={surveyDate}
              onChange={setSurveyDate}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Network Type
            </label>
            <Select
              value={networkType}
              onChange={setNetworkType}
              placeholder="Select network type"
              allowClear
              style={{ width: "100%" }}
              options={[
                { label: "OK", value: "ok" },
                { label: "Not Possible", value: "not_possible" },
                { label: "RF Link", value: "rf_link" },
              ]}
            />
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Power Available <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <Select
              value={powerAvailable}
              onChange={setPowerAvailable}
              placeholder="Select power availability"
              style={{ width: "100%" }}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
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
              placeholder="Enter any additional remarks..."
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
              Submit Survey
            </Button>
          </Space>
        </div>
      </Spin>
    </Modal>
  );
}
