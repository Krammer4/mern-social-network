import React from "react";
import { motion } from "framer-motion";

import "./WarningMessage.css";

export const WarningMessage = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, opacity: 0 }}
      animate={{ opacity: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="warning-message">{message}</div>
    </motion.div>
  );
};
