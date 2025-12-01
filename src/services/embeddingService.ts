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

    /**
     * Generate embeddings for multiple texts in a single batch request
     * More efficient than individual requests
     */
    static async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            if (texts.length === 0) return [];

            console.log(`🧠 Generating ${texts.length} embeddings in batch...`);

            // Truncate each text if too long
            const truncatedTexts = texts.map(text => text.substring(0, 32000));

            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: truncatedTexts,
            });

            const embeddings = response.data.map(item => item.embedding);
            console.log(`✅ Generated ${embeddings.length} embeddings`);

            return embeddings;
        } catch (error) {
            console.error('❌ Batch embedding generation failed:', error);
            throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate embeddings for individual skills/requirements
     * Returns a map of skill -> embedding
     */
    static async generateSkillEmbeddings(skills: string[]): Promise<Map<string, number[]>> {
        if (skills.length === 0) return new Map();

        const embeddings = await this.generateBatchEmbeddings(skills);
        const skillEmbeddingMap = new Map<string, number[]>();

        skills.forEach((skill, index) => {
            skillEmbeddingMap.set(skill, embeddings[index]);
        });

        return skillEmbeddingMap;
    }

    /**
     * Calculate semantic similarity between a candidate skill and a required skill
     * Returns a similarity score between 0 and 1
     */
    static calculateSkillSimilarity(
        candidateSkillEmbedding: number[],
        requiredSkillEmbedding: number[]
    ): number {
        const similarity = this.calculateCosineSimilarity(candidateSkillEmbedding, requiredSkillEmbedding);
        // Normalize to 0-1 range (cosine similarity is -1 to 1)
        return Math.max(0, similarity);
    }

    /**
     * Find the best matching candidate skill for a required skill
     * Returns the best match with its similarity score
     */
    static findBestSkillMatch(
        requiredSkillEmbedding: number[],
        candidateSkillEmbeddings: Map<string, number[]>
    ): { skill: string; similarity: number } | null {
        let bestMatch: { skill: string; similarity: number } | null = null;

        for (const [skill, embedding] of candidateSkillEmbeddings.entries()) {
            const similarity = this.calculateSkillSimilarity(embedding, requiredSkillEmbedding);

            if (!bestMatch || similarity > bestMatch.similarity) {
                bestMatch = { skill, similarity };
            }
        }

        return bestMatch;
    }
}
