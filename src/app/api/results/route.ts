import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { MatchingEngine } from '../../../services/matchingService';


export async function GET(request: NextRequest) {
    console.log('🔍 RESULTS API CALLED - Fetching all candidates with matches...');

    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');
        const sortBy = searchParams.get('sortBy') || 'score';

        // Read database
        const dbData = await readFile('./uploads/database.json', 'utf-8');
        const database = JSON.parse(dbData);

        const candidates = database.candidates || [];
        const jobs = database.jobs?.filter((job: any) => job.isActive !== false) || [];

        if (candidates.length === 0 || jobs.length === 0) {
            return NextResponse.json({
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
        const targetJobs = jobId
            ? jobs.filter((job: any) => job.id === jobId)
            : jobs;

        // Process candidates - SHOW ALL MATCHES
        const candidatesWithMatches = [];

        for (const candidate of candidates) {
            const allMatches = [];

            for (const job of targetJobs) {
                const matchResult = await MatchingEngine.calculateMatch(candidate, job);

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
            allMatches.sort((a, b) => b.score - a.score);

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
        switch (sortBy) {
            case 'name':
                candidatesWithMatches.sort((a: any, b: any) => a.name.localeCompare(b.name));
                break;
            case 'experience':
                candidatesWithMatches.sort((a: any, b: any) => b.experience - a.experience);
                break;
            case 'score':
            default:
                candidatesWithMatches.sort((a: any, b: any) => b.highestScore - a.highestScore);
                break;
        }

        const stats = {
            totalCVs: candidates.length,
            totalJobs: targetJobs.length,
            totalCandidates: candidatesWithMatches.length,
            matchRate: Math.round((candidatesWithMatches.length / candidates.length) * 100)
        };

        console.log(`✅ Results fetched:`, stats);

        return NextResponse.json({
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
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch results',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
