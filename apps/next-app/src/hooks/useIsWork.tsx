import { useEffect, useState } from "react";

export const useIsWork = () => {
  const [isWork, setIsWork] = useState<string>("");
  useEffect(() => {
    const workOrLife = localStorage.getItem("WorkOrLife");
    if (workOrLife) {
      setIsWork(workOrLife);
    }
  }, [])
  return isWork;
};