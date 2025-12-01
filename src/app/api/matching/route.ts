import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { MatchingEngine } from '../../../services/matchingService';

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
        const matches = await Promise.all(jobs.map(async (job: any) => {
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
        const dbCandidate = database.candidates.find((c: any) => c.id === candidateId);
        if (candidate.embedding && (!dbCandidate.embedding || dbCandidate.embedding.length === 0)) {
            dbCandidate.embedding = candidate.embedding;
            dbUpdated = true;
        }

        // Update job embeddings
        jobs.forEach((job: any) => {
            const dbJob = database.jobs.find((j: any) => j.id === job.id);
            if (job.embedding && dbJob && (!dbJob.embedding || dbJob.embedding.length === 0)) {
                dbJob.embedding = job.embedding;
                dbUpdated = true;
            }
        });

        // Store matches in database
        if (!database.matches) database.matches = [];

        matches.forEach((match: any) => {
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