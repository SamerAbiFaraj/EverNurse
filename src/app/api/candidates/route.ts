import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Candidate ID required' }, { status: 400 });
        }

        // Read database
        const dbContent = await readFile('./uploads/database.json', 'utf-8');
        const database = JSON.parse(dbContent);

        // Check if candidate exists
        const candidateIndex = database.candidates.findIndex((c: any) => c.id === id);

        if (candidateIndex === -1) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        // Remove candidate
        const deletedCandidate = database.candidates.splice(candidateIndex, 1)[0];

        // Remove associated matches
        if (database.matches) {
            database.matches = database.matches.filter((m: any) => m.candidateId !== id);
        }

        // Save database
        await writeFile('./uploads/database.json', JSON.stringify(database, null, 2));

        console.log(`🗑️ Deleted candidate: ${deletedCandidate.name} (${id})`);

        return NextResponse.json({
            success: true,
            message: `Candidate ${deletedCandidate.name} deleted successfully`
        });

    } catch (error) {
        console.error('❌ Error deleting candidate:', error);
        return NextResponse.json(
            { error: 'Failed to delete candidate' },
            { status: 500 }
        );
    }
}
