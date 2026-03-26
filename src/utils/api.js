import axios from 'axios';

const BASE_URL = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// 請求攔截器：自動加入 accessToken
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 回應攔截器：處理 401 並自動刷新 Token
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // 如果是 401 且不是刷新請求，也不是登入請求
        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('api/auth/login')
        ) {
            if (isRefreshing) {
                // 如果正在刷新，則把請求存入隊列
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            console.log('Access token expired, attempting to refresh...');
            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                console.warn('No refresh token found, redirecting to login');
                localStorage.clear();
                window.location.href = `${BASE_URL}admin/login`;
                return Promise.reject(error);
            }

            try {
                // 發送刷新 Token 的請求 (@RequestParam 指定用 params)
                const response = await axios.post(`${BASE_URL}api/auth/refresh`, null, {
                    params: { refreshToken }
                });

                console.log('Token refreshed successfully!');
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // 保存新 Token
                localStorage.setItem('accessToken', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                // 處理隊列中等待的請求
                processQueue(null, accessToken);

                // 重試原請求
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh Token 也過期了，清空並引導登入
                localStorage.clear();
                window.location.href = `${BASE_URL}admin/login`;
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// 包裝常用的方法以相容之前的用法
export const request = {
    get: (url, config) => api.get(url, config),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),
};

// 同時提供具名導出與默認導出
export { api };
export default api;

