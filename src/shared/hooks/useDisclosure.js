// useDisclosure.js
import { useState, useCallback } from "react";
export function useDisclosure(initial = false) {
  const [isOpen, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((v) => !v), []);
  return { isOpen, onOpen, onClose, onToggle };
}
