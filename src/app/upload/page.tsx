'use client';

import { useState } from 'react';

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [debugInfo, setDebugInfo] = useState<string>('');

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            setFiles(Array.from(selectedFiles));
        }
    };

    const uploadFiles = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setResults([]);

        try {
            console.log('🚀 Starting upload...');

            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Upload failed with status ${response.status}`);
            }

            if (result.success) {
                setResults(result.data || []);
                console.log('✅ Upload successful!', result.data);

                // AUTO-TRIGGER PARSING & MATCHING FOR EACH FILE
                for (const fileResult of result.data) {
                    if (fileResult.status === 'processing') {
                        await processCV(fileResult.id);
                    }
                }
            } else {
                throw new Error(result.error || 'Upload failed');
            }

        } catch (error) {
            console.error('❌ Upload failed:', error);
            setResults([{
                originalName: 'Upload Failed',
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            }]);
        } finally {
            setUploading(false);
        }
    };

    // Process CV after upload
    const processCV = async (fileId: string) => {
        try {
            console.log(`🔍 Starting CV processing for: ${fileId}`);

            // Step 1: Parse CV
            const parseResponse = await fetch('/api/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileId }),
            });

            const parseResult = await parseResponse.json();
            console.log('📨 Parse API response:', parseResult);

            if (!parseResponse.ok) {
                const errorDetails = parseResult.details || parseResult.error || 'Unknown parsing error';
                console.error('❌ Parse API failed:', errorDetails);
                throw new Error(`Parsing failed: ${errorDetails}`);
            }

            console.log('✅ CV parsed:', parseResult.candidate.name);

            // Step 2: Find matches
            const matchResponse = await fetch('/api/matching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidateId: parseResult.candidate.id }),
            });

            const matchResult = await matchResponse.json();

            if (!matchResponse.ok) {
                throw new Error(matchResult.error || 'Matching failed');
            }

            console.log('✅ Matches found:', matchResult.matches.length);

            // Update UI with processing results
            setResults(prev => prev.map(result =>
                result.id === fileId
                    ? {
                        ...result,
                        status: 'completed',
                        candidate: parseResult.candidate,
                        matches: matchResult.matches
                    }
                    : result
            ));

        } catch (error) {
            console.error('❌ CV processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';

            setResults(prev => prev.map(result =>
                result.id === fileId
                    ? {
                        ...result,
                        status: 'error',
                        error: `Processing failed: ${errorMessage}`
                    }
                    : result
            ));
        }
    };

    const clearFiles = () => {
        setFiles([]);
        setResults([]);
        setDebugInfo('');
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-black mb-2">Upload CVs</h1>
            <p className="text-black mb-8">
                Upload candidate CVs to automatically match them with open nursing positions
            </p>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors">
                <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-lg font-medium text-black">Drop CV files here or click to browse</p>
                        <p className="text-sm text-black mt-2">Supports PDF, DOC, DOCX files • Max 10MB per file</p>
                    </div>
                </label>

                {files.length > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-black">
                                {files.length} file(s) selected:
                            </p>
                            <button
                                onClick={clearFiles}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Clear All
                            </button>
                        </div>
                        <ul className="text-sm text-black bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">{file.name}</span>
                                    </div>
                                    <span className="text-xs text-black">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={uploadFiles}
                    disabled={uploading || files.length === 0}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    {uploading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing {files.length} File(s)...
                        </>
                    ) : (
                        `Upload ${files.length} CV(s)`
                    )}
                </button>
            </div>

            {/* Success Summary */}
            {results.some(r => r.status === 'completed') && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">CV(s) Successfully Processed!</h3>
                    <p className="text-green-700 mb-6">
                        Your CV(s) have been analyzed and matched with available positions.
                    </p>
                    <a
                        href="/results"
                        className="inline-block bg-[#00A99D] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#008f85] transition-all shadow-md hover:shadow-lg"
                    >
                        Go to Results Dashboard
                    </a>
                </div>
            )}

            {/* Error Display */}
            {results.some(r => r.status === 'error') && (
                <div className="mt-8">
                    {results.filter(r => r.status === 'error').map((result, index) => (
                        <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-red-900">{result.originalName}</span>
                            </div>
                            <p className="text-sm text-red-600 mt-1">{result.error}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}