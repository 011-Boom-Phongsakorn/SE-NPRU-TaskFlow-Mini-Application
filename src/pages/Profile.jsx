import { useState, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatusMessage('');
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a new image first.');
      return;
    }
    
    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    const success = await updateProfile(formData);
    if (success) {
      setStatusMessage('Profile updated successfully!');
      setSelectedFile(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button variant="ghost" className="mb-6 -ml-4 hover:bg-secondary/50" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card className="shadow-lg border-primary/20">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Manage your public Profile details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6 space-y-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-secondary flex items-center justify-center transition-transform hover:scale-105">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-8 h-8" />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold">{user?.username}</h3>
            <p className="text-sm text-muted-foreground mt-1">Tap the image to change your avatar</p>
          </div>

          {statusMessage && (
            <p className={`text-sm p-3 rounded-md w-full text-center ${statusMessage.includes('success') ? 'bg-green-500/10 text-green-500 font-medium' : 'bg-destructive/10 text-destructive'}`}>
              {statusMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-6 mt-4">
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !selectedFile} 
            className="w-full max-w-sm"
          >
            <Save className="mr-2 h-4 w-4" /> 
            {isLoading ? 'Uploading...' : 'Save Profile Image'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
