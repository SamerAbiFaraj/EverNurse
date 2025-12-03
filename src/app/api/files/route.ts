import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('path');

        if (!filePath) {
            return NextResponse.json({ error: 'File path required' }, { status: 400 });
        }

        // Read the file
        const fileBuffer = await readFile(filePath);

        // Determine content type based on file extension
        const ext = filePath.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === 'pdf') {
            contentType = 'application/pdf';
        } else if (ext === 'docx') {
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (ext === 'doc') {
            contentType = 'application/msword';
        }

        // Return the file
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filePath.split(/[\\\/]/).pop()}"`,
            },
        });

    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
        );
    }
}
