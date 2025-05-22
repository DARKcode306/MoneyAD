import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TaskCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function TaskCard({ children, onClick, className = "" }: TaskCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`mb-4 ${className}`}
    >
      <Card 
        className="border border-gray-100 shadow-md task-card transition-all duration-200"
        onClick={onClick}
      >
        <CardContent className="p-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
