import React, { useState, useEffect } from 'react';
import { HardDrive, Search, FileText, Download, LogIn, LogOut, Loader2, Plus, CornerDownRight, CheckCircle, File, Eye } from 'lucide-react';
import { googleSignIn, logout, initAuth } from '../firebase';
import { DriveFile } from '../types';

interface DriveManagerProps {
  onDriveConnectionChange: (connected: boolean) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function DriveManager({ onDriveConnectionChange, onShowToast }: DriveManagerProps) {
  const [driveConnected, setDriveConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  // New File Creation state
  const [newFileName, setNewFileFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  useEffect(() => {
    // Check for cached auth
    initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setDriveConnected(true);
        onDriveConnectionChange(true);
      },
      () => {
        setDriveConnected(false);
        onDriveConnectionChange(false);
      }
    );
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setDriveConnected(true);
        onDriveConnectionChange(true);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      onShowToast('Google authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setDriveConnected(false);
      onDriveConnectionChange(false);
      setFiles([]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const fetchDriveFiles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink,size,createdTime)&pageSize=25&q=trashed=false',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching drive files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driveConnected && token) {
      fetchDriveFiles();
    }
  }, [driveConnected, token]);

  // Handle Note/File Creation to Google Drive with explicit user confirmation!
  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!newFileName.trim()) {
      onShowToast('Please enter a note/file name', 'error');
      return;
    }

    // EXPLICIT MANDATORY USER CONFIRMATION before writing data
    const confirmed = window.confirm(
      `Do you confirm creating a new text file named "${newFileName}.txt" inside your Google Drive?`
    );
    if (!confirmed) return;

    setIsCreatingFile(true);
    try {
      // Step 1: Create file metadata
      const metadata = {
        name: `${newFileName}.txt`,
        mimeType: 'text/plain',
      };

      // Create boundary payload for multipart upload
      const boundary = 'foo_bar_boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/plain\r\n\r\n' +
        newFileContent +
        closeDelimiter;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (response.ok) {
        onShowToast(`Success: "${newFileName}.txt" created successfully in your Google Drive!`, 'success');
        setNewFileFileName('');
        setNewFileContent('');
        fetchDriveFiles(); // Refresh file list
      } else {
        const errorData = await response.json();
        console.error('Error creating file:', errorData);
        onShowToast('Failed to save file to Google Drive.', 'error');
      }
    } catch (error) {
      console.error('Network error during file creation:', error);
      onShowToast('Network error while writing to Google Drive.', 'error');
    } finally {
      setIsCreatingFile(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title & Auth Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-8 bg-[#121212] border border-neutral-800 rounded-none relative">
        <div className="absolute top-0 left-0 w-16 h-1 bg-white"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 text-white rounded">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-neutral-500 uppercase block">creative engine / sync</span>
            <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tighter mt-1">Google Drive Organizer</h1>
            <p className="text-xs text-neutral-400 font-mono mt-1 uppercase tracking-widest">Access, read, and search files inside Drive.</p>
          </div>
        </div>

        {/* Auth Actions */}
        <div>
          {driveConnected ? (
            <div className="flex items-center gap-4 bg-[#161616] p-3 border border-neutral-800">
              {user?.photoURL && (
                <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded border border-neutral-700" referrerPolicy="no-referrer" />
              )}
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold uppercase tracking-wider text-white block">{user?.displayName || 'Active User'}</span>
                <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 px-3 py-2 border border-rose-900/30 rounded transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="inline-flex items-center gap-2.5 bg-white hover:bg-neutral-200 text-black font-black px-5 py-3 rounded-none transition-all shadow-sm cursor-pointer uppercase tracking-widest text-xs"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '16px', height: '16px' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              )}
              <span>Connect Drive</span>
            </button>
          )}
        </div>
      </div>

      {driveConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create New Notes File */}
          <div className="lg:col-span-1 p-6 bg-[#121212] border border-neutral-800 rounded-none relative space-y-4 h-fit">
            <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
              <Plus className="h-4 w-4 text-white" />
              <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Create Note</h2>
            </div>
            
            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">File Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileFileName(e.target.value)}
                    placeholder="e.g. Project-Notes"
                    className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-neutral-500 font-mono">.txt</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Content Body</label>
                <textarea
                  required
                  rows={6}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Type your markdown files or task notes..."
                  className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-sans"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isCreatingFile}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-none transition-all shadow-sm uppercase tracking-widest text-xs cursor-pointer"
              >
                {isCreatingFile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    SAVING_TO_DRIVE...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Sync to Drive
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Drive Files Listing & Search */}
          <div className="lg:col-span-2 p-6 bg-[#121212] border border-neutral-800 rounded-none relative space-y-4">
            <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-850">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-white" />
                <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Workspace Directory</h2>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drive files..."
                  className="bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none pl-9 pr-4 py-2 text-[11px] focus:outline-none transition-all placeholder:text-neutral-600 text-white font-mono"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Retrieving drive files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs space-y-2">
                <HardDrive className="h-10 w-10 mx-auto stroke-1 text-neutral-600" />
                <p className="font-mono uppercase tracking-widest">NO_FILES_FOUND_ON_DRIVE</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] pr-1">
                {filteredFiles.map((file, idx) => (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`p-4 border transition-all cursor-pointer flex flex-col justify-between rounded-none ${
                      selectedFile?.id === file.id
                        ? 'border-white bg-neutral-900'
                        : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950/40'
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-[10px] font-mono text-neutral-500 self-start mt-0.5">{(idx + 1).toString().padStart(3, '0')}</span>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-white block truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 block truncate uppercase mt-0.5" title={file.mimeType}>
                          {file.mimeType.split('/').pop()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">
                        {file.size ? `${(parseInt(file.size) / 1024).toFixed(1)} KB` : 'Doc/Folder'}
                      </span>
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                          title="Open in Google Drive"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 p-8 bg-[#121212] border border-neutral-800 rounded-none relative space-y-4 max-w-xl mx-auto">
          <div className="absolute top-0 left-0 w-16 h-1 bg-white"></div>
          <HardDrive className="h-12 w-12 mx-auto stroke-1 text-neutral-600 animate-pulse" />
          <h2 className="text-lg font-sans font-black text-white uppercase tracking-tighter">SECURE_WORKSPACE_AUTHENTICATION_REQUIRED</h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm mx-auto">
            Authorize RecollectBuddy to communicate safely with your Google Drive using official Google OAuth credentials.
          </p>
          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-black px-6 py-3.5 rounded-none transition-all shadow-sm uppercase tracking-widest text-xs cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            Authorize Workspace
          </button>
        </div>
      )}
    </div>
  );
}
