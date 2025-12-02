'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Match {
    jobId: string;
    jobTitle: string;
    department: string;
    location: string;
    score: number;
    matchedSkills: string[];
    missingRequirements: string[];
}

interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: number;
    skills: string[];
    licenses: string[];
    filePath?: string;
    matches: Match[];
}

export default function ResultsPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ minScore: 0, department: '', search: '' });

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await fetch('/api/results');
            const data = await response.json();
            if (data.success) {
                setCandidates(data.candidates);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCandidate = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/candidates?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                setCandidates(prev => prev.filter(c => c.id !== id));
            } else {
                alert('Failed to delete candidate: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('An error occurred while deleting the candidate');
        }
    };

    const filteredCandidates = candidates?.filter(c => {
        const bestMatch = c.matches.length > 0 ? Math.max(...c.matches.map(m => m.score)) : 0;
        const matchesSearch = c.name.toLowerCase().includes(filter.search.toLowerCase()) ||
            c.skills.some(s => s.toLowerCase().includes(filter.search.toLowerCase()));
        const matchesDept = filter.department ? c.matches.some(m => m.department === filter.department) : true;

        return bestMatch >= filter.minScore && matchesSearch && matchesDept;
    }) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b sticky top-20 z-40 shadow-sm transition-all">
                <div className="container mx-auto px-6 py-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-evernurse-dark mb-2 tracking-tight">
                                Matching Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Review and manage AI-matched candidates for your healthcare positions.
                            </p>
                        </div>
                        <Link
                            href="/upload"
                            className="bg-[#00A99D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#008f85] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upload More CVs
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        <StatCard
                            title="Total Candidates"
                            value={candidates?.length || 0}
                            icon="users"
                            color="blue"
                            delay="0s"
                        />
                        <StatCard
                            title="Qualified Matches"
                            value={candidates?.filter(c => c.matches.some(m => m.score >= 80)).length || 0}
                            icon="check"
                            color="teal"
                            delay="0.1s"
                        />
                        <StatCard
                            title="Avg Match Score"
                            value={`${Math.round((candidates?.reduce((acc, c) => acc + (c.matches[0]?.score || 0), 0) || 0) / (candidates?.length || 1))}%`}
                            icon="chart"
                            color="purple"
                            delay="0.2s"
                        />
                        <StatCard
                            title="Pending Review"
                            value={candidates?.length || 0}
                            icon="clock"
                            color="orange"
                            delay="0.3s"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-8 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidates</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or skills..."
                                    value={filter.search}
                                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent transition-all"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Match Score</label>
                            <select
                                value={filter.minScore}
                                onChange={(e) => setFilter({ ...filter, minScore: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-evernurse-teal focus:border-transparent bg-white transition-all"
                            >
                                <option value="0">All Scores</option>
                                <option value="70">70%+</option>
                                <option value="80">80%+</option>
                                <option value="90">90%+</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilter({ minScore: 0, department: '', search: '' })}
                                className="w-full px-4 py-2.5 text-evernurse-teal font-medium hover:bg-teal-50 rounded-lg transition-colors border border-transparent hover:border-teal-100"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-evernurse-teal"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCandidates.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-soft border border-gray-100 animate-fade-in-up">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters or upload more CVs.</p>
                        <button
                            onClick={() => setFilter({ minScore: 0, department: '', search: '' })}
                            className="text-evernurse-teal font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Candidates List */}
                <div className="space-y-6">
                    {filteredCandidates.map((candidate, index) => (
                        <CandidateCard
                            key={`${candidate.id}-${index}`}
                            candidate={candidate}
                            index={index}
                            onDelete={() => deleteCandidate(candidate.id, candidate.name)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, delay }: { title: string, value: string | number, icon: string, color: string, delay: string }) {
    const colors: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50',
        teal: 'text-evernurse-teal bg-teal-50',
        purple: 'text-purple-600 bg-purple-50',
        orange: 'text-orange-600 bg-orange-50',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    {icon === 'users' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                    {icon === 'check' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {icon === 'chart' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    )}
                    {icon === 'clock' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <span className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>{value}</span>
            </div>
            <p className="text-gray-500 font-medium">{title}</p>
        </div>
    );
}

function CandidateCard({ candidate, index, onDelete }: { candidate: Candidate, index: number, onDelete: () => void }) {
    const bestMatch = candidate.matches.length > 0 ? candidate.matches.reduce((prev, current) => (prev.score > current.score) ? prev : current) : null;

    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up">
            <div className="flex flex-col md:flex-row">
                {/* Left: Candidate Info */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-evernurse-teal shadow-sm border border-gray-100">
                            {candidate.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-evernurse-dark">{candidate.name}</h3>
                            <p className="text-gray-500 text-sm">Added recently</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {candidate.email}
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {candidate.phone}
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {candidate.experience} Years Experience
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                            {candidate.skills.slice(0, 5).map((skill, i) => (
                                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Matches */}
                <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-evernurse-dark">Qualifying Job Matches</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={onDelete}
                                className="text-red-500 text-sm font-medium hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    if (candidate.filePath) {
                                        window.open(candidate.filePath, '_blank');
                                    } else {
                                        alert('CV file not available');
                                    }
                                }}
                                className="text-evernurse-teal text-sm font-medium hover:underline"
                            >
                                View Full CV
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {candidate.matches.map((match, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-evernurse-teal transition-colors shadow-sm group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h5 className="font-bold text-gray-900 group-hover:text-evernurse-teal transition-colors">{match.jobTitle}</h5>
                                        <p className="text-sm text-gray-500">{match.department} • {match.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-evernurse-teal">{match.score}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                    <div
                                        className="bg-[#00A99D] h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${match.score}%` }}
                                    ></div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    {match.matchedSkills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {skill}
                                        </span>
                                    ))}
                                    {match.matchedSkills.length > 3 && (
                                        <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                            +{match.matchedSkills.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {candidate.matches.length === 0 && (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                No qualifying matches found for this candidate.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-[#00A99D] text-white py-2.5 rounded-lg font-medium hover:bg-[#008f85] transition-all shadow-sm hover:shadow-md">
                            Contact Candidate
                        </button>
                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Save Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
