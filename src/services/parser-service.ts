import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedCV {
    name?: string;
    email?: string;
    phone?: string;
    skills: string[];
    experience: number;
    licenses: string[];
    specialties: string[];
    education: string[];
    location?: string;
    rawText: string;
}

export class ParserService {
    static async parsePDF(buffer: Buffer): Promise<string> {
        const data = await pdf(buffer);
        return data.text;
    }

    static async parseDOCX(buffer: Buffer): Promise<string> {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    static async parseDocument(buffer: Buffer, mimeType: string): Promise<string> {
        switch (mimeType) {
            case 'application/pdf':
                return this.parsePDF(buffer);
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return this.parseDOCX(buffer);
            default:
                throw new Error(`Unsupported file type: ${mimeType}`);
        }
    }

    static extractStructuredData(text: string): ParsedCV {
        // Basic extraction - you can enhance this with more sophisticated NLP
        const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        const phoneMatch = text.match(/(?:\+?971)?[-\s]?\(?\d{1,4}\)?[-\s]?\d{1,4}[-\s]?\d{1,9}/);

        // Extract skills based on common nursing keywords
        const nursingSkills = [
            'ACLS', 'BLS', 'PALS', 'ICU', 'ER', 'OR', 'Pediatrics', 'Geriatrics',
            'Medication', 'Assessment', 'Documentation', 'Patient Care', 'Ventilator',
            'Trauma', 'Emergency', 'Critical Care', 'Surgical', 'Recovery'
        ];

        const foundSkills = nursingSkills.filter(skill =>
            text.toLowerCase().includes(skill.toLowerCase())
        );

        // Extract licenses and certifications (FIXED: Now includes PMP and other professional certifications)
        const healthcareLicenses = ['DHA', 'DOH', 'MOH', 'HAAD', 'BLS', 'ACLS', 'PALS', 'NRP', 'RN', 'LPN', 'CNA'];
        const professionalCertifications = ['PMP', 'PRINCE2', 'Agile', 'Scrum Master', 'CSM', 'PCI-DSS', 'CISSP', 'CISA', 'ITIL', 'Six Sigma'];
        const allLicenses = [...healthcareLicenses, ...professionalCertifications];

        const licenses = allLicenses.filter(license =>
            text.toUpperCase().includes(license.toUpperCase())
        );

        // Simple experience extraction (look for years patterns)
        const experienceMatch = text.match(/(\d+)\s*(?:year|yr)s?/i);
        const experience = experienceMatch ? parseInt(experienceMatch[1]) : 0;

        return {
            name: this.extractName(text),
            email: emailMatch?.[0],
            phone: phoneMatch?.[0],
            skills: foundSkills,
            experience,
            licenses,
            specialties: this.extractSpecialties(text),
            education: this.extractEducation(text),
            location: this.extractLocation(text),
            rawText: text
        };
    }

    private static extractName(text: string): string {
        // Simple name extraction - first line often contains name
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        return lines[0]?.trim() || 'Unknown';
    }

    private static extractSpecialties(text: string): string[] {
        const specialties = [
            'ICU', 'Emergency', 'Pediatrics', 'Geriatrics', 'Oncology', 'Cardiac',
            'Surgical', 'Orthopedics', 'Mental Health', 'Community Health'
        ];

        return specialties.filter(specialty =>
            text.toLowerCase().includes(specialty.toLowerCase())
        );
    }

    private static extractEducation(text: string): string[] {
        const educationKeywords = ['BSc', 'MSc', 'PhD', 'Diploma', 'Certificate', 'Bachelor', 'Master'];
        const lines = text.split('\n');

        return lines.filter(line =>
            educationKeywords.some(keyword =>
                line.toLowerCase().includes(keyword.toLowerCase())
            )
        ).slice(0, 3); // Return max 3 education lines
    }

    private static extractLocation(text: string): string {
        const uaeLocations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

        for (const location of uaeLocations) {
            if (text.includes(location)) {
                return location;
            }
        }

        return 'UAE';
    }
}