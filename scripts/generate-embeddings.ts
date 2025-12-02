
import { PrismaClient } from '../src/generated/client';
import { EmbeddingService } from '../src/services/embeddingService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// @ts-ignore
const prisma = new PrismaClient({});

async function generateEmbeddings() {
    console.log('🚀 Starting embedding generation migration...');

    try {
        // 1. Process Jobs
        console.log('\n📦 Processing Job Descriptions...');
        const jobs = await prisma.jobDescription.findMany({
            where: {
                OR: [
                    { embedding: null },
                    { embedding: "" } // Handle empty strings if any
                ]
            }
        });

        console.log(`Found ${jobs.length} jobs needing embeddings.`);

        for (const job of jobs) {
            try {
                console.log(`Processing job: ${job.title}`);
                const text = EmbeddingService.prepareJobText(job);
                const embedding = await EmbeddingService.generateEmbedding(text);

                await prisma.jobDescription.update({
                    where: { id: job.id },
                    data: { embedding: JSON.stringify(embedding) }
                });
                console.log(`✅ Updated embedding for job: ${job.title}`);
            } catch (error) {
                console.error(`❌ Failed to process job ${job.id}:`, error);
            }
        }

        // 2. Process Candidates
        console.log('\n👤 Processing Candidate Profiles...');
        const candidates = await prisma.candidateProfile.findMany({
            where: {
                OR: [
                    { embedding: null },
                    { embedding: "" }
                ]
            }
        });

        console.log(`Found ${candidates.length} candidates needing embeddings.`);

        for (const candidate of candidates) {
            try {
                console.log(`Processing candidate: ${candidate.name || 'Unknown'}`);
                const text = EmbeddingService.prepareCandidateText(candidate);
                const embedding = await EmbeddingService.generateEmbedding(text);

                await prisma.candidateProfile.update({
                    where: { id: candidate.id },
                    data: { embedding: JSON.stringify(embedding) }
                });
                console.log(`✅ Updated embedding for candidate: ${candidate.name}`);
            } catch (error) {
                console.error(`❌ Failed to process candidate ${candidate.id}:`, error);
            }
        }

        console.log('\n✨ Migration complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateEmbeddings();
