// Migration script to parse requirements for existing jobs
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../uploads/database.json');

// Common license keywords
const licenseKeywords = ['DHA', 'DOH', 'MOH', 'BLS', 'ACLS', 'PALS', 'NRP', 'RN', 'LPN', 'CNA', 'PMP', 'PCI-DSS'];

function parseRequirements(requirements) {
    const requiredSkills = [];
    const requiredLicenses = [];
    let minExperience = 0;

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

    return { requiredSkills, requiredLicenses, minExperience };
}

async function migrateJobs() {
    try {
        // Read database
        const dbContent = fs.readFileSync(DB_PATH, 'utf-8');
        const db = JSON.parse(dbContent);

        console.log(`📊 Found ${db.jobs.length} jobs to migrate`);

        // Update each job
        for (const job of db.jobs) {
            if (job.requirements && job.requirements.length > 0) {
                const parsed = parseRequirements(job.requirements);

                job.requiredSkills = parsed.requiredSkills;
                job.requiredLicenses = parsed.requiredLicenses;
                job.minExperience = parsed.minExperience;

                console.log(`✅ Updated job: ${job.title}`);
                console.log(`   - Skills: ${parsed.requiredSkills.join(', ') || 'None'}`);
                console.log(`   - Licenses: ${parsed.requiredLicenses.join(', ') || 'None'}`);
                console.log(`   - Min Experience: ${parsed.minExperience} years`);
            }
        }

        // Save database
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        console.log('\n✅ Migration complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateJobs();
