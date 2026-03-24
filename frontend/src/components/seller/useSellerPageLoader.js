import { useEffect, useState } from "react";

const useSellerPageLoader = (delay = 220) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timerId);
  }, [delay]);

  return isLoading;
};

export default useSellerPageLoader;
