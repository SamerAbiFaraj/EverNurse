import { EmbeddingService } from './embeddingService';

export class MatchingEngine {
    static async calculateMatch(candidate: any, job: any) {
        let score = 0;
        const reasons = [];

        // 1. Experience match (25 points max)
        const minExperience = job.minExperience || 0;

        if (minExperience === 0) {
            // If no experience required, give full points
            score += 25;
            reasons.push('Experience: Met (No minimum required)');
        } else if (candidate.experience >= minExperience) {
            // If they meet the requirement
            const ratio = candidate.experience / minExperience;
            const expScore = Math.min(25, 15 + (ratio - 1) * 10);
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years (Required: ${minExperience})`);
        } else {
            // Partial score for being close
            const ratio = candidate.experience / minExperience;
            const expScore = ratio * 15;
            score += expScore;
            reasons.push(`Experience: ${candidate.experience} years (Under qualified)`);
        }

        // 2. Semantic Skills Match (30 points max - increased from 20)
        let skillsScore = 0;
        const matchedSkills: any[] = [];
        const skillDetails: string[] = [];

        if (job.requiredSkills && job.requiredSkills.length > 0) {
            try {
                // Generate embeddings for required skills if not already present
                if (!job.skillEmbeddings) {
                    job.skillEmbeddings = await EmbeddingService.generateSkillEmbeddings(job.requiredSkills);
                }

                // Generate embeddings for candidate skills if not already present
                if (!candidate.skillEmbeddings) {
                    candidate.skillEmbeddings = await EmbeddingService.generateSkillEmbeddings(candidate.skills || []);
                }

                // For each required skill, find the best matching candidate skill
                for (const requiredSkill of job.requiredSkills) {
                    const requiredEmbedding = job.skillEmbeddings.get(requiredSkill);
                    if (!requiredEmbedding) continue;

                    const bestMatch = EmbeddingService.findBestSkillMatch(requiredEmbedding, candidate.skillEmbeddings);

                    if (bestMatch) {
                        // Similarity-based scoring with partial credit
                        let creditPercentage = 0;
                        let matchQuality = '';

                        if (bestMatch.similarity >= 0.9) {
                            creditPercentage = 1.0; // 100% credit - exact or very close match
                            matchQuality = 'Excellent';
                        } else if (bestMatch.similarity >= 0.7) {
                            creditPercentage = 0.7; // 70% credit - related skill
                            matchQuality = 'Good';
                        } else if (bestMatch.similarity >= 0.5) {
                            creditPercentage = 0.4; // 40% credit - somewhat related
                            matchQuality = 'Partial';
                        }

                        if (creditPercentage > 0) {
                            const pointsForThisSkill = (30 / job.requiredSkills.length) * creditPercentage;
                            skillsScore += pointsForThisSkill;
                            matchedSkills.push(bestMatch.skill);
                            skillDetails.push(
                                `${requiredSkill} → ${bestMatch.skill} (${matchQuality} match: ${Math.round(bestMatch.similarity * 100)}%)`
                            );
                        }
                    }
                }

                score += skillsScore;
                if (skillDetails.length > 0) {
                    reasons.push(`Skills: ${skillDetails.join('; ')}`);
                } else {
                    reasons.push('Skills: No matching skills found');
                }

            } catch (error) {
                console.error('⚠️ Semantic skill matching failed, falling back to exact match:', error);
                // Fallback to exact matching
                const exactMatches = candidate.skills.filter((skill: string) =>
                    job.requiredSkills.some((reqSkill: string) =>
                        reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(reqSkill.toLowerCase())
                    )
                );

                if (exactMatches.length > 0) {
                    skillsScore = (exactMatches.length / job.requiredSkills.length) * 30;
                    score += skillsScore;
                    reasons.push(`Skills (Exact): ${exactMatches.join(', ')}`);
                    matchedSkills.push(...exactMatches);
                }
            }
        } else {
            score += 30;
            reasons.push('Skills: Met (No specific skills required)');
        }

        // 3. License Match with Fuzzy Matching (20 points max - decreased from 25)
        let licenseScore = 0;
        const matchedLicenses: string[] = [];

        if (job.requiredLicenses && job.requiredLicenses.length > 0) {
            for (const requiredLicense of job.requiredLicenses) {
                // Exact match or fuzzy match (e.g., "PMP" matches "PMP certificate")
                const match = candidate.licenses.find((license: string) =>
                    license.toLowerCase().includes(requiredLicense.toLowerCase()) ||
                    requiredLicense.toLowerCase().includes(license.toLowerCase())
                );

                if (match) {
                    matchedLicenses.push(match);
                    licenseScore += (20 / job.requiredLicenses.length);
                }
            }

            score += licenseScore;
            if (matchedLicenses.length > 0) {
                reasons.push(`Licenses: ${matchedLicenses.join(', ')}`);
            } else {
                reasons.push('Licenses: None matched');
            }
        } else {
            score += 20;
            reasons.push('Licenses: Met (None required)');
        }

        // 4. Overall Semantic Similarity (25 points max - decreased from 30)
        try {
            let jobEmbedding = job.embedding;
            let candidateEmbedding = candidate.embedding;

            // Generate embeddings if missing
            if (!jobEmbedding) {
                const jobText = EmbeddingService.prepareJobText(job);
                jobEmbedding = await EmbeddingService.generateEmbedding(jobText);
                job.embedding = jobEmbedding;
            }

            if (!candidateEmbedding) {
                const candidateText = EmbeddingService.prepareCandidateText(candidate);
                candidateEmbedding = await EmbeddingService.generateEmbedding(candidateText);
                candidate.embedding = candidateEmbedding;
            }

            const similarity = EmbeddingService.calculateCosineSimilarity(jobEmbedding, candidateEmbedding);

            // Convert similarity to score (0.5-1.0 range to 0-25 points)
            let semanticScore = 0;
            if (similarity > 0.5) {
                semanticScore = ((similarity - 0.5) / 0.5) * 25;
            }

            score += semanticScore;

            if (semanticScore > 5) {
                reasons.push(`Overall Fit: ${Math.round(similarity * 100)}% match`);
            }

        } catch (error) {
            console.error('⚠️ Overall semantic matching failed:', error);
        }

        return {
            score: Math.min(100, Math.round(score)),
            reasons,
            matchedSkills,
            missingRequirements: this.findMissingRequirements(candidate, job)
        };
    }

    static analyzeJobDescription(candidate: any, job: any) {
        const jobText = `${job.title} ${job.description}`.toLowerCase();
        const candidateText = candidate.rawText.toLowerCase();

        const keywords = [
            'project management', 'banking', 'credit card', 'fintech', 'it', 'software',
            'development', 'database', 'cloud', 'leadership', 'management', 'strategy',
            'planning', 'agile', 'scrum', 'api', 'integration', 'consulting',
            'nursing', 'healthcare', 'patient care', 'clinical', 'emergency'
        ];

        const matchedKeywords: string[] = [];
        let keywordMatches = 0;

        for (const keyword of keywords) {
            if (jobText.includes(keyword) && candidateText.includes(keyword)) {
                matchedKeywords.push(keyword);
                keywordMatches++;
            }
        }

        for (const skill of candidate.skills) {
            if (jobText.includes(skill.toLowerCase()) && !matchedKeywords.includes(skill.toLowerCase())) {
                matchedKeywords.push(skill);
                keywordMatches++;
            }
        }

        const score = Math.min(30, keywordMatches * 6);

        return {
            score,
            keywords: matchedKeywords.slice(0, 5)
        };
    }

    static findMissingRequirements(candidate: any, job: any) {
        const missing = [];

        if (candidate.experience < (job.minExperience || 0)) {
            missing.push(`Needs ${job.minExperience - candidate.experience} more years experience`);
        }

        const missingLicenses = job.requiredLicenses.filter((license: string) =>
            !candidate.licenses.includes(license)
        );

        if (missingLicenses.length > 0) {
            missing.push(`Missing licenses: ${missingLicenses.join(', ')}`);
        }

        return missing;
    }
}
