'use client';

import { useState, useEffect } from 'react';

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    description: string;
    requirements: string[];
    matchThreshold: number;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await fetch(`/api/jobs?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchJobs();
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleSave = async (job: Partial<Job>) => {
        try {
            const method = editingJob ? 'PUT' : 'POST';
            const body = editingJob ? { ...job, id: editingJob.id } : job;

            const response = await fetch('/api/jobs', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (data.success) {
                setIsModalOpen(false);
                setEditingJob(null);
                fetchJobs();
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b sticky top-20 z-40 shadow-sm transition-all">
                <div className="container mx-auto px-6 py-8 max-w-7xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-evernurse-dark mb-2 tracking-tight">
                                Job Positions
                            </h1>
                            <p className="text-black">
                                Manage your open roles and configure matching criteria.
                            </p>
                        </div>
                        <button
                            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                            className="bg-[#00A99D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#008f85] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Job
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-evernurse-teal"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && jobs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-soft border border-gray-100 animate-fade-in-up">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs created yet</h3>
                        <p className="text-black mb-6">Create your first job position to start matching candidates.</p>
                        <button
                            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                            className="text-evernurse-teal font-medium hover:underline"
                        >
                            Create a job now
                        </button>
                    </div>
                )}

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <div key={job.id} className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-evernurse-dark group-hover:text-evernurse-teal transition-colors">{job.title}</h3>
                                    <p className="text-sm text-black mt-1">{job.department}</p>
                                </div>
                                <span className="bg-teal-50 text-evernurse-teal text-xs px-2 py-1 rounded border border-teal-100 font-medium">
                                    {job.matchThreshold}% Match
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-black mb-4">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </div>

                            <p className="text-black text-sm mb-6 line-clamp-2 h-10">
                                {job.description}
                            </p>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                                    className="flex-1 text-evernurse-dark hover:text-evernurse-teal font-medium text-sm py-2 rounded border border-gray-200 hover:border-evernurse-teal hover:bg-teal-50 transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="flex-1 text-black hover:text-red-600 font-medium text-sm py-2 rounded border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Job Form Modal */}
            {isModalOpen && (
                <JobFormModal
                    job={editingJob}
                    onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function JobFormModal({ job, onClose, onSave }: { job: Job | null, onClose: () => void, onSave: (job: Partial<Job>) => void }) {
    const [formData, setFormData] = useState<Partial<Job>>({
        title: '',
        department: '',
        location: '',
        description: '',
        requirements: [],
        matchThreshold: 70
    });

    // Local state for requirements string to allow typing spaces
    const [requirementsString, setRequirementsString] = useState('');

    useEffect(() => {
        if (job) {
            setFormData(job);
            setRequirementsString(job.requirements?.join(', ') || '');
        }
    }, [job]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Parse requirements string into array on submit
        const requirementsArray = requirementsString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        onSave({ ...formData, requirements: requirementsArray });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center z-50 animate-fade-in overflow-y-auto py-10">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 animate-scale-up relative h-fit">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-evernurse-dark">
                        {job ? 'Edit Job Position' : 'Create New Job'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Job Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                                placeholder="e.g. Senior ICU Nurse"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Department</label>
                            <input
                                type="text"
                                required
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                                placeholder="e.g. Intensive Care Unit"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                                placeholder="e.g. Dubai, UAE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Match Threshold (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.matchThreshold}
                                onChange={e => setFormData({ ...formData, matchThreshold: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                            placeholder="Detailed job description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Requirements (comma separated)
                        </label>
                        <input
                            type="text"
                            value={requirementsString}
                            onChange={e => setRequirementsString(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                            placeholder="e.g. BLS, ACLS, 3+ years experience"
                        />
                        <p className="text-xs text-black mt-1">Separate multiple requirements with commas</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#00A99D] text-white rounded-lg font-medium hover:bg-[#008f85] transition-all shadow-md hover:shadow-lg"
                        >
                            {job ? 'Update Job' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
