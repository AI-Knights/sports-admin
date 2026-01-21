"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Sidebar from "../Sidebar/Sidebar"

export default function MobileSidebar({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />

          {/* drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 z-50 w-64 h-full bg-slate-900 p-4 md:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="mb-4"
            >
              <X />
            </button>

            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
