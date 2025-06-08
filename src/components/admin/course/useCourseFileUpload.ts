
import { supabase } from '@/integrations/supabase/client';

export const useCourseFileUpload = () => {
  const handleFileUpload = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('course-assets')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('course-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  return { handleFileUpload };
};
