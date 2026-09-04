import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function useFetch(url) {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const fetchData = useCallback(async (signal) => {

        setLoading(true);
        setError(null);

        try {

            const res = await axios.get(url, { signal });
            setData(res.data);

        } catch (err) {

            if (axios.isCancel(err) || err.name === "CanceledError") return;
            if (err.response) {
                setError(`Server error: ${err.response.status}`);
            } else if (err.request) {
                setError("no response from server. Check your connection ");
            } else {
                setError("Something went wrong.Please try again.");
            }

        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [url]);


    useEffect(() => {
        
        const controller = new AbortController();

        Promise.resolve().then(() => fetchData(controller.signal));

        return () => controller.abort();
   
    }, [fetchData]);



    return { data, loading, error, refetch: () => fetchData() };
}

export default useFetch;