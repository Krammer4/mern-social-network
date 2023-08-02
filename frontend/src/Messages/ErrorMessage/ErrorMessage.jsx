import React from "react";

import "./ErrorMessage.css";

export const ErrorMessage = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, opacity: 0 }}
      animate={{ opacity: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="error-message">{message}</div>
    </motion.div>
  );
};
