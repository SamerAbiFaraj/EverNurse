import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { EmbeddingService } from '../../../services/embeddingService';

// Database file path
const DB_PATH = './uploads/database.json';

// Initialize database if it doesn't exist
async function initDatabase() {
    if (!existsSync(DB_PATH)) {
        const initialDb = {
            candidates: [],
            matches: [],
            jobs: []
        };
        await writeFile(DB_PATH, JSON.stringify(initialDb, null, 2));
        return initialDb;
    }
    const data = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

// GET /api/jobs - List all jobs
export async function GET(request: NextRequest) {
    try {
        const db = await initDatabase();

        // Get query params
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';

        let jobs = db.jobs || [];

        // Filter active jobs if requested
        if (activeOnly) {
            jobs = jobs.filter((job: any) => job.isActive !== false);
        }

        // Sort by creation date (newest first)
        jobs.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({
            success: true,
            jobs,
            count: jobs.length
        });

    } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'department', 'location', 'description'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Read database
        const db = await initDatabase();
        if (!db.jobs) db.jobs = [];

        // Parse requirements array into structured fields
        const requirements = body.requirements || [];
        const requiredSkills: string[] = [];
        const requiredLicenses: string[] = [];
        let minExperience = 0;

        // Common license keywords
        const licenseKeywords = ['DHA', 'DOH', 'MOH', 'BLS', 'ACLS', 'PALS', 'NRP', 'RN', 'LPN', 'CNA', 'PMP', 'PCI-DSS'];

        // Parse each requirement
        for (const req of requirements) {
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
            const isLicense = licenseKeywords.some(keyword =>
                req.toUpperCase().includes(keyword.toUpperCase())
            );

            if (isLicense) {
                requiredLicenses.push(req.trim());
            } else {
                // It's a skill
                requiredSkills.push(req.trim());
            }
        }

        // Create new job
        const newJob: any = {
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
            const jobText = EmbeddingService.prepareJobText(newJob);
            newJob.embedding = await EmbeddingService.generateEmbedding(jobText);
            newJob.embeddingGeneratedAt = new Date().toISOString();
        } catch (error) {
            console.error('⚠️ Failed to generate embedding for new job:', error);
            // Continue without embedding - it will be generated on demand during matching
        }

        // Add to database
        db.jobs.push(newJob);

        // Save database
        await writeFile(DB_PATH, JSON.stringify(db, null, 2));

        console.log(`✅ Created job: ${newJob.title} (${newJob.id})`);

        return NextResponse.json({
            success: true,
            job: newJob,
            message: 'Job created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('❌ Error creating job:', error);
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        );
    }
}

// PUT /api/jobs - Update existing job
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            );
        }

        // Read database
        const db = await initDatabase();

        // Find job index
        const jobIndex = db.jobs.findIndex((j: any) => j.id === body.id);

        if (jobIndex === -1) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Parse requirements array into structured fields if provided
        let parsedFields: any = {};
        if (body.requirements) {
            const requirements = body.requirements;
            const requiredSkills: string[] = [];
            const requiredLicenses: string[] = [];
            let minExperience = 0;

            // Common license keywords
            const licenseKeywords = ['DHA', 'DOH', 'MOH', 'BLS', 'ACLS', 'PALS', 'NRP', 'RN', 'LPN', 'CNA', 'PMP', 'PCI-DSS'];

            // Parse each requirement
            for (const req of requirements) {
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
                const isLicense = licenseKeywords.some(keyword =>
                    req.toUpperCase().includes(keyword.toUpperCase())
                );

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
        if (body.description !== db.jobs[jobIndex].description ||
            body.title !== db.jobs[jobIndex].title) {
            try {
                const jobText = EmbeddingService.prepareJobText(updatedJob);
                updatedJob.embedding = await EmbeddingService.generateEmbedding(jobText);
                updatedJob.embeddingGeneratedAt = new Date().toISOString();
            } catch (error) {
                console.error('⚠️ Failed to regenerate embedding for updated job:', error);
            }
        }

        db.jobs[jobIndex] = updatedJob;

        // Save database
        await writeFile(DB_PATH, JSON.stringify(db, null, 2));

        console.log(`✅ Updated job: ${updatedJob.title} (${updatedJob.id})`);

        return NextResponse.json({
            success: true,
            job: updatedJob,
            message: 'Job updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating job:', error);
        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        );
    }
}
