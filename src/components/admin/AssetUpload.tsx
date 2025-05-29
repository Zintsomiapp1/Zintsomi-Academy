
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileAudio, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssetUploadProps {
  type: 'audio' | 'document';
}

const AssetUpload = ({ type }: AssetUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const acceptedTypes = type === 'audio' 
    ? 'audio/*' 
    : '.pdf,.doc,.docx,.txt';

  const uploadAsset = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `assets/${type}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course-assets')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('course-assets')
        .getPublicUrl(fileName);

      toast({
        title: "Success",
        description: `${type === 'audio' ? 'Audio' : 'Document'} uploaded successfully!`,
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('asset-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading asset:', error);
      toast({
        title: "Error",
        description: `Failed to upload ${type}.`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'audio' ? (
            <FileAudio className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Upload {type === 'audio' ? 'Audio Files' : 'Documents'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="asset-file">
            Select {type === 'audio' ? 'Audio File' : 'Document'}
          </Label>
          <Input
            id="asset-file"
            type="file"
            accept={acceptedTypes}
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            {type === 'audio' 
              ? 'Supported formats: MP3, WAV, M4A, OGG'
              : 'Supported formats: PDF, DOC, DOCX, TXT'
            }
          </p>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">Selected file:</p>
            <p className="text-sm text-gray-600">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <Button
          onClick={uploadAsset}
          disabled={uploading || !selectedFile}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : `Upload ${type === 'audio' ? 'Audio' : 'Document'}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetUpload;
