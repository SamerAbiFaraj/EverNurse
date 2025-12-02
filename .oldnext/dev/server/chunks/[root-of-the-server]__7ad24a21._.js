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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/services/embeddingService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmbeddingService",
    ()=>EmbeddingService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
// Initialize OpenAI client
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.OPENAI_API_KEY
});
class EmbeddingService {
    /**
     * Generate embedding vector for text using OpenAI's text-embedding-3-small model
     */ static async generateEmbedding(text) {
        try {
            console.log('🧠 Generating embedding for text (length:', text.length, 'chars)');
            // Truncate text if too long (max ~8000 tokens ≈ 32000 chars)
            const truncatedText = text.substring(0, 32000);
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: truncatedText
            });
            const embedding = response.data[0].embedding;
            console.log('✅ Embedding generated (dimensions:', embedding.length, ')');
            return embedding;
        } catch (error) {
            console.error('❌ Embedding generation failed:', error);
            throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Calculate cosine similarity between two embedding vectors
     * Returns a value between -1 and 1, where 1 means identical, 0 means orthogonal, -1 means opposite
     */ static calculateCosineSimilarity(vec1, vec2) {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have the same dimensions');
        }
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        for(let i = 0; i < vec1.length; i++){
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }
        const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
        if (magnitude === 0) {
            return 0;
        }
        const similarity = dotProduct / magnitude;
        console.log('📊 Cosine similarity:', similarity.toFixed(4));
        return similarity;
    }
    /**
     * Prepare text for embedding generation by combining relevant fields
     */ static prepareJobText(job) {
        const parts = [
            job.title || '',
            job.description || '',
            job.department || '',
            job.location || '',
            (job.requiredSkills || []).join(', '),
            (job.requiredLicenses || []).join(', '),
            job.requirements ? Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements : ''
        ];
        return parts.filter((p)=>p).join('\n');
    }
    /**
     * Prepare candidate text for embedding generation
     */ static prepareCandidateText(candidate) {
        const parts = [
            candidate.name || '',
            `${candidate.experience || 0} years of experience`,
            (candidate.skills || []).join(', '),
            (candidate.licenses || []).join(', '),
            candidate.location || '',
            candidate.rawText || ''
        ];
        return parts.filter((p)=>p).join('\n');
    }
    /**
     * Generate embeddings for multiple texts in a single batch request
     * More efficient than individual requests
     */ static async generateBatchEmbeddings(texts) {
        try {
            if (texts.length === 0) return [];
            console.log(`🧠 Generating ${texts.length} embeddings in batch...`);
            // Truncate each text if too long
            const truncatedTexts = texts.map((text)=>text.substring(0, 32000));
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: truncatedTexts
            });
            const embeddings = response.data.map((item)=>item.embedding);
            console.log(`✅ Generated ${embeddings.length} embeddings`);
            return embeddings;
        } catch (error) {
            console.error('❌ Batch embedding generation failed:', error);
            throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate embeddings for individual skills/requirements
     * Returns a map of skill -> embedding
     */ static async generateSkillEmbeddings(skills) {
        if (skills.length === 0) return new Map();
        const embeddings = await this.generateBatchEmbeddings(skills);
        const skillEmbeddingMap = new Map();
        skills.forEach((skill, index)=>{
            skillEmbeddingMap.set(skill, embeddings[index]);
        });
        return skillEmbeddingMap;
    }
    /**
     * Calculate semantic similarity between a candidate skill and a required skill
     * Returns a similarity score between 0 and 1
     */ static calculateSkillSimilarity(candidateSkillEmbedding, requiredSkillEmbedding) {
        const similarity = this.calculateCosineSimilarity(candidateSkillEmbedding, requiredSkillEmbedding);
        // Normalize to 0-1 range (cosine similarity is -1 to 1)
        return Math.max(0, similarity);
    }
    /**
     * Find the best matching candidate skill for a required skill
     * Returns the best match with its similarity score
     */ static findBestSkillMatch(requiredSkillEmbedding, candidateSkillEmbeddings) {
        let bestMatch = null;
        for (const [skill, embedding] of candidateSkillEmbeddings.entries()){
            const similarity = this.calculateSkillSimilarity(embedding, requiredSkillEmbedding);
            if (!bestMatch || similarity > bestMatch.similarity) {
                bestMatch = {
                    skill,
                    similarity
                };
            }
        }
        return bestMatch;
    }
}
}),
"[project]/src/app/api/jobs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/embeddingService.ts [app-route] (ecmascript)");
;
;
;
;
// Database file path
const DB_PATH = './uploads/database.json';
// Initialize database if it doesn't exist
async function initDatabase() {
    if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(DB_PATH)) {
        const initialDb = {
            candidates: [],
            matches: [],
            jobs: []
        };
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(DB_PATH, JSON.stringify(initialDb, null, 2));
        return initialDb;
    }
    const data = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["readFile"])(DB_PATH, 'utf-8');
    return JSON.parse(data);
}
async function GET(request) {
    try {
        const db = await initDatabase();
        // Get query params
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';
        let jobs = db.jobs || [];
        // Filter active jobs if requested
        if (activeOnly) {
            jobs = jobs.filter((job)=>job.isActive !== false);
        }
        // Sort by creation date (newest first)
        jobs.sort((a, b)=>{
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            jobs,
            count: jobs.length
        });
    } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch jobs'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validate required fields
        const requiredFields = [
            'title',
            'department',
            'location',
            'description'
        ];
        for (const field of requiredFields){
            if (!body[field]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Missing required field: ${field}`
                }, {
                    status: 400
                });
            }
        }
        // Read database
        const db = await initDatabase();
        if (!db.jobs) db.jobs = [];
        // Parse requirements array into structured fields
        const requirements = body.requirements || [];
        const requiredSkills = [];
        const requiredLicenses = [];
        let minExperience = 0;
        // Common license keywords
        const licenseKeywords = [
            'DHA',
            'DOH',
            'MOH',
            'BLS',
            'ACLS',
            'PALS',
            'NRP',
            'RN',
            'LPN',
            'CNA',
            'PMP',
            'PCI-DSS'
        ];
        // Parse each requirement
        for (const req of requirements){
            const reqLower = req.toLowerCase().trim();
            // Check for experience (e.g., "3+ years", "5 years experience")
            const expMatch = reqLower.match(/(\d+)\+?\s*(years?|yrs?)/);
            if (expMatch) {
                const years = parseInt(expMatch[1]);
                if (years > minExperience) {
                    minExperience = years;
                }
                continue; // Don't add to skills
            }
            // Check if it's a license
            const isLicense = licenseKeywords.some((keyword)=>req.toUpperCase().includes(keyword.toUpperCase()));
            if (isLicense) {
                requiredLicenses.push(req.trim());
            } else {
                // It's a skill
                requiredSkills.push(req.trim());
            }
        }
        // Create new job
        const newJob = {
            id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: body.title,
            department: body.department,
            location: body.location,
            description: body.description,
            requirements: body.requirements || [],
            requiredSkills: requiredSkills,
            preferredSkills: body.preferredSkills || [],
            requiredLicenses: requiredLicenses,
            minExperience: minExperience,
            matchThreshold: body.matchThreshold || 70,
            isActive: body.isActive !== undefined ? body.isActive : true,
            salaryRange: body.salaryRange || null,
            benefits: body.benefits || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // Generate embedding for the new job
        try {
            const jobText = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].prepareJobText(newJob);
            newJob.embedding = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].generateEmbedding(jobText);
            newJob.embeddingGeneratedAt = new Date().toISOString();
        } catch (error) {
            console.error('⚠️ Failed to generate embedding for new job:', error);
        // Continue without embedding - it will be generated on demand during matching
        }
        // Add to database
        db.jobs.push(newJob);
        // Save database
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(DB_PATH, JSON.stringify(db, null, 2));
        console.log(`✅ Created job: ${newJob.title} (${newJob.id})`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            job: newJob,
            message: 'Job created successfully'
        }, {
            status: 201
        });
    } catch (error) {
        console.error('❌ Error creating job:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create job'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        if (!body.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Job ID is required'
            }, {
                status: 400
            });
        }
        // Read database
        const db = await initDatabase();
        // Find job index
        const jobIndex = db.jobs.findIndex((j)=>j.id === body.id);
        if (jobIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Job not found'
            }, {
                status: 404
            });
        }
        // Parse requirements array into structured fields if provided
        let parsedFields = {};
        if (body.requirements) {
            const requirements = body.requirements;
            const requiredSkills = [];
            const requiredLicenses = [];
            let minExperience = 0;
            // Common license keywords
            const licenseKeywords = [
                'DHA',
                'DOH',
                'MOH',
                'BLS',
                'ACLS',
                'PALS',
                'NRP',
                'RN',
                'LPN',
                'CNA',
                'PMP',
                'PCI-DSS'
            ];
            // Parse each requirement
            for (const req of requirements){
                const reqLower = req.toLowerCase().trim();
                // Check for experience
                const expMatch = reqLower.match(/(\d+)\+?\s*(years?|yrs?)/);
                if (expMatch) {
                    const years = parseInt(expMatch[1]);
                    if (years > minExperience) {
                        minExperience = years;
                    }
                    continue;
                }
                // Check if it's a license
                const isLicense = licenseKeywords.some((keyword)=>req.toUpperCase().includes(keyword.toUpperCase()));
                if (isLicense) {
                    requiredLicenses.push(req.trim());
                } else {
                    requiredSkills.push(req.trim());
                }
            }
            parsedFields = {
                requirements: requirements,
                requiredSkills: requiredSkills,
                requiredLicenses: requiredLicenses,
                minExperience: minExperience
            };
        }
        // Update job
        const updatedJob = {
            ...db.jobs[jobIndex],
            ...body,
            ...parsedFields,
            updatedAt: new Date().toISOString()
        };
        // Regenerate embedding if critical fields changed
        // (Simplified: just regenerate if description or title changes)
        if (body.description !== db.jobs[jobIndex].description || body.title !== db.jobs[jobIndex].title) {
            try {
                const jobText = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].prepareJobText(updatedJob);
                updatedJob.embedding = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].generateEmbedding(jobText);
                updatedJob.embeddingGeneratedAt = new Date().toISOString();
            } catch (error) {
                console.error('⚠️ Failed to regenerate embedding for updated job:', error);
            }
        }
        db.jobs[jobIndex] = updatedJob;
        // Save database
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(DB_PATH, JSON.stringify(db, null, 2));
        console.log(`✅ Updated job: ${updatedJob.title} (${updatedJob.id})`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            job: updatedJob,
            message: 'Job updated successfully'
        });
    } catch (error) {
        console.error('❌ Error updating job:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update job'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7ad24a21._.js.map