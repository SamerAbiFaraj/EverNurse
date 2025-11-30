// data/jobTemplates.ts
export const nursingJobTemplates = {
    icuNurse: {
        title: 'Registered Nurse - ICU',
        department: 'Nursing',
        experienceRequired: 3,
        requiredLicenses: ['DHA', 'DOH'],
        requiredSkills: ['ICU', 'Critical Care', 'Ventilator', 'Hemodynamic Monitoring'],
        description: 'Specialized ICU nurse for critical care units...'
    },
    pediatricNurse: {
        title: 'Pediatric Nurse',
        department: 'Nursing',
        experienceRequired: 2,
        requiredLicenses: ['DHA', 'DOH', 'MOH'],
        requiredSkills: ['Pediatrics', 'Child Care', 'Vaccination'],
        description: 'Pediatric nursing specialist...'
    },
    erNurse: {
        title: 'Emergency Room Nurse',
        department: 'Nursing',
        experienceRequired: 3,
        requiredLicenses: ['DHA'],
        requiredSkills: ['ER', 'Trauma', 'Triage', 'Emergency Care'],
        description: 'Emergency department nursing professional...'
    }
};