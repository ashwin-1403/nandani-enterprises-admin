import { useState, useEffect } from "react";

const useDebounce = (value, delay, setCurrentPage) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (value?.length > 0) {
        setCurrentPage(1);
      }
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timeoutID);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
