import { useState, useCallback } from "react";
import { saveGameRecord, fetchGameRecord } from "../api/gameApi";
import { getAuthCookie } from "../utils/storage";

export function useGameRecord() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveRecord = useCallback(async (record) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthCookie();

      if (!token) {
        return false;
      }

      const result = await saveGameRecord(token, record);
      return result;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  const getRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthCookie();
      if (!token) {
        return false;
      }
      const result = await fetchGameRecord(token);
      if (result) {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveRecord,
    getRecords,
    recordLoading: loading,
    recordError: error,
  };
}
