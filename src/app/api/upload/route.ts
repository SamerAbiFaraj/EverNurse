// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

// Simple file-based database for now
const DB_FILE = './uploads/database.json';

async function readDatabase() {
    try {
        const data = await readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Return empty database if file doesn't exist
        return { files: [], candidates: [], matches: [] };
    }
}

async function writeDatabase(data: any) {
    await mkdir('./uploads', { recursive: true });
    await writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
    console.log('🎯 UPLOAD API CALLED - Processing files...');

    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        console.log(`📁 Received ${files.length} file(s)`);

        if (files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        const uploadDir = './uploads';
        await mkdir(uploadDir, { recursive: true });

        const results = [];
        const db = await readDatabase();

        // Ensure arrays exist
        if (!db.files) db.files = [];
        if (!db.candidates) db.candidates = [];
        if (!db.matches) db.matches = [];

        for (const file of files) {
            console.log(`📄 Processing: ${file.name} (${file.type})`);

            try {
                // Validate file type
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];

                if (!allowedTypes.includes(file.type)) {
                    console.log('❌ Invalid file type');
                    results.push({
                        originalName: file.name,
                        status: 'error',
                        error: `Invalid file type. Only PDF, DOC, and DOCX are allowed.`
                    });
                    continue;
                }

                // Validate file size (10MB max)
                const maxSize = 10 * 1024 * 1024;
                if (file.size > maxSize) {
                    console.log('❌ File too large');
                    results.push({
                        originalName: file.name,
                        status: 'error',
                        error: `File too large. Maximum size is 10MB.`
                    });
                    continue;
                }

                // Save file
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const timestamp = Date.now();
                const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `${timestamp}-${safeFilename}`;
                const filePath = join(uploadDir, filename);

                console.log('💾 Saving file...');
                await writeFile(filePath, buffer);

                // Create file record in our simple database
                const fileRecord = {
                    id: `file-${timestamp}`,
                    filename,
                    originalName: file.name,
                    filePath,
                    fileSize: file.size,
                    mimetype: file.type,
                    status: 'processing',
                    uploadedAt: new Date().toISOString()
                };

                db.files.push(fileRecord);
                await writeDatabase(db);

                console.log('✅ File saved and recorded:', fileRecord.id);

                results.push({
                    id: fileRecord.id,
                    originalName: file.name,
                    status: 'processing',
                    message: 'File uploaded successfully - ready for parsing'
                });

            } catch (fileError) {
                console.error(`❌ Error processing ${file.name}:`, fileError);
                results.push({
                    originalName: file.name,
                    status: 'error',
                    error: `File processing failed: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`
                });
            }
        }

        console.log('✅ Upload completed successfully');

        return NextResponse.json({
            success: true,
            data: results,
            message: `Processed ${results.length} file(s)`
        });

    } catch (error) {
        console.error('❌ Upload API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Upload failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const db = await readDatabase();
        return NextResponse.json({
            message: 'Upload API is working',
            stats: {
                totalFiles: db.files?.length || 0,
                uploadedFiles: db.files?.filter((f: any) => f.status === 'processing').length || 0
            }
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Upload API is working (no database yet)'
        });
    }
}