'use client';

import { useEffect, useState } from 'react';

type FileInfo = {
  name: string;
  size: number | null;
  date: string;
  isDirectory: boolean;
};

export default function Page() {
  const [time, setTime] = useState<string | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        // 从 public 目录读取 files.json
        const response = await fetch('/filesinfo.json', {
          cache: 'no-store', // 每次都重新获取
        });
        const update_resp = await fetch('/update', {
          cache: 'no-store', // 每次都重新获取
        });
        
        if (!response.ok || !update_resp.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const update_time = await update_resp.text();
        setFiles(data);
        setTime(update_time);
        setError(null);
      } catch (err) {
        console.error('Failed to load files:', err);
        setError('无法加载文件列表');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在加载文件列表...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 空状态
  if (files.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">暂无文件</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 font-mono text-sm">
      <h1 className="text-xl font-bold mb-2 text-gray-800">Index of /filesystem/</h1>
      <p className="text-gray-500 text-xs mb-4">
        Updated at {time}
      </p>
      
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last modified
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <a 
                  href=".." 
                  className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2"
                >
                  <span className="text-lg">📁</span>
                  <span>Parent Directory</span>
                </a>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">-</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">-</td>
            </tr>
            
            {files.map((file, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  {file.isDirectory ? (
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-lg">📁</span>
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <a 
                      href={`/filesystem/${file.name}`}
                      className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2"
                      download
                    >
                      <span className="text-lg">📄</span>
                      <span>{file.name}</span>
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {file.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {file.isDirectory ? '-' : formatFileSize(file.size || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <footer className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-400 text-xs">
          <span className="font-medium">FileSystem v1.0.0</span> Powered by Cloudflare Workers
        </p>
      </footer>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} K`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} G`;
}