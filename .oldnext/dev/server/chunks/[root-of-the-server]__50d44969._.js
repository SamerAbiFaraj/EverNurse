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
}
}),
"[project]/src/app/api/matching/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/embeddingService.ts [app-route] (ecmascript)");
;
;
;
// Helper function to get jobs from database
async function getActiveJobs() {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["readFile"])('./uploads/database.json', 'utf-8');
        const database = JSON.parse(db);
        // Get active jobs from database
        const jobs = database.jobs?.filter((job)=>job.isActive !== false) || [];
        // If no jobs in database, return default mock jobs for backward compatibility
        if (jobs.length === 0) {
            console.log('⚠️ No jobs in database, using fallback mock jobs');
            return [
                {
                    id: 'job-1',
                    title: 'Registered Nurse - ICU',
                    department: 'Critical Care',
                    location: 'Dubai',
                    requiredSkills: [
                        'ICU',
                        'Emergency Care',
                        'Patient Assessment'
                    ],
                    requiredLicenses: [
                        'DHA',
                        'DOH'
                    ],
                    minExperience: 3,
                    description: 'ICU Nurse with critical care experience'
                },
                {
                    id: 'job-2',
                    title: 'Pediatric Nurse',
                    department: 'Pediatrics',
                    location: 'Abu Dhabi',
                    requiredSkills: [
                        'Pediatrics',
                        'Patient Care'
                    ],
                    requiredLicenses: [
                        'DOH',
                        'MOH'
                    ],
                    minExperience: 2,
                    description: 'Pediatric nurse for children hospital'
                }
            ];
        }
        return jobs;
    } catch (error) {
        console.error('❌ Error loading jobs:', error);
        return [];
    }
}
class MatchingEngine {
    static async calculateMatch(candidate, job) {
        let score = 0;
        const reasons = [];
        // 1. Experience match (25 points max)
        const minExperience = job.minExperience || 0;
        if (minExperience === 0) {
            // If no experience required, give full points if candidate has ANY experience
            // or if they just meet the "0" requirement.
            score += 25;
            reasons.push('Experience: Met (No minimum required)');
        } else if (candidate.experience >= minExperience) {
            // If they meet the non-zero requirement
            // Base score 15, plus up to 10 for exceeding
            const ratio = candidate.experience / minExperience;
            const expScore = Math.min(25, 15 + (ratio - 1) * 10);
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years (Required: ${minExperience})`);
        } else {
            // Partial score for being close
            const ratio = candidate.experience / minExperience;
            const expScore = ratio * 15; // Max 15 if under qualified
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years (Under qualified)`);
        }
        // 2. Structured Skills match (20 points max)
        let skillsScore = 0;
        const matchedSkills = candidate.skills.filter((skill)=>job.requiredSkills.some((reqSkill)=>reqSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(reqSkill.toLowerCase())));
        if (job.requiredSkills.length === 0) {
            // If no specific skills required, give full points
            score += 20;
            reasons.push('Skills: Met (No specific skills required)');
        } else if (matchedSkills.length > 0) {
            skillsScore = matchedSkills.length / job.requiredSkills.length * 20;
            skillsScore = Math.min(20, skillsScore);
            score += skillsScore;
            reasons.push(`Skills: ${matchedSkills.join(', ')}`);
        }
        // 3. License match (25 points max)
        let licenseScore = 0;
        const matchedLicenses = candidate.licenses.filter((license)=>job.requiredLicenses.includes(license));
        if (job.requiredLicenses.length === 0) {
            // If no licenses required, give full points
            score += 25;
            reasons.push('Licenses: Met (None required)');
        } else if (matchedLicenses.length > 0) {
            licenseScore = matchedLicenses.length / job.requiredLicenses.length * 25;
            score += licenseScore;
            reasons.push(`Licenses: ${matchedLicenses.join(', ')}`);
        }
        // 4. Semantic Similarity (30 points max)
        try {
            let jobEmbedding = job.embedding;
            let candidateEmbedding = candidate.embedding;
            // Generate embeddings if missing
            if (!jobEmbedding) {
                const jobText = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].prepareJobText(job);
                jobEmbedding = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].generateEmbedding(jobText);
                job.embedding = jobEmbedding;
            }
            if (!candidateEmbedding) {
                const candidateText = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].prepareCandidateText(candidate);
                candidateEmbedding = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].generateEmbedding(candidateText);
                candidate.embedding = candidateEmbedding;
            }
            const similarity = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].calculateCosineSimilarity(jobEmbedding, candidateEmbedding);
            // Convert similarity to score
            // We assume relevant matches have similarity > 0.5
            let semanticScore = 0;
            if (similarity > 0.5) {
                // Normalize 0.5-1.0 range to 0-30 points
                semanticScore = (similarity - 0.5) / 0.5 * 30;
            }
            score += semanticScore;
            if (semanticScore > 5) {
                reasons.push(`AI Semantic Match: ${Math.round(similarity * 100)}%`);
            }
        } catch (error) {
            console.error('⚠️ Semantic matching failed:', error);
            // Fallback
            if (job.requiredSkills.length === 0) {
                const descriptionScore = this.analyzeJobDescription(candidate, job);
                score += descriptionScore.score;
                if (descriptionScore.keywords.length > 0) {
                    reasons.push(`Matched keywords (Fallback): ${descriptionScore.keywords.join(', ')}`);
                }
            }
        }
        return {
            score: Math.min(100, Math.round(score)),
            reasons,
            matchedSkills,
            missingRequirements: this.findMissingRequirements(candidate, job)
        };
    }
    static analyzeJobDescription(candidate, job) {
        // Extract keywords from job title and description
        const jobText = `${job.title} ${job.description}`.toLowerCase();
        const candidateText = candidate.rawText.toLowerCase();
        // Common keywords to look for
        const keywords = [
            'project management',
            'banking',
            'credit card',
            'fintech',
            'it',
            'software',
            'development',
            'database',
            'cloud',
            'leadership',
            'management',
            'strategy',
            'planning',
            'agile',
            'scrum',
            'api',
            'integration',
            'consulting',
            'nursing',
            'healthcare',
            'patient care',
            'clinical',
            'emergency'
        ];
        const matchedKeywords = [];
        let keywordMatches = 0;
        for (const keyword of keywords){
            if (jobText.includes(keyword) && candidateText.includes(keyword)) {
                matchedKeywords.push(keyword);
                keywordMatches++;
            }
        }
        // Also check if candidate skills appear in job description
        for (const skill of candidate.skills){
            if (jobText.includes(skill.toLowerCase()) && !matchedKeywords.includes(skill.toLowerCase())) {
                matchedKeywords.push(skill);
                keywordMatches++;
            }
        }
        // Calculate score: up to 30 points
        const score = Math.min(30, keywordMatches * 6);
        return {
            score,
            keywords: matchedKeywords.slice(0, 5) // Limit to top 5 for display
        };
    }
    static findMissingRequirements(candidate, job) {
        const missing = [];
        if (candidate.experience < (job.minExperience || 0)) {
            missing.push(`Needs ${job.minExperience - candidate.experience} more years experience`);
        }
        const missingLicenses = job.requiredLicenses.filter((license)=>!candidate.licenses.includes(license));
        if (missingLicenses.length > 0) {
            missing.push(`Missing licenses: ${missingLicenses.join(', ')}`);
        }
        return missing;
    }
}
async function POST(request) {
    try {
        const { candidateId } = await request.json();
        if (!candidateId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Candidate ID required'
            }, {
                status: 400
            });
        }
        // Read database
        const dbContent = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["readFile"])('./uploads/database.json', 'utf-8');
        const database = JSON.parse(dbContent);
        // Find candidate
        const candidate = database.candidates.find((c)=>c.id === candidateId);
        if (!candidate) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Candidate not found'
            }, {
                status: 404
            });
        }
        console.log(`🎯 Matching candidate: ${candidate.name}`);
        // Get active jobs from database
        const jobs = await getActiveJobs();
        if (jobs.length === 0) {
            console.log('⚠️ No active jobs available for matching');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                candidate: candidate.name,
                matches: [],
                message: 'No active jobs available for matching'
            });
        }
        // Calculate matches with all jobs
        const matches = await Promise.all(jobs.map(async (job)=>{
            const matchResult = await MatchingEngine.calculateMatch(candidate, job);
            return {
                jobId: job.id,
                jobTitle: job.title,
                department: job.department,
                location: job.location,
                ...matchResult
            };
        }));
        // Update database with any new embeddings generated during matching
        let dbUpdated = false;
        // Update candidate embedding
        const dbCandidate = database.candidates.find((c)=>c.id === candidateId);
        if (candidate.embedding && (!dbCandidate.embedding || dbCandidate.embedding.length === 0)) {
            dbCandidate.embedding = candidate.embedding;
            dbUpdated = true;
        }
        // Update job embeddings
        jobs.forEach((job)=>{
            const dbJob = database.jobs.find((j)=>j.id === job.id);
            if (job.embedding && dbJob && (!dbJob.embedding || dbJob.embedding.length === 0)) {
                dbJob.embedding = job.embedding;
                dbUpdated = true;
            }
        });
        // Store matches in database
        if (!database.matches) database.matches = [];
        matches.forEach((match)=>{
            database.matches.push({
                id: `match-${Date.now()}-${match.jobId}`,
                candidateId: candidate.id,
                ...match,
                matchedAt: new Date().toISOString()
            });
        });
        // Save database
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])('./uploads/database.json', JSON.stringify(database, null, 2));
        console.log(`✅ Found ${matches.length} potential matches for ${candidate.name}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            candidate: candidate.name,
            matches,
            message: `Found ${matches.length} potential job matches`
        });
    } catch (error) {
        console.error('❌ Matching error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Matching failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50d44969._.js.map