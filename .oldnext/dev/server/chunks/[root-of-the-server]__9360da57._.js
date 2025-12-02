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
"[project]/src/services/matchingService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MatchingEngine",
    ()=>MatchingEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/embeddingService.ts [app-route] (ecmascript)");
;
class MatchingEngine {
    static async calculateMatch(candidate, job) {
        let score = 0;
        const reasons = [];
        // 1. Experience match (25 points max)
        const minExperience = job.minExperience || 0;
        if (minExperience === 0) {
            // If no experience required, give full points
            score += 25;
            reasons.push('Experience: Met (No minimum required)');
        } else if (candidate.experience >= minExperience) {
            // If they meet the requirement
            const ratio = candidate.experience / minExperience;
            const expScore = Math.min(25, 15 + (ratio - 1) * 10);
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years (Required: ${minExperience})`);
        } else {
            // Partial score for being close
            const ratio = candidate.experience / minExperience;
            const expScore = ratio * 15;
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years (Under qualified)`);
        }
        // 2. Semantic Skills Match (30 points max - increased from 20)
        let skillsScore = 0;
        const matchedSkills = [];
        const skillDetails = [];
        if (job.requiredSkills && job.requiredSkills.length > 0) {
            try {
                // Generate embeddings for required skills if not already present
                if (!job.skillEmbeddings) {
                    job.skillEmbeddings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].generateSkillEmbeddings(job.requiredSkills);
                }
                // Generate embeddings for candidate skills if not already present
                if (!candidate.skillEmbeddings) {
                    candidate.skillEmbeddings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].generateSkillEmbeddings(candidate.skills || []);
                }
                // For each required skill, find the best matching candidate skill
                for (const requiredSkill of job.requiredSkills){
                    const requiredEmbedding = job.skillEmbeddings.get(requiredSkill);
                    if (!requiredEmbedding) continue;
                    const bestMatch = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$embeddingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmbeddingService"].findBestSkillMatch(requiredEmbedding, candidate.skillEmbeddings);
                    if (bestMatch) {
                        // Similarity-based scoring with partial credit
                        let creditPercentage = 0;
                        let matchQuality = '';
                        if (bestMatch.similarity >= 0.9) {
                            creditPercentage = 1.0; // 100% credit - exact or very close match
                            matchQuality = 'Excellent';
                        } else if (bestMatch.similarity >= 0.7) {
                            creditPercentage = 0.7; // 70% credit - related skill
                            matchQuality = 'Good';
                        } else if (bestMatch.similarity >= 0.5) {
                            creditPercentage = 0.4; // 40% credit - somewhat related
                            matchQuality = 'Partial';
                        }
                        if (creditPercentage > 0) {
                            const pointsForThisSkill = 30 / job.requiredSkills.length * creditPercentage;
                            skillsScore += pointsForThisSkill;
                            matchedSkills.push(bestMatch.skill);
                            skillDetails.push(`${requiredSkill} → ${bestMatch.skill} (${matchQuality} match: ${Math.round(bestMatch.similarity * 100)}%)`);
                        }
                    }
                }
                score += skillsScore;
                if (skillDetails.length > 0) {
                    reasons.push(`Skills: ${skillDetails.join('; ')}`);
                } else {
                    reasons.push('Skills: No matching skills found');
                }
            } catch (error) {
                console.error('⚠️ Semantic skill matching failed, falling back to exact match:', error);
                // Fallback to exact matching
                const exactMatches = candidate.skills.filter((skill)=>job.requiredSkills.some((reqSkill)=>reqSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(reqSkill.toLowerCase())));
                if (exactMatches.length > 0) {
                    skillsScore = exactMatches.length / job.requiredSkills.length * 30;
                    score += skillsScore;
                    reasons.push(`Skills (Exact): ${exactMatches.join(', ')}`);
                    matchedSkills.push(...exactMatches);
                }
            }
        } else {
            score += 30;
            reasons.push('Skills: Met (No specific skills required)');
        }
        // 3. License Match with Fuzzy Matching (20 points max - decreased from 25)
        let licenseScore = 0;
        const matchedLicenses = [];
        if (job.requiredLicenses && job.requiredLicenses.length > 0) {
            for (const requiredLicense of job.requiredLicenses){
                // Exact match or fuzzy match (e.g., "PMP" matches "PMP certificate")
                const match = candidate.licenses.find((license)=>license.toLowerCase().includes(requiredLicense.toLowerCase()) || requiredLicense.toLowerCase().includes(license.toLowerCase()));
                if (match) {
                    matchedLicenses.push(match);
                    licenseScore += 20 / job.requiredLicenses.length;
                }
            }
            score += licenseScore;
            if (matchedLicenses.length > 0) {
                reasons.push(`Licenses: ${matchedLicenses.join(', ')}`);
            } else {
                reasons.push('Licenses: None matched');
            }
        } else {
            score += 20;
            reasons.push('Licenses: Met (None required)');
        }
        // 4. Overall Semantic Similarity (25 points max - decreased from 30)
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
            // Convert similarity to score (0.5-1.0 range to 0-25 points)
            let semanticScore = 0;
            if (similarity > 0.5) {
                semanticScore = (similarity - 0.5) / 0.5 * 25;
            }
            score += semanticScore;
            if (semanticScore > 5) {
                reasons.push(`Overall Fit: ${Math.round(similarity * 100)}% match`);
            }
        } catch (error) {
            console.error('⚠️ Overall semantic matching failed:', error);
        }
        return {
            score: Math.min(100, Math.round(score)),
            reasons,
            matchedSkills,
            missingRequirements: this.findMissingRequirements(candidate, job)
        };
    }
    static analyzeJobDescription(candidate, job) {
        const jobText = `${job.title} ${job.description}`.toLowerCase();
        const candidateText = candidate.rawText.toLowerCase();
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
        for (const skill of candidate.skills){
            if (jobText.includes(skill.toLowerCase()) && !matchedKeywords.includes(skill.toLowerCase())) {
                matchedKeywords.push(skill);
                keywordMatches++;
            }
        }
        const score = Math.min(30, keywordMatches * 6);
        return {
            score,
            keywords: matchedKeywords.slice(0, 5)
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
}),
"[project]/src/app/api/results/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$matchingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/matchingService.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    console.log('🔍 RESULTS API CALLED - Fetching all candidates with matches...');
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');
        const sortBy = searchParams.get('sortBy') || 'score';
        // Read database
        const dbData = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["readFile"])('./uploads/database.json', 'utf-8');
        const database = JSON.parse(dbData);
        const candidates = database.candidates || [];
        const jobs = database.jobs?.filter((job)=>job.isActive !== false) || [];
        if (candidates.length === 0 || jobs.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                candidates: [],
                stats: {
                    totalCVs: candidates.length,
                    totalJobs: jobs.length,
                    totalCandidates: 0
                }
            });
        }
        // Filter jobs if jobId is specified
        const targetJobs = jobId ? jobs.filter((job)=>job.id === jobId) : jobs;
        // Process candidates - SHOW ALL MATCHES
        const candidatesWithMatches = [];
        for (const candidate of candidates){
            const allMatches = [];
            for (const job of targetJobs){
                const matchResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$matchingService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MatchingEngine"].calculateMatch(candidate, job);
                // Include ALL matches, regardless of score
                allMatches.push({
                    jobId: job.id,
                    jobTitle: job.title,
                    department: job.department,
                    location: job.location,
                    score: matchResult.score,
                    threshold: job.matchThreshold || 70,
                    reasons: matchResult.reasons,
                    matchedSkills: matchResult.matchedSkills
                });
            }
            // Sort matches by score (highest first)
            allMatches.sort((a, b)=>b.score - a.score);
            candidatesWithMatches.push({
                id: candidate.id,
                fileId: candidate.fileId,
                name: candidate.name,
                email: candidate.email,
                phone: candidate.phone,
                experience: candidate.experience,
                skills: candidate.skills,
                licenses: candidate.licenses,
                location: candidate.location,
                filePath: candidate.filePath,
                matches: allMatches,
                highestScore: allMatches.length > 0 ? allMatches[0].score : 0,
                totalMatches: allMatches.length
            });
        }
        // Sort results
        switch(sortBy){
            case 'name':
                candidatesWithMatches.sort((a, b)=>a.name.localeCompare(b.name));
                break;
            case 'experience':
                candidatesWithMatches.sort((a, b)=>b.experience - a.experience);
                break;
            case 'score':
            default:
                candidatesWithMatches.sort((a, b)=>b.highestScore - a.highestScore);
                break;
        }
        const stats = {
            totalCVs: candidates.length,
            totalJobs: targetJobs.length,
            totalCandidates: candidatesWithMatches.length,
            matchRate: Math.round(candidatesWithMatches.length / candidates.length * 100)
        };
        console.log(`✅ Results fetched:`, stats);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            candidates: candidatesWithMatches,
            stats,
            filters: {
                jobId,
                sortBy
            }
        });
    } catch (error) {
        console.error('❌ Results API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch results',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9360da57._.js.map