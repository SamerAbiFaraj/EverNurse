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
"[project]/src/app/api/matching/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
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
        // Calculate score: up to 40 points based on keyword matches
        const score = Math.min(40, keywordMatches * 8);
        return {
            score,
            keywords: matchedKeywords.slice(0, 5) // Limit to top 5 for display
        };
    }
    static findMissingRequirements(candidate, job) {
        const missing = [];
        if (candidate.experience < job.minExperience) {
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
        const matches = jobs.map((job)=>{
            const matchResult = MatchingEngine.calculateMatch(candidate, job);
            return {
                jobId: job.id,
                jobTitle: job.title,
                department: job.department,
                location: job.location,
                ...matchResult
            };
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

//# sourceMappingURL=%5Broot-of-the-server%5D__9341480b._.js.map