module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/api/upload/route.ts
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Simple file-based database for now
const DB_FILE = './uploads/database.json';
async function readDatabase() {
    try {
        const data = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["readFile"])(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Return empty database if file doesn't exist
        return {
            files: [],
            candidates: [],
            matches: []
        };
    }
}
async function writeDatabase(data) {
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])('./uploads', {
        recursive: true
    });
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(DB_FILE, JSON.stringify(data, null, 2));
}
async function POST(request) {
    console.log('🎯 UPLOAD API CALLED - Processing files...');
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        console.log(`📁 Received ${files.length} file(s)`);
        if (files.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No files provided'
            }, {
                status: 400
            });
        }
        // Ensure upload directory exists
        const uploadDir = './uploads';
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])(uploadDir, {
            recursive: true
        });
        const results = [];
        const db = await readDatabase();
        // Ensure arrays exist
        if (!db.files) db.files = [];
        if (!db.candidates) db.candidates = [];
        if (!db.matches) db.matches = [];
        for (const file of files){
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
                const filePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(uploadDir, filename);
                console.log('💾 Saving file...');
                await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filePath, buffer);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: results,
            message: `Processed ${results.length} file(s)`
        });
    } catch (error) {
        console.error('❌ Upload API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        const db = await readDatabase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Upload API is working',
            stats: {
                totalFiles: db.files?.length || 0,
                uploadedFiles: db.files?.filter((f)=>f.status === 'processing').length || 0
            }
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Upload API is working (no database yet)'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b0031b93._.js.map