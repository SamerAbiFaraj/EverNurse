'use client';

import { useState, useEffect } from 'react';

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    description: string;
    requiredSkills: string[];
    preferredSkills: string[];
    requiredLicenses: string[];
    minExperience: number;
    matchThreshold: number;
    isActive: boolean;
    createdAt: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    // Fetch jobs on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/jobs');
            const data = await response.json();

            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = () => {
        setEditingJob(null);
        setShowForm(true);
    };

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
        setShowForm(true);
    };

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchJobs(); // Refresh list
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleToggleActive = async (job: Job) => {
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !job.isActive }),
            });

            if (response.ok) {
                fetchJobs(); // Refresh list
            }
        } catch (error) {
            console.error('Error toggling job status:', error);
        }
    };

    const handleFormClose = (shouldRefresh: boolean) => {
        setShowForm(false);
        setEditingJob(null);
        if (shouldRefresh) {
            fetchJobs();
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Job Descriptions
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage healthcare job positions for CV matching
                        </p>
                    </div>
                    <button
                        onClick={handleCreateJob}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Job
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
                <div className="text-center py-16">
                    <div className="inline-block p-6 bg-blue-50 rounded-full mb-4">
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Create your first job description to start matching candidates with healthcare positions.
                    </p>
                    <button
                        onClick={handleCreateJob}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Create First Job
                    </button>
                </div>
            )}

            {/* Jobs Grid */}
            {!loading && jobs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onEdit={() => handleEditJob(job)}
                            onDelete={() => handleDeleteJob(job.id)}
                            onToggleActive={() => handleToggleActive(job)}
                        />
                    ))}
                </div>
            )}

            {/* Job Form Modal */}
            {showForm && (
                <JobFormModal
                    job={editingJob}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}

// Job Card Component
function JobCard({ job, onEdit, onDelete, onToggleActive }: {
    job: Job;
    onEdit: () => void;
    onDelete: () => void;
    onToggleActive: () => void;
}) {
    const departmentColors: Record<string, string> = {
        'Critical Care': 'from-red-500 to-red-600',
        'Pediatrics': 'from-pink-500 to-pink-600',
        'Emergency': 'from-orange-500 to-orange-600',
        'Surgery': 'from-purple-500 to-purple-600',
        'General': 'from-blue-500 to-blue-600',
    };

    const gradientClass = departmentColors[job.department] || 'from-gray-500 to-gray-600';

    return (
        <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${!job.isActive ? 'opacity-60' : ''}`}>
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${gradientClass} p-4 text-white`}>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <p className="text-sm opacity-90">{job.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {job.isActive ? (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
                        ) : (
                            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">Inactive</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.minExperience}+ years experience
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                {skill}
                            </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                +{job.requiredSkills.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Match Threshold */}
                <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Match Threshold</p>
                    <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${job.matchThreshold}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{job.matchThreshold}%</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                    <button
                        onClick={onEdit}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onToggleActive}
                        className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        {job.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                        onClick={onDelete}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Job Form Modal Component
function JobFormModal({ job, onClose }: {
    job: Job | null;
    onClose: (shouldRefresh: boolean) => void;
}) {
    const [formData, setFormData] = useState({
        title: job?.title || '',
        department: job?.department || '',
        location: job?.location || '',
        description: job?.description || '',
        requiredSkills: job?.requiredSkills || [],
        preferredSkills: job?.preferredSkills || [],
        requiredLicenses: job?.requiredLicenses || [],
        minExperience: job?.minExperience || 0,
        matchThreshold: job?.matchThreshold || 70,
        isActive: job?.isActive !== undefined ? job.isActive : true,
    });

    const [skillInput, setSkillInput] = useState('');
    const [licenseInput, setLicenseInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Predefined options
    const commonSkills = ['ICU', 'Emergency Care', 'Patient Assessment', 'Pediatrics', 'Surgery', 'Critical Care', 'Patient Care', 'Medication Administration'];
    const commonLicenses = ['DHA', 'DOH', 'MOH', 'HAAD'];
    const departments = ['Critical Care', 'Pediatrics', 'Emergency', 'Surgery', 'General', 'Oncology', 'Cardiology'];
    const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
            const method = job ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onClose(true); // Close and refresh
            } else {
                alert('Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Error saving job');
        } finally {
            setSubmitting(false);
        }
    };

    const addSkill = (skill: string) => {
        if (skill && !formData.requiredSkills.includes(skill)) {
            setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, skill] });
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill) });
    };

    const addLicense = (license: string) => {
        if (license && !formData.requiredLicenses.includes(license)) {
            setFormData({ ...formData, requiredLicenses: [...formData.requiredLicenses, license] });
            setLicenseInput('');
        }
    };

    const removeLicense = (license: string) => {
        setFormData({ ...formData, requiredLicenses: formData.requiredLicenses.filter(l => l !== license) });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {job ? 'Edit Job Description' : 'Create New Job'}
                    </h2>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Registered Nurse - ICU"
                        />
                    </div>

                    {/* Department & Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department *
                            </label>
                            <select
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select department</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <select
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select location</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the role, responsibilities, and requirements..."
                        />
                    </div>

                    {/* Required Skills */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Required Skills
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Type a skill or select from common skills"
                            />
                            <button
                                type="button"
                                onClick={() => addSkill(skillInput)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {commonSkills.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addSkill(skill)}
                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200"
                                >
                                    + {skill}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requiredSkills.map(skill => (
                                <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Required Licenses */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Required Licenses
                        </label>
                        <div className="flex gap-2 mb-2">
                            {commonLicenses.map(license => (
                                <button
                                    key={license}
                                    type="button"
                                    onClick={() => addLicense(license)}
                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200"
                                >
                                    + {license}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requiredLicenses.map(license => (
                                <span key={license} className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
                                    {license}
                                    <button
                                        type="button"
                                        onClick={() => removeLicense(license)}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Min Experience & Match Threshold */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Experience (years)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minExperience}
                                onChange={(e) => setFormData({ ...formData, minExperience: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Match Threshold ({formData.matchThreshold}%)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.matchThreshold}
                                onChange={(e) => setFormData({ ...formData, matchThreshold: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                            Active (visible for CV matching)
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : (job ? 'Update Job' : 'Create Job')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
