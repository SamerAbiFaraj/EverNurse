import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';

// Helper function to get jobs from database
async function getActiveJobs() {
    try {
        const db = await readFile('./uploads/database.json', 'utf-8');
        const database = JSON.parse(db);

        // Get active jobs from database
        const jobs = database.jobs?.filter((job: any) => job.isActive !== false) || [];

        // If no jobs in database, return default mock jobs for backward compatibility
        if (jobs.length === 0) {
            console.log('⚠️ No jobs in database, using fallback mock jobs');
            return [
                {
                    id: 'job-1',
                    title: 'Registered Nurse - ICU',
                    department: 'Critical Care',
                    location: 'Dubai',
                    requiredSkills: ['ICU', 'Emergency Care', 'Patient Assessment'],
                    requiredLicenses: ['DHA', 'DOH'],
                    minExperience: 3,
                    description: 'ICU Nurse with critical care experience'
                },
                {
                    id: 'job-2',
                    title: 'Pediatric Nurse',
                    department: 'Pediatrics',
                    location: 'Abu Dhabi',
                    requiredSkills: ['Pediatrics', 'Patient Care'],
                    requiredLicenses: ['DOH', 'MOH'],
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
        let skillsScore = 0;
        const matchedSkills = candidate.skills.filter((skill: string) =>
            job.requiredSkills.some((reqSkill: string) =>
                reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(reqSkill.toLowerCase())
            )
        );

        if (matchedSkills.length > 0 && job.requiredSkills.length > 0) {
            skillsScore = (matchedSkills.length / job.requiredSkills.length) * 40;
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
        const matchedLicenses = candidate.licenses.filter((license: string) =>
            job.requiredLicenses.includes(license)
        );

        if (matchedLicenses.length > 0 && job.requiredLicenses.length > 0) {
            licenseScore = (matchedLicenses.length / job.requiredLicenses.length) * 30;
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

    static analyzeJobDescription(candidate: any, job: any) {
        // Extract keywords from job title and description
        const jobText = `${job.title} ${job.description}`.toLowerCase();
        const candidateText = candidate.rawText.toLowerCase();

        // Common keywords to look for
        const keywords = [
            'project management', 'banking', 'credit card', 'fintech', 'it', 'software',
            'development', 'database', 'cloud', 'leadership', 'management', 'strategy',
            'planning', 'agile', 'scrum', 'api', 'integration', 'consulting',
            'nursing', 'healthcare', 'patient care', 'clinical', 'emergency'
        ];

        const matchedKeywords: string[] = [];
        let keywordMatches = 0;

        for (const keyword of keywords) {
            if (jobText.includes(keyword) && candidateText.includes(keyword)) {
                matchedKeywords.push(keyword);
                keywordMatches++;
            }
        }

        // Also check if candidate skills appear in job description
        for (const skill of candidate.skills) {
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
    try {
        const { candidateId } = await request.json();

        if (!candidateId) {
            return NextResponse.json({ error: 'Candidate ID required' }, { status: 400 });
        }

        // Read database
        const dbContent = await readFile('./uploads/database.json', 'utf-8');
        const database = JSON.parse(dbContent);

        // Find candidate
        const candidate = database.candidates.find((c: any) => c.id === candidateId);

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        console.log(`🎯 Matching candidate: ${candidate.name}`);

        // Get active jobs from database
        const jobs = await getActiveJobs();

        if (jobs.length === 0) {
            console.log('⚠️ No active jobs available for matching');
            return NextResponse.json({
                success: true,
                candidate: candidate.name,
                matches: [],
                message: 'No active jobs available for matching'
            });
        }

        // Calculate matches with all jobs
        const matches = jobs.map(job => {
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

        matches.forEach(match => {
            database.matches.push({
                id: `match-${Date.now()}-${match.jobId}`,
                candidateId: candidate.id,
                ...match,
                matchedAt: new Date().toISOString()
            });
        });

        // Save database
        await writeFile('./uploads/database.json', JSON.stringify(database, null, 2));

        console.log(`✅ Found ${matches.length} potential matches for ${candidate.name}`);

        return NextResponse.json({
            success: true,
            candidate: candidate.name,
            matches,
            message: `Found ${matches.length} potential job matches`
        });

    } catch (error) {
        console.error('❌ Matching error:', error);
        return NextResponse.json(
            { error: 'Matching failed' },
            { status: 500 }
        );
    }
}