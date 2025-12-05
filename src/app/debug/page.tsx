// src/app/debug/page.tsx
'use client';

import { useState } from 'react';

export default function DebugPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [testing, setTesting] = useState(false);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testBasicFetch = async () => {
        setTesting(true);
        addLog('Testing basic fetch to /api/upload...');

        try {
            const response = await fetch('/api/upload');
            const text = await response.text();
            addLog(`✅ GET Response: ${text}`);
        } catch (error) {
            addLog(`❌ GET Error: ${error}`);
        } finally {
            setTesting(false);
        }
    };

    const testFileUpload = async () => {
        setTesting(true);
        addLog('Testing file upload with simple text file...');

        try {
            // Create a simple text file for testing
            const blob = new Blob(['This is a test CV file content'], { type: 'text/plain' });
            const testFile = new File([blob], 'test-cv.txt', { type: 'text/plain' });

            const formData = new FormData();
            formData.append('files', testFile);

            addLog('Sending POST request with FormData...');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const text = await response.text();
            addLog(`📨 Response status: ${response.status}`);
            addLog(`📨 Response text: ${text.substring(0, 200)}...`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            addLog('✅ File upload test completed!');

        } catch (error) {
            addLog(`❌ Upload test failed: ${error}`);
        } finally {
            setTesting(false);
        }
    };

    const testValidPdfUpload = async () => {
        setTesting(true);
        addLog('Testing with a simple PDF file...');

        try {
            // Create a minimal PDF file for testing
            const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n190\n%%EOF';
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            const testFile = new File([blob], 'test-cv.pdf', { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('files', testFile);

            addLog('Sending PDF file...');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const text = await response.text();
            addLog(`📨 Response status: ${response.status}`);
            addLog(`📨 Response: ${text}`);

        } catch (error) {
            addLog(`❌ PDF upload failed: ${error}`);
        } finally {
            setTesting(false);
        }
    };

    const clearLogs = () => setLogs([]);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-black mb-6">API Debug Page</h1>

            <div className="space-y-4 mb-6">
                <button
                    onClick={testBasicFetch}
                    disabled={testing}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    Test Basic API
                </button>

                <button
                    onClick={testFileUpload}
                    disabled={testing}
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400 ml-2"
                >
                    Test Text File Upload
                </button>

                <button
                    onClick={testValidPdfUpload}
                    disabled={testing}
                    className="bg-purple-600 text-white px-4 py-2 rounded disabled:bg-gray-400 ml-2"
                >
                    Test PDF Upload
                </button>

                <button
                    onClick={clearLogs}
                    className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
                >
                    Clear Logs
                </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="mb-2 font-bold">Debug Logs:</div>
                <div className="h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <div className="text-black">No logs yet. Click buttons above to test.</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="mb-1 border-b border-gray-700 pb-1">
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h2 className="font-bold mb-2">Current Status:</h2>
                <p>Testing API endpoints without database dependencies...</p>
            </div>
        </div>
    );
}