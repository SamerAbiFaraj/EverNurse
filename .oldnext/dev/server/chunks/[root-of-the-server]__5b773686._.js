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
"[project]/src/app/api/results/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
;
;
// Reuse the matching engine with improved keyword matching
class MatchingEngine {
    static calculateMatch(candidate, job) {
        let score = 0;
        const reasons = [];
        // Experience match (30 points max)
        if (candidate.experience >= job.minExperience) {
            const expScore = Math.min(30, candidate.experience / job.minExperience * 20);
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years`);
        }
        // Skills match (40 points max)
        let skillsScore = 0;
        const matchedSkills = candidate.skills.filter((skill)=>job.requiredSkills.some((reqSkill)=>reqSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(reqSkill.toLowerCase())));
        if (matchedSkills.length > 0 && job.requiredSkills.length > 0) {
            skillsScore = matchedSkills.length / job.requiredSkills.length * 40;
            score += skillsScore;
            reasons.push(`Skills: ${matchedSkills.join(', ')}`);
        } else if (job.requiredSkills.length === 0) {
            // Fallback: Analyze job description for keywords
            const descriptionScore = this.analyzeJobDescription(candidate, job);
            score += descriptionScore.score;
            if (descriptionScore.keywords.length > 0) {
                reasons.push(`Matched keywords: ${descriptionScore.keywords.join(', ')}`);
            }
        }
        // License match (30 points max)
        let licenseScore = 0;
        const matchedLicenses = candidate.licenses.filter((license)=>job.requiredLicenses.includes(license));
        if (matchedLicenses.length > 0 && job.requiredLicenses.length > 0) {
            licenseScore = matchedLicenses.length / job.requiredLicenses.length * 30;
            score += licenseScore;
            reasons.push(`Licenses: ${matchedLicenses.join(', ')}`);
        }
        return {
            score: Math.min(100, Math.round(score)),
            reasons,
            matchedSkills
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
        const score = Math.min(40, keywordMatches * 8);
        return {
            score,
            keywords: matchedKeywords.slice(0, 5)
        };
    }
}
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
                const matchResult = MatchingEngine.calculateMatch(candidate, job);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__5b773686._.js.map