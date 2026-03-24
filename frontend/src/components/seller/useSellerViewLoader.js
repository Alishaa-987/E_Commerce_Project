import { useEffect, useRef, useState } from "react";

const useSellerViewLoader = (initialKey, delay = 320) => {
  const [activeKey, setActiveKey] = useState(initialKey);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const changeView = (nextKey) => {
    if (nextKey === activeKey) {
      return;
    }

    clearTimeout(timerRef.current);
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setActiveKey(nextKey);
      setIsLoading(false);
    }, delay);
  };

  return {
    activeKey,
    isLoading,
    changeView,
  };
};

export default useSellerViewLoader;
