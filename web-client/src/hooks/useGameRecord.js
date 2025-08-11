import { useState, useCallback } from "react";
import { saveGameRecord, fetchGameRecord } from "../api/gameApi";
import { getAuthCookie } from "../utils/storage";

export function useGameRecord() {
  const [loading, setLoading] = useState(false);

  const saveRecord = useCallback(async (record) => {
    setLoading(true);

    try {
      const token = getAuthCookie();
      if (!token) return false;

      const [status, data] = await saveGameRecord(token, record);
      
      if (status >= 200 && status < 300) {
        return true;
      } else {
        console.error('API 에러:', status, data.message);
        return false;
      }
    } catch (err) {
      console.error('네트워크/기타 에러:', err);
      return false;
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  const getRecords = useCallback(async () => {
    setLoading(true);

    try {
      const token = getAuthCookie();
      if (!token) {
        return false;
      }
      const [status, data] = await fetchGameRecord(token);
      if (status >= 200 && status < 300) {
        return data;
      } else {
        console.error('API 에러:', status, data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveRecord,
    getRecords,
    recordLoading: loading,
  };
}
