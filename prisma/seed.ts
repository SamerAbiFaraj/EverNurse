// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Sample nursing job descriptions for UAE
    const jobs = [
        {
            title: "Registered Nurse - ICU",
            department: "Critical Care",
            location: "Dubai",
            requiredSkills: ["ACLS", "BLS", "ICU experience", "Ventilator management"],
            preferredSkills: ["CCRN", "PALS", "Trauma nursing"],
            requiredLicenses: ["DHA", "DOH"],
            minExperience: 3,
            description: "Seeking experienced ICU nurse for tertiary care hospital in Dubai. Must have minimum 3 years ICU experience and valid DHA/DOH license.",
            matchThreshold: 75,
            isActive: true
        },
        {
            title: "Staff Nurse - Pediatrics",
            department: "Pediatrics",
            location: "Abu Dhabi",
            requiredSkills: ["Pediatric assessment", "Medication administration", "Family education"],
            preferredSkills: ["PALS", "Pediatric advanced life support"],
            requiredLicenses: ["DOH", "HAAD"],
            minExperience: 2,
            description: "Pediatric staff nurse for leading children's hospital. Must be passionate about pediatric care and have relevant experience.",
            matchThreshold: 70,
            isActive: true
        },
        {
            title: "Emergency Room Nurse",
            department: "Emergency",
            location: "Sharjah",
            requiredSkills: ["Triage", "Emergency care", "Trauma nursing", "ACLS"],
            preferredSkills: ["TNCC", "ENPC", "Emergency department experience"],
            requiredLicenses: ["MOH", "DHA"],
            minExperience: 4,
            description: "ER nurse for busy emergency department. Must be able to work in fast-paced environment and handle multiple critical patients.",
            matchThreshold: 80,
            isActive: true
        }
    ];

    for (const jobData of jobs) {
        await prisma.jobDescription.create({
            data: jobData
        });
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });