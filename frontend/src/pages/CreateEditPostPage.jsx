import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Loader, Save, X, Edit, Plus, Type, Hash, FileText, Sparkles, AlertCircle, CheckCircle, Bot } from 'lucide-react';
import { toast } from 'react-toastify';

const CreateEditPostPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    // AI Generation State
    const [creationMode, setCreationMode] = useState('manual'); // 'manual' | 'ai'
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchPost = async () => {
                try {
                    const { data } = await api.get(`/posts/${id}`);
                    setFormData({
                        title: data.title,
                        content: data.content,
                        tags: data.tags ? data.tags.join(', ') : '',
                    });
                } catch (error) {
                    toast.error("Failed to load post for editing");
                    navigate('/');
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchPost();
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error("Title and Content are required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            };

            if (isEditMode) {
                await api.put(`/posts/${id}`, payload);
                toast.success("Post updated successfully!");
            } else {
                await api.post('/posts', payload);
                toast.success("Post created successfully!");
            }
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save post");
        } finally {
            setLoading(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) {
            toast.error("Please enter a topic for the AI");
            return;
        }

        setIsGenerating(true);
        try {
            // Backend expects: { topic, wordCount?, tone? }
            const { data } = await api.post('/ai/generate-blog', { topic: aiPrompt });

            // Backend returns: { success: true, content: ... }
            setFormData(prev => ({
                ...prev,
                title: prev.title || aiPrompt, // Use prompt as title if empty
                content: data.content || '',
                // content might need cleaning if it returns markdown or something
            }));

            setCreationMode('manual');
            toast.success("Content generated successfully! You can now review and edit.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to generate content");
        } finally {
            setIsGenerating(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-gray-600">Loading post for editing...</p>
                </div>
            </div>
        );
    }

    const titleWarning = formData.title.length >= 100;
    const hasTags = formData.tags ? formData.tags.split(',').filter(tag => tag.trim()).length > 0 : false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                                {isEditMode ? (
                                    <Edit className="w-6 h-6 text-emerald-600" />
                                ) : (
                                    <Plus className="w-6 h-6 text-emerald-600" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {isEditMode ? 'Edit Post' : 'Create New Post'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {isEditMode ? 'Update and refine your existing article' : 'Share your knowledge and stories with the world'}
                                </p>
                            </div>
                        </div>

                        {!isEditMode && (
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setCreationMode('manual')}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${creationMode === 'manual'
                                        ? 'bg-white text-gray-800 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Manual</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCreationMode('ai')}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${creationMode === 'ai'
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Bot className="w-4 h-4" />
                                    <span>AI Assistant</span>
                                </button>
                            </div>
                        )}


                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                        >
                            <X className="w-5 h-5" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Type className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Title Length</div>
                                    <div className={`font-semibold ${titleWarning ? 'text-red-600' : 'text-gray-800'}`}>
                                        {formData.title.length}/120
                                    </div>
                                </div>
                            </div>
                            {formData.title.length > 0 && (
                                <div className={`p-1 rounded-full ${formData.title.length >= 50 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                    {formData.title.length >= 50 ? (
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-teal-50 rounded-lg">
                                    <FileText className="w-4 h-4 text-teal-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Content Length</div>
                                    <div className="font-semibold text-gray-800">{formData.content.length} characters</div>
                                </div>
                            </div>
                            {formData.content.length > 0 && (
                                <div className={`p-1 rounded-full ${formData.content.length >= 300 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                    {formData.content.length >= 300 ? (
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                    <Hash className="w-4 h-4 text-cyan-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Tags Count</div>
                                    <div className="font-semibold text-gray-800">
                                        {formData.tags ? formData.tags.split(',').filter(tag => tag.trim()).length : 0} tags
                                    </div>
                                </div>
                            </div>
                            {hasTags && (
                                <div className="p-1 rounded-full bg-emerald-100">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {
                    creationMode === 'ai' && !isEditMode ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bot className="w-8 h-8 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Let AI Write For You</h2>
                            <p className="text-gray-600 mb-8">
                                Describe the topic or title of the blog post you want to create, and our AI will generate a structured article for you.
                            </p>

                            <div className="relative mb-8">
                                <input
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g., The Future of Artificial Intelligence in Healthcare"
                                    className="w-full px-5 py-4 text-lg border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-purple-500 bg-white transition-all outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                                />
                                <div className="absolute right-3 top-3">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>

                            <button
                                onClick={handleAiGenerate}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isGenerating
                                    ? 'bg-purple-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 hover:shadow-purple-200 hover:scale-[1.02]'
                                    }`}
                            >
                                {isGenerating ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Generating Magic...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-5 h-5" />
                                        <span>Generate Content</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title Input */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                        <Type className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <label htmlFor="title" className="block text-lg font-semibold text-gray-800">
                                        Title
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter a captivating title that grabs attention..."
                                    className={`w-full px-4 py-3 text-lg border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white transition-all duration-200 outline-none ${titleWarning ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    maxLength={120}
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-sm text-gray-500">
                                        Keep it concise and descriptive (50-120 chars recommended)
                                    </p>
                                    <span className={`text-sm font-medium ${titleWarning ? 'text-red-500' : formData.title.length >= 50 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {formData.title.length}/120
                                    </span>
                                </div>
                            </div>

                            {/* Tags Input */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-cyan-50 rounded-lg">
                                        <Hash className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <label htmlFor="tags" className="block text-lg font-semibold text-gray-800">
                                        Tags
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="tech, lifestyle, coding, tutorial (comma separated)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-50 hover:bg-white transition-all duration-200 outline-none"
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                                    <p className="text-sm text-gray-500">
                                        Add 3-5 relevant tags to help readers find your post
                                    </p>
                                    {formData.tags && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.split(',').slice(0, 3).map((tag, index) => (
                                                tag.trim() && (
                                                    <span key={index} className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                                                        #{tag.trim()}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Input */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-teal-50 rounded-lg">
                                            <FileText className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <label htmlFor="content" className="block text-lg font-semibold text-gray-800">
                                            Content
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        <span>HTML supported</span>
                                    </div>
                                </div>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={15}
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your story here... Use HTML for formatting (e.g., &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;, &lt;a href='#'&gt;links&lt;/a&gt;)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 hover:bg-white transition-all duration-200 outline-none font-mono resize-y"
                                />
                                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-0.5">
                                            <div className="w-6 h-6 flex items-center justify-center bg-emerald-100 rounded-full">
                                                <span className="text-emerald-700 text-sm font-bold">i</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Note:</span> Basic HTML tags are supported for formatting.
                                                You can use &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;code&gt;, &lt;blockquote&gt;, etc.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <code className="px-2 py-1 bg-white text-emerald-700 text-xs rounded border border-emerald-200">
                                                    &lt;strong&gt;bold&lt;/strong&gt;
                                                </code>
                                                <code className="px-2 py-1 bg-white text-emerald-700 text-xs rounded border border-emerald-200">
                                                    &lt;em&gt;italic&lt;/em&gt;
                                                </code>
                                                <code className="px-2 py-1 bg-white text-emerald-700 text-xs rounded border border-emerald-200">
                                                    &lt;a href="#"&gt;link&lt;/a&gt;
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors border border-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title || !formData.content}
                                    className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${loading || !formData.title || !formData.content
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>{isEditMode ? 'Update Post' : 'Publish Post'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )
                }
            </div >
        </div >
    );
};

export default CreateEditPostPage;