import { RefObject } from "react";

export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null>) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWith = 240;

    // calculate the initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // check if dropdown would go off the right edge of the viewport
    if (left + dropdownWith > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWith;

      // if still of-screen, align to the right edge of viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWith - 16;
      }
    }

    // ensure dropdown doesn't go off left edge
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
