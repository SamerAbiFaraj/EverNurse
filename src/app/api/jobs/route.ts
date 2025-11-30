import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

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

        // Create new job
        const newJob = {
            id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: body.title,
            department: body.department,
            location: body.location,
            description: body.description,
            requiredSkills: body.requiredSkills || [],
            preferredSkills: body.preferredSkills || [],
            requiredLicenses: body.requiredLicenses || [],
            minExperience: body.minExperience || 0,
            matchThreshold: body.matchThreshold || 70,
            isActive: body.isActive !== undefined ? body.isActive : true,
            salaryRange: body.salaryRange || null,
            benefits: body.benefits || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

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
