// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';

// const API = 'http://173.249.6.61:1337';

// export default function ViewSurveyModal({ open, onClose, survey }) {
//   if (!survey) return null;

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Survey Details</DialogTitle>

//       <DialogContent dividers>
//         <Typography>
//           <b>Date:</b> {survey.survey_date}
//         </Typography>
//         <Typography>
//           <b>Network:</b> {survey.network_type}
//         </Typography>
//         <Typography>
//           <b>Power Available:</b> {survey.power_available}
//         </Typography>
//         <Typography>
//           <b>Remarks:</b> {survey.remarks || '-'}
//         </Typography>

//         <Typography sx={{ mt: 2 }}>
//           <b>Images</b>
//         </Typography>

//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           {(survey.images || []).map((img) => (
//             <Grid item xs={4} key={img.documentId}>
//               <img
//                 src={`${API}${img.url}`}
//                 alt="task"
//                 style={{
//                   width: '100%',
//                   height: '120px',
//                   objectFit: 'cover',
//                   borderRadius: 6
//                 }}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Box,
  Modal,
  Backdrop,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";

const API = "http://173.249.6.61:1337";

const transitionDuration = { enter: 400, exit: 300 };

export default function ViewSurveyModal({ open, onClose, survey }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  if (!survey) return null;

  const handleImageClick = (img) => {
    setPreviewImage(`${API}${img.url}`);
    setPreviewTitle(img.name || img.filename || "Survey Image");
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      {/* Main Survey Dialog with Slide + Fade Animation */}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up", timeout: transitionDuration }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Fade in={open} timeout={transitionDuration}>
          <div
            style={{
              background: ` radial-gradient(circle at left center, rgb(242 237 217) 0%, transparent 45%), linear-gradient(135deg, rgb(244 231 201) 0%, rgb(255, 241, 198) 30%, rgb(255, 250, 237) 60%, rgb(255, 255, 255) 100%)`,
            }}
          >
            <DialogTitle sx={{ pb: 2 }}>
              <Typography variant="h6" component="div" fontWeight={600}>
                Survey Details
              </Typography>
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  color: "grey.600",
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                }}
              >
                <CloseCircleFilled />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 3 }}>
              <Typography gutterBottom>
                <b>Date:</b> {survey.survey_date || "-"}
              </Typography>
              <Typography gutterBottom>
                <b>Network:</b> {survey.network_type || "-"}
              </Typography>
              <Typography gutterBottom>
                <b>Power Available:</b> {survey.power_available || "-"}
              </Typography>
              <Typography gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                <b>Remarks:</b> {survey.remarks || "-"}
              </Typography>

              <Typography sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                Images ({(survey.images || []).length})
              </Typography>

              {(survey.images || []).length === 0 ? (
                <Typography color="text.secondary" fontStyle="italic">
                  No images uploaded
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {survey.images.map((img, index) => (
                    <Grid item xs={6} sm={4} key={img.documentId || index}>
                      <Box
                        sx={{
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.05)",
                            boxShadow: 8,
                          },
                        }}
                        onClick={() => handleImageClick(img)}
                      >
                        <img
                          src={`${API}${img.url}`}
                          alt={img.name || "survey"}
                          style={{
                            width: "100%",
                            height: "140px",
                            objectFit: "cover",
                            display: "block",
                          }}
                          loading="lazy"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </DialogContent>
          </div>
        </Fade>
      </Dialog>

      {/* Image Preview Modal with Zoom + Fade Animation */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={previewOpen} timeout={400}>
          <Zoom in={previewOpen} timeout={500}>
            <Box
              sx={{
                position: "relative",
                maxWidth: "95vw",
                maxHeight: "95vh",
                bgcolor: "background.paper",
                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
                borderRadius: 3,
                outline: "none",
                overflow: "hidden",
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={handleClosePreview}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "grey.800",
                  zIndex: 10,
                  "&:hover": {
                    bgcolor: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <CloseOutlined style={{ fontSize: 28 }} />
              </IconButton>

              {/* Image Content */}
              <Box
                sx={{
                  p: { xs: 2, sm: 4 },
                  textAlign: "center",
                  maxHeight: "95vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    mb: 3,
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {previewTitle}
                </Typography>

                <Box
                  component="img"
                  src={previewImage}
                  alt={previewTitle}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    borderRadius: 2,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                  loading="lazy"
                />
              </Box>
            </Box>
          </Zoom>
        </Fade>
      </Modal>
    </>
  );
}

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Grid,
//   IconButton,
//   Box,
//   Modal,
//   Backdrop,
// } from "@mui/material";
// import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";

// const API = "http://173.249.6.61:1337";

// export default function ViewSurveyModal({ open, onClose, survey }) {
//   // Preview modal state
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [previewTitle, setPreviewTitle] = useState("");

//   if (!survey) return null;

//   const handleImageClick = (img) => {
//     setPreviewImage(`${API}${img.url}`);
//     setPreviewTitle(img.name || img.filename || "Survey Image");
//     setPreviewOpen(true);
//   };

//   const handleClosePreview = () => {
//     setPreviewOpen(false);
//   };

//   return (
//     <>
//       {/* Main Survey Dialog */}
//       <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//         <DialogTitle>
//           Survey Details
//           <IconButton
//             aria-label="close"
//             onClick={onClose}
//             sx={{ position: "absolute", right: 8, top: 8 }}
//           >
//             <CloseCircleFilled />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Typography gutterBottom>
//             <b>Date:</b> {survey.survey_date}
//           </Typography>
//           <Typography gutterBottom>
//             <b>Network:</b> {survey.network_type || "-"}
//           </Typography>
//           <Typography gutterBottom>
//             <b>Power Available:</b> {survey.power_available}
//           </Typography>
//           <Typography gutterBottom>
//             <b>Remarks:</b> {survey.remarks || "-"}
//           </Typography>

//           <Typography sx={{ mt: 3, mb: 1 }}>
//             <b>Images ({(survey.images || []).length})</b>
//           </Typography>

//           {(survey.images || []).length === 0 ? (
//             <Typography color="text.secondary">No images uploaded</Typography>
//           ) : (
//             <Grid container spacing={2}>
//               {survey.images.map((img) => (
//                 <Grid item xs={6} sm={4} key={img.documentId}>
//                   <Box
//                     sx={{
//                       cursor: "pointer",
//                       borderRadius: 2,
//                       overflow: "hidden",
//                       boxShadow: 1,
//                       transition: "transform 0.2s, box-shadow 0.2s",
//                       "&:hover": {
//                         transform: "scale(1.05)",
//                         boxShadow: 6,
//                       },
//                     }}
//                     onClick={() => handleImageClick(img)}
//                   >
//                     <img
//                       src={`${API}${img.url}`}
//                       alt={img.name || "survey"}
//                       style={{
//                         width: "100%",
//                         height: "130px",
//                         objectFit: "cover",
//                         display: "block",
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Image Preview Modal */}
//       <Modal
//         open={previewOpen}
//         onClose={handleClosePreview}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{ timeout: 500 }}
//         sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//       >
//         <Box
//           sx={{
//             position: "relative",
//             maxWidth: "90vw",
//             maxHeight: "90vh",
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             borderRadius: 2,
//             outline: "none",
//           }}
//         >
//           <IconButton
//             onClick={handleClosePreview}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               bgcolor: "rgba(255,255,255,0.8)",
//               "&:hover": { bgcolor: "rgba(255,255,255,1)" },
//               zIndex: 1,
//             }}
//           >
//             <CloseOutlined />
//           </IconButton>

//           <Box sx={{ p: 2, textAlign: "center" }}>
//             <Typography variant="h6" gutterBottom>
//               {previewTitle}
//             </Typography>
//             <img
//               src={previewImage}
//               alt={previewTitle}
//               style={{
//                 maxWidth: "100%",
//                 maxHeight: "80vh",
//                 objectFit: "contain",
//               }}
//             />
//           </Box>
//         </Box>
//       </Modal>
//     </>
//   );
// }
