import { Card } from "antd";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        style={{
          borderRadius: 18,
          background: "#ffffff",
          boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
          </div>

          <div
            className="h-12 w-12 flex items-center justify-center rounded-xl"
            style={{ background: color }}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
