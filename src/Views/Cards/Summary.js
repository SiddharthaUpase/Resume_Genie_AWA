import React, { useEffect, useState } from 'react';
import { rewriteSummary } from '../../Models/addInfoModels';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const SummaryForm = ({ summary_parent, onChange }) => {
    const [summary, setSummary] = useState(summary_parent || '');
    const [loading, setLoading] = useState(false);
    const [aiRewriteState, setAiRewriteState] = useState(null);
    const [holdInputBox, setHoldInputBox] = useState(false);

    useEffect(() => {
        onChange(summary);
    }, [summary, onChange]);

    const handleAIrewrite = async () => {
        setLoading(true);
        setAiRewriteState({ original: summary, rewritten: null });
        setHoldInputBox(true);

        try {
            // const response = await rewriteSummary(summary);
            const response = 'AI rewritten summary';
            const newSummary = response;
            if (!newSummary) {
                console.error('No summary returned from AI');
                return;
            }

            setAiRewriteState({ original: summary, rewritten: newSummary });
            setLoading(false);
            setHoldInputBox(false);
            setSummary(newSummary);
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false);
            setHoldInputBox(false);
        }
    };

    const handleAcceptRewrite = () => {
        setSummary(aiRewriteState.rewritten);
        setAiRewriteState(null);
    };

    const handleRejectRewrite = () => {
        setAiRewriteState(null);
        setSummary(aiRewriteState.original);
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setSummary(value);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
            <div className="mb-6 p-4 border border-gray-200 rounded-lg relative">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="summary" className="block mb-2 text-sm font-medium text-gray-900">Summary</label>
                        <textarea
                            id="summary"
                            name="summary"
                            value={aiRewriteState?.rewritten || summary}
                            onChange={handleInputChange}
                            rows="3"
                            maxLength="300"
                            className={`block w-full p-4 text-gray-900 border rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 ${
                                summary.length > 300 ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Briefly describe yourself"
                            style={{ backgroundColor: aiRewriteState?.rewritten ? '#A2FFA7' : 'white' }}
                            disabled={holdInputBox}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <button
                                onClick={handleAIrewrite}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                disabled={loading || aiRewriteState?.rewritten}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                ) : (
                                    'AI Rewrite'
                                )}
                            </button>
                            <div className="text-sm text-gray-500">
                                {summary.length}/300 characters
                            </div>
                        </div>
                        {aiRewriteState?.rewritten && (
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={handleAcceptRewrite}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                >
                                    ✓ Accept
                                </button>
                                <button 
                                    onClick={handleRejectRewrite}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    ✗ Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryForm;