// components/JobForm.tsx
'use client';

import { useState } from 'react';

const UAE_LICENSES = ['DHA', 'DOH', 'MOH', 'HAAD'];
const NURSING_SPECIALTIES = ['ICU', 'ER', 'Pediatrics', 'NICU', 'OR', 'Cardiac', 'Oncology', 'Geriatric'];

export default function JobForm({ job, onSave, onCancel }: any) {
    const [formData, setFormData] = useState(job);

    const handleArrayChange = (field: string, value: string) => {
        const currentArray = formData[field] || [];
        if (value && !currentArray.includes(value)) {
            setFormData({ ...formData, [field]: [...currentArray, value] });
        }
    };

    const removeArrayItem = (field: string, item: string) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((i: string) => i !== item)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                    {job.id ? 'Edit Job' : 'Add New Job'}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title*</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Registered Nurse - ICU"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location*</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Dubai, Abu Dhabi"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Required UAE Licenses</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {UAE_LICENSES.map(license => (
                            <button
                                key={license}
                                type="button"
                                onClick={() => handleArrayChange('requiredLicenses', license)}
                                className={`px-3 py-1 rounded text-sm ${formData.requiredLicenses?.includes(license)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {license}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.requiredLicenses?.map((license: string) => (
                            <span key={license} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                                {license}
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('requiredLicenses', license)}
                                    className="ml-1 text-red-500"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Required Skills & Specialties</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {NURSING_SPECIALTIES.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => handleArrayChange('requiredSkills', skill)}
                                className={`px-3 py-1 rounded text-sm ${formData.requiredSkills?.includes(skill)
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Add custom skill and press Enter"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleArrayChange('requiredSkills', e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                        className="w-full border rounded px-3 py-2"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredSkills?.map((skill: string) => (
                            <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('requiredSkills', skill)}
                                    className="ml-1 text-red-500"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Experience Required (years)*</label>
                        <input
                            type="number"
                            value={formData.experienceRequired}
                            onChange={(e) => setFormData({ ...formData, experienceRequired: parseInt(e.target.value) })}
                            className="w-full border rounded px-3 py-2"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Employment Type</label>
                        <select
                            value={formData.employmentType}
                            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Job Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Detailed job description..."
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Save Job
                    </button>
                </div>
            </div>
        </div>
    );
}