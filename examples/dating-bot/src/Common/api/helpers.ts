import { useCallback, useEffect, useState } from 'react';

type ApiGetFunction<ARG_TYPE extends unknown[], RESPONSE_TYPE> = (...params: ARG_TYPE) => Promise<RESPONSE_TYPE>;

// TODO: Move to separate function
export function useApiFunctionHelper<RESPONSE_TYPE>() {
    const [data, setData] = useState<{
        data: RESPONSE_TYPE | undefined;
        loading: boolean;
        error: string | undefined;
    }>({
        data: undefined,
        loading: true,
        error: undefined,
    });

    const setErrorString = useCallback(
        (error: unknown) =>
            setData({
                data: undefined,
                loading: false,
                error: String(error),
            }),
        [setData],
    );

    const handleSetData = useCallback(
        (data: RESPONSE_TYPE) => {
            setData({
                data,
                loading: false,
                error: undefined,
            });
        },
        [setData],
    );

    return {
        data: data.data,
        loading: data.loading,
        error: data.error,

        setData: handleSetData,
        setError: setErrorString,
    };
}

export function getApiHooksCreator<ARG_TYPE extends unknown[], RESPONSE_TYPE>(
    apiFunction: ApiGetFunction<ARG_TYPE, RESPONSE_TYPE>,
) {
    return function useApiFunction(...params: ARG_TYPE) {
        const { data, error, loading, setData, setError } = useApiFunctionHelper<RESPONSE_TYPE>();

        useEffect(() => {
            apiFunction(...params)
                .then(setData)
                .catch(setError);
        }, [setData, setError, ...params]);

        return {
            data,
            loading,
            error,
        };
    };
}
