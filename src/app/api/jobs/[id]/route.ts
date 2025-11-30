import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';

const DB_PATH = './uploads/database.json';

// GET /api/jobs/[id] - Get single job
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const db = JSON.parse(await readFile(DB_PATH, 'utf-8'));
        const job = db.jobs?.find((j: any) => j.id === id);

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            job
        });

    } catch (error) {
        console.error('❌ Error fetching job:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job' },
            { status: 500 }
        );
    }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Read database
        const db = JSON.parse(await readFile(DB_PATH, 'utf-8'));
        const jobIndex = db.jobs?.findIndex((j: any) => j.id === id);

        if (jobIndex === -1 || jobIndex === undefined) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Update job (merge with existing data)
        const updatedJob = {
            ...db.jobs[jobIndex],
            ...body,
            id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };

        db.jobs[jobIndex] = updatedJob;

        // Save database
        await writeFile(DB_PATH, JSON.stringify(db, null, 2));

        console.log(`✅ Updated job: ${updatedJob.title} (${id})`);

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

// DELETE /api/jobs/[id] - Delete job (soft delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Read database
        const db = JSON.parse(await readFile(DB_PATH, 'utf-8'));
        const jobIndex = db.jobs?.findIndex((j: any) => j.id === id);

        if (jobIndex === -1 || jobIndex === undefined) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Soft delete by setting isActive to false
        db.jobs[jobIndex].isActive = false;
        db.jobs[jobIndex].updatedAt = new Date().toISOString();

        // Save database
        await writeFile(DB_PATH, JSON.stringify(db, null, 2));

        console.log(`🗑️ Deleted job: ${db.jobs[jobIndex].title} (${id})`);

        return NextResponse.json({
            success: true,
            message: 'Job deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting job:', error);
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}
