import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class EmbeddingService {
    /**
     * Generate embedding vector for text using OpenAI's text-embedding-3-small model
     */
    static async generateEmbedding(text: string): Promise<number[]> {
        try {
            console.log('🧠 Generating embedding for text (length:', text.length, 'chars)');

            // Truncate text if too long (max ~8000 tokens ≈ 32000 chars)
            const truncatedText = text.substring(0, 32000);

            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: truncatedText,
            });

            const embedding = response.data[0].embedding;
            console.log('✅ Embedding generated (dimensions:', embedding.length, ')');

            return embedding;
        } catch (error) {
            console.error('❌ Embedding generation failed:', error);
            throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Calculate cosine similarity between two embedding vectors
     * Returns a value between -1 and 1, where 1 means identical, 0 means orthogonal, -1 means opposite
     */
    static calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have the same dimensions');
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);

        if (magnitude === 0) {
            return 0;
        }

        const similarity = dotProduct / magnitude;

        console.log('📊 Cosine similarity:', similarity.toFixed(4));

        return similarity;
    }

    /**
     * Prepare text for embedding generation by combining relevant fields
     */
    static prepareJobText(job: any): string {
        const parts = [
            job.title || '',
            job.description || '',
            job.department || '',
            job.location || '',
            (job.requiredSkills || []).join(', '),
            (job.requiredLicenses || []).join(', '),
            job.requirements ? (Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements) : ''
        ];

        return parts.filter(p => p).join('\n');
    }

    /**
     * Prepare candidate text for embedding generation
     */
    static prepareCandidateText(candidate: any): string {
        const parts = [
            candidate.name || '',
            `${candidate.experience || 0} years of experience`,
            (candidate.skills || []).join(', '),
            (candidate.licenses || []).join(', '),
            candidate.location || '',
            candidate.rawText || ''
        ];

        return parts.filter(p => p).join('\n');
    }
}
