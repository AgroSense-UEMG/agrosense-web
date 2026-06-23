import { motion } from "framer-motion"
import type { ReactNode } from "react"

export default function SectionAnimation({
  children
}: {
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}