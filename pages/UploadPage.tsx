import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader, Video, Image as ImageIcon, FileVideo } from 'lucide-react';
import { uploadToCloudinary } from '../config/cloudinary';
import { createImportedVideo, createSessionPhoto } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { ViewState } from '../types';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileType = file.type;
    const isVideo = fileType.startsWith('video/');
    const isImage = fileType.startsWith('image/');

    if (!isVideo && !isImage) {
      setError('Please select a valid image or video file');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);

    setSelectedFile({
      file,
      preview,
      type: isVideo ? 'video' : 'image',
    });
    setError('');
    setUploadSuccess(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    const fileType = file.type;
    const isVideo = fileType.startsWith('video/');
    const isImage = fileType.startsWith('image/');

    if (!isVideo && !isImage) {
      setError('Please select a valid image or video file');
      return;
    }

    const preview = URL.createObjectURL(file);

    setSelectedFile({
      file,
      preview,
      type: isVideo ? 'video' : 'image',
    });
    setError('');
    setUploadSuccess(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setTags('');
    setUploadSuccess(false);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setError('Please select a file and ensure you are logged in');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress (Cloudinary doesn't provide real-time progress in this implementation)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      // Upload to Cloudinary
      const folder = selectedFile.type === 'video'
        ? 'diamond-ai/training-videos'
        : 'diamond-ai/session-photos';

      const cloudinaryResult = await uploadToCloudinary(
        selectedFile.file,
        selectedFile.type,
        folder
      );

      clearInterval(progressInterval);
      setUploadProgress(95);

      // Save metadata to Supabase
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      if (selectedFile.type === 'video') {
        const { error: dbError } = await createImportedVideo({
          title: title.trim(),
          description: description.trim() || undefined,
          cloudinary_public_id: cloudinaryResult.publicId,
          cloudinary_url: cloudinaryResult.url,
          thumbnail_url: cloudinaryResult.thumbnailUrl,
          mime_type: selectedFile.file.type,
          file_size_bytes: selectedFile.file.size,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
        });

        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await createSessionPhoto({
          title: title.trim(),
          cloudinary_public_id: cloudinaryResult.publicId,
          cloudinary_url: cloudinaryResult.url,
          thumbnail_url: cloudinaryResult.url,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
          notes: description.trim() || undefined,
        });

        if (dbError) throw dbError;
      }

      setUploadProgress(100);
      setUploadSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        handleRemoveFile();
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Media</h1>
          <p className="text-slate-400">Upload videos and photos for AI analysis</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          {!selectedFile ? (
            // Drop Zone
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-blue-400/50 transition-colors cursor-pointer"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white mb-2">
                      Drop your file here, or click to browse
                    </p>
                    <p className="text-slate-400">
                      Supports: Videos (MP4, MOV, AVI) and Images (JPG, PNG, GIF)
                    </p>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            // File Preview and Form
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative bg-black/30 rounded-xl overflow-hidden">
                {selectedFile.type === 'video' ? (
                  <video
                    src={selectedFile.preview}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <img
                    src={selectedFile.preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain"
                  />
                )}

                {!uploading && !uploadSuccess && (
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>

              {/* File Info */}
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                {selectedFile.type === 'video' ? (
                  <FileVideo className="w-5 h-5 text-blue-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                )}
                <span>{selectedFile.file.name}</span>
                <span className="text-slate-500">
                  ({(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>

              {/* Form Fields */}
              {!uploadSuccess && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for this upload"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description (optional)"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="hitting, batting-practice, mechanics (comma-separated)"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={uploading}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="flex items-center space-x-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Upload successful! File saved to database.</span>
                </div>
              )}

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {!uploadSuccess && (
                <button
                  onClick={handleUpload}
                  disabled={uploading || !title.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload to Cloud</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
          <h3 className="text-blue-300 font-semibold mb-2">💡 Upload Tips</h3>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Videos are great for analyzing your swing mechanics</li>
            <li>• Photos work well for form checks and still analysis</li>
            <li>• Add descriptive tags to help organize your uploads</li>
            <li>• Your uploads are stored securely in the cloud</li>
            <li>• You can analyze uploaded content from the Analyzer page</li>
          </ul>
        </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
