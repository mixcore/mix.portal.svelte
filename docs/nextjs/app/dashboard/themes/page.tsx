'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  PlusIcon,
  SettingsIcon,
  CheckCircleIcon,
  UploadIcon,
  PaletteIcon,
  LayoutIcon
} from 'lucide-react';
import { templateService } from '@/services/template-service';
import { Theme } from '@/types/template';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function ThemesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const themeData = await templateService.getThemes();
      setThemes(themeData);
    } catch (error) {
      console.error('Failed to load themes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTemplates = (themeId: string) => {
    router.push(`/dashboard/templates?themeId=${themeId}`);
  };

  const handleActivateTheme = (themeId: string) => {
    // This would be replaced with an actual API call in production
    setThemes(
      themes.map((theme) => ({
        ...theme,
        isActive: theme.id === themeId
      }))
    );
  };

  const handleUpload = () => {
    // This would be replaced with an actual file upload logic
    console.log('Upload theme');
  };

  return (
    <div className='container mx-auto space-y-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Themes</h1>
          <p className='text-muted-foreground'>
            Customize your website appearance with themes
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push('/dashboard/templates')}
          >
            <LayoutIcon className='mr-2 h-4 w-4' />
            Browse Templates
          </Button>
          <Button onClick={handleUpload}>
            <UploadIcon className='mr-2 h-4 w-4' />
            Upload Theme
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='overflow-hidden'>
              <Skeleton className='h-40 w-full' />
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </CardHeader>
              <CardFooter>
                <Skeleton className='h-10 w-full' />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {themes.map((theme) => (
            <Card key={theme.id} className='overflow-hidden'>
              <div className='relative'>
                {theme.thumbnail ? (
                  <img
                    src={theme.thumbnail}
                    alt={theme.name}
                    className='h-48 w-full object-cover'
                  />
                ) : (
                  <div className='bg-muted flex h-48 w-full items-center justify-center'>
                    <p className='text-muted-foreground'>
                      No Preview Available
                    </p>
                  </div>
                )}

                {theme.isActive && (
                  <div className='absolute top-2 right-2'>
                    <Badge className='bg-primary'>
                      <CheckCircleIcon className='mr-1 h-3 w-3' />
                      Active
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle>{theme.name}</CardTitle>
                <CardDescription>Version: {theme.version}</CardDescription>
              </CardHeader>

              <CardFooter className='flex justify-between'>
                <Button
                  variant='outline'
                  onClick={() => handleViewTemplates(theme.id)}
                >
                  View Templates
                </Button>

                {!theme.isActive && (
                  <Button
                    variant='secondary'
                    onClick={() => handleActivateTheme(theme.id)}
                  >
                    Activate
                  </Button>
                )}

                {theme.isActive && (
                  <Button variant='outline'>
                    <SettingsIcon className='mr-2 h-4 w-4' />
                    Settings
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

          {/* Add new theme card */}
          <Card className='overflow-hidden border-dashed'>
            <div className='bg-muted flex h-48 items-center justify-center'>
              <PlusIcon className='text-muted-foreground h-12 w-12' />
            </div>

            <CardHeader>
              <CardTitle>Create New Theme</CardTitle>
              <CardDescription>
                Start from scratch or duplicate an existing theme
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button className='w-full'>Create Theme</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
