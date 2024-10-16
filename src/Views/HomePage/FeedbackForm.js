import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { sendFeedback } from '../../Models/feedback';

export const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        liked: '',
        disliked: '',
        suggestions: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            const session = localStorage.getItem('session');
            const user_id = JSON.parse(session).user_id;
            const payload = {
                ...formData,
                user_id: user_id
            };

            const response = await sendFeedback(payload);

            

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ liked: '', disliked: '', suggestions: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">

               Yayy or Nayy? Let us know!

            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="liked" className="block text-sm font-medium text-blue-900">
                        What did you like?
                    </label>
                    <textarea
                        id="liked"
                        name="liked"
                        value={formData.liked}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        rows="3"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="disliked" className="block text-sm font-medium text-blue-900">
                        What could be improved?
                    </label>
                    <textarea
                        id="disliked"
                        name="disliked"
                        value={formData.disliked}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        rows="3"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="suggestions" className="block text-sm font-medium text-blue-900">
                        Any suggestions?
                    </label>
                    <textarea
                        id="suggestions"
                        name="suggestions"
                        value={formData.suggestions}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        rows="3"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </button>

                    {submitStatus && (
                        <p className={`text-sm ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {submitStatus === 'success' ? 'Feedback submitted successfully!' : 'Failed to submit feedback. Please try again.'}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;