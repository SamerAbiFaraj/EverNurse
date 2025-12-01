import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';

// Reuse the matching engine from the existing matching API
class MatchingEngine {
    static calculateMatch(candidate: any, job: any) {
        let score = 0;
        const reasons = [];

        // Experience match (30 points max)
        if (candidate.experience >= job.minExperience) {
            const expScore = Math.min(30, (candidate.experience / job.minExperience) * 20);
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years`);
        }

        // Skills match (40 points max)
        const matchedSkills = candidate.skills.filter((skill: string) =>
            job.requiredSkills.some((reqSkill: string) =>
                reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(reqSkill.toLowerCase())
            )
        );

        if (matchedSkills.length > 0) {
            const skillsScore = (matchedSkills.length / job.requiredSkills.length) * 40;
            score += skillsScore;
            reasons.push(`Skills: ${matchedSkills.join(', ')}`);
        }

        // License match (30 points max)
        const matchedLicenses = candidate.licenses.filter((license: string) =>
            job.requiredLicenses.includes(license)
        );

        if (matchedLicenses.length > 0) {
            const licenseScore = (matchedLicenses.length / job.requiredLicenses.length) * 30;
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

    static findMissingRequirements(candidate: any, job: any) {
        const missing = [];

        if (candidate.experience < job.minExperience) {
            missing.push(`Needs ${job.minExperience - candidate.experience} more years experience`);
        }

        const missingLicenses = job.requiredLicenses.filter((license: string) =>
            !candidate.licenses.includes(license)
        );

        if (missingLicenses.length > 0) {
            missing.push(`Missing licenses: ${missingLicenses.join(', ')}`);
        }

        return missing;
    }
}

export async function POST(request: NextRequest) {
    console.log('🎯 BULK MATCH API CALLED - Processing all CVs against all jobs...');

    try {
        // Read database
        const dbData = await readFile('./uploads/database.json', 'utf-8');
        const database = JSON.parse(dbData);

        // Get all parsed candidates
        const candidates = database.candidates || [];
        console.log(`📊 Found ${candidates.length} candidates in database`);

        // Get all active jobs
        const jobs = database.jobs?.filter((job: any) => job.isActive !== false) || [];
        console.log(`📊 Found ${jobs.length} active jobs`);

        if (candidates.length === 0) {
            return NextResponse.json({
                success: true,
                qualifiedCandidates: [],
                stats: {
                    totalCVs: 0,
                    totalJobs: jobs.length,
                    qualifiedCandidates: 0,
                    totalMatches: 0
                },
                message: 'No candidates found in database'
            });
        }

        if (jobs.length === 0) {
            return NextResponse.json({
                success: true,
                qualifiedCandidates: [],
                stats: {
                    totalCVs: candidates.length,
                    totalJobs: 0,
                    qualifiedCandidates: 0,
                    totalMatches: 0
                },
                message: 'No active jobs available for matching'
            });
        }

        // Process each candidate against all jobs
        const qualifiedCandidates = [];
        let totalMatches = 0;

        for (const candidate of candidates) {
            const qualifyingMatches = [];

            for (const job of jobs) {
                const matchResult = MatchingEngine.calculateMatch(candidate, job);
                totalMatches++;

                // Only include matches that meet or exceed the job's threshold
                if (matchResult.score >= (job.matchThreshold || 70)) {
                    qualifyingMatches.push({
                        jobId: job.id,
                        jobTitle: job.title,
                        department: job.department,
                        location: job.location,
                        score: matchResult.score,
                        threshold: job.matchThreshold || 70,
                        reasons: matchResult.reasons,
                        matchedSkills: matchResult.matchedSkills,
                        missingRequirements: matchResult.missingRequirements
                    });
                }
            }

            // Only include candidates who have at least one qualifying match
            if (qualifyingMatches.length > 0) {
                // Sort matches by score (highest first)
                qualifyingMatches.sort((a, b) => b.score - a.score);

                qualifiedCandidates.push({
                    candidateId: candidate.id,
                    fileId: candidate.fileId,
                    name: candidate.name,
                    email: candidate.email,
                    phone: candidate.phone,
                    experience: candidate.experience,
                    skills: candidate.skills,
                    licenses: candidate.licenses,
                    location: candidate.location,
                    qualifyingMatches,
                    highestScore: qualifyingMatches[0].score,
                    totalQualifyingJobs: qualifyingMatches.length
                });
            }
        }

        // Sort qualified candidates by highest score
        qualifiedCandidates.sort((a, b) => b.highestScore - a.highestScore);

        const stats = {
            totalCVs: candidates.length,
            totalJobs: jobs.length,
            qualifiedCandidates: qualifiedCandidates.length,
            totalMatches,
            matchRate: Math.round((qualifiedCandidates.length / candidates.length) * 100)
        };

        console.log(`✅ Bulk matching complete:`, stats);

        return NextResponse.json({
            success: true,
            qualifiedCandidates,
            stats,
            message: `Found ${qualifiedCandidates.length} qualified candidate(s) from ${candidates.length} CVs`
        });

    } catch (error) {
        console.error('❌ Bulk matching error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Bulk matching failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
