
import React, { useState } from 'react';
import { Plus, Upload, Edit, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LibraryManagement = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Sample library resources
  const resources = [
    {
      id: '1',
      title: 'African Folklore Collection',
      type: 'audio',
      category: 'folklore',
      downloads: 89,
      uploadDate: '2024-03-15'
    },
    {
      id: '2',
      title: 'Storytelling Techniques Guide',
      type: 'pdf',
      category: 'storytelling_tips',
      downloads: 156,
      uploadDate: '2024-03-10'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return 'bg-purple-100 text-purple-700';
      case 'pdf': return 'bg-red-100 text-red-700';
      case 'video': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Library Management</h2>
          <p className="text-gray-600">Upload and manage educational resources</p>
        </div>
        <Button 
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-r from-sky-400 to-teal-500 hover:from-sky-500 hover:to-teal-600 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{resource.category.replace('_', ' ')}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      <span>{resource.downloads} downloads</span>
                    </div>
                    <span>Uploaded: {resource.uploadDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Resource Form */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Upload New Resource</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                <input 
                  type="text" 
                  placeholder="Enter resource title..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  placeholder="Resource description..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="audio">Audio</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="folklore">Folklore</option>
                    <option value="storytelling_tips">Storytelling Tips</option>
                    <option value="vr_lessons">VR Lessons</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, Audio, or Video files</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g., traditional, africa, oral"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={() => setShowUploadForm(false)}
                  className="bg-gradient-to-r from-sky-400 to-teal-500 hover:from-sky-500 hover:to-teal-600 text-white"
                >
                  Upload Resource
                </Button>
                <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LibraryManagement;
