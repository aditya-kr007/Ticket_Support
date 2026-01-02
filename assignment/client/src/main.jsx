import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import App from './App';
import './index.css';

const themeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: '#6366f1',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#3b82f6',
        borderRadius: 8,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
        Card: {
            colorBgContainer: 'rgba(30, 30, 46, 0.8)',
            colorBorderSecondary: 'rgba(99, 102, 241, 0.2)',
        },
        Button: {
            colorPrimaryHover: '#818cf8',
        },
        Input: {
            colorBgContainer: 'rgba(30, 30, 46, 0.6)',
            colorBorder: 'rgba(99, 102, 241, 0.3)',
        },
        Select: {
            colorBgContainer: 'rgba(30, 30, 46, 0.6)',
            colorBorder: 'rgba(99, 102, 241, 0.3)',
        },
        Table: {
            colorBgContainer: 'rgba(30, 30, 46, 0.6)',
            headerBg: 'rgba(99, 102, 241, 0.1)',
        }
    }
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider theme={themeConfig}>
            <AntApp>
                <App />
            </AntApp>
        </ConfigProvider>
    </React.StrictMode>
);
