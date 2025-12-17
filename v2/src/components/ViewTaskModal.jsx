// // import React from 'react';
// // import { Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';

// // const API = 'http://173.249.6.61:1337';

// // export default function ViewTaskModal({ open, onClose, task }) {
// //   if (!task) return null;

// //   return (
// //     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
// //       <DialogTitle>Task Details</DialogTitle>

// //       <DialogContent dividers>
// //         <Typography>
// //           <b>Task:</b> {task.task_type}
// //         </Typography>
// //         <Typography>
// //           <b>Completed At:</b> {task.completed_at}
// //         </Typography>
// //         <Typography>
// //           <b>Remarks:</b> {task.remarks || '-'}
// //         </Typography>

// //         <Typography sx={{ mt: 2 }}>
// //           <b>Images</b>
// //         </Typography>

// //         <Grid container spacing={2} sx={{ mt: 1 }}>
// //           {(task.images || []).map((img) => (
// //             <Grid item xs={4} key={img.documentId}>
// //               <img
// //                 src={`${API}${img.url}`}
// //                 alt="task"
// //                 style={{
// //                   width: '100%',
// //                   height: '120px',
// //                   objectFit: 'cover',
// //                   borderRadius: 6
// //                 }}
// //               />
// //             </Grid>
// //           ))}
// //         </Grid>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Typography,
//   Grid,
//   IconButton,
//   Box,
//   Modal,
//   Backdrop,
// } from "@mui/material";
// import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";

// const API = "http://173.249.6.61:1337";

// export default function ViewTaskModal({ open, onClose, task }) {
//   // Preview modal state
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [previewTitle, setPreviewTitle] = useState("");

//   if (!task) return null;

//   const handleImageClick = (img) => {
//     setPreviewImage(`${API}${img.url}`);
//     setPreviewTitle(img.name || img.filename || "Task Image");
//     setPreviewOpen(true);
//   };

//   const handleClosePreview = () => {
//     setPreviewOpen(false);
//   };

//   return (
//     <>
//       {/* Main Task Dialog */}
//       <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//         <DialogTitle>
//           Task Details
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
//             <b>Task:</b> {task.task_type || "-"}
//           </Typography>
//           <Typography gutterBottom>
//             <b>Completed At:</b> {task.completed_at || "-"}
//           </Typography>
//           <Typography gutterBottom>
//             <b>Remarks:</b> {task.remarks || "-"}
//           </Typography>

//           <Typography sx={{ mt: 3, mb: 1 }}>
//             <b>Images ({(task.images || []).length})</b>
//           </Typography>

//           {(task.images || []).length === 0 ? (
//             <Typography color="text.secondary">No images uploaded</Typography>
//           ) : (
//             <Grid container spacing={2}>
//               {task.images.map((img) => (
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
//                       alt={img.name || "task"}
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

import React, { useState, forwardRef } from "react";
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
  Slide,
  Fade,
  Zoom,
} from "@mui/material";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://173.249.6.61:1337";

// Slide-up transition for main dialog
const Transition = forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      timeout={{ enter: 500, exit: 300 }}
      {...props}
    />
  );
});

export default function ViewTaskModal({ open, onClose, task }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  if (!task) return null;

  const handleImageClick = (img) => {
    setPreviewImage(`${API}${img.url}`);
    setPreviewTitle(img.name || img.filename || "Task Image");
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      {/* Main Task Dialog - Slide Up + Fade In */}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            overflow: "hidden",
          },
        }}
      >
        <Fade in={open} timeout={600}>
          <div
            style={{
              background: ` radial-gradient(circle at left center, rgb(242 237 217) 0%, transparent 45%), linear-gradient(135deg, rgb(244 231 201) 0%, rgb(255, 241, 198) 30%, rgb(255, 250, 237) 60%, rgb(255, 255, 255) 100%)`,
            }}
          >
            <DialogTitle sx={{ pb: 2, position: "relative" }}>
              <Typography variant="h6" fontWeight={600}>
                Task Details
              </Typography>
              <IconButton
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
                <b>Task Type:</b> {task.task_type || "-"}
              </Typography>
              <Typography gutterBottom>
                <b>Completed At:</b> {task.completed_at || "-"}
              </Typography>
              <Typography gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                <b>Remarks:</b> {task.remarks || "-"}
              </Typography>

              <Typography sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                Images ({(task.images || []).length})
              </Typography>

              {(task.images || []).length === 0 ? (
                <Typography color="text.secondary" fontStyle="italic">
                  No images uploaded
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {task.images.map((img, index) => (
                    <Grid item xs={6} sm={4} key={img.documentId || index}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.08,
                          type: "spring",
                          stiffness: 100,
                        }}
                        whileHover={{ y: -10, scale: 1.06 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                            borderRadius: 2.5,
                            overflow: "hidden",
                            boxShadow: 3,
                            transition: "box-shadow 0.3s",
                            "&:hover": { boxShadow: 10 },
                          }}
                          onClick={() => handleImageClick(img)}
                        >
                          <img
                            src={`${API}${img.url}`}
                            alt={img.name || "task"}
                            style={{
                              width: "100%",
                              height: "140px",
                              objectFit: "cover",
                              display: "block",
                            }}
                            loading="lazy"
                          />
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}
            </DialogContent>
          </div>
        </Fade>
      </Dialog>

      {/* Image Preview Modal - Dramatic Zoom + Fade with Spring Effect */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.85)" },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5,
              }}
            >
              <Zoom in={previewOpen} timeout={500}>
                <Box
                  sx={{
                    position: "relative",
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    bgcolor: "background.paper",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
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

                  {/* Preview Content */}
                  <Box
                    sx={{
                      p: { xs: 3, sm: 5 },
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
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 3,
                        textShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
                        boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                      }}
                      loading="lazy"
                    />
                  </Box>
                </Box>
              </Zoom>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}
