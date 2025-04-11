import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileViewPage() {
  // Mock user data
  const user = {
    fullName: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer with a passion for building clean and intuitive interfaces.',
    avatarUrl: 'https://github.com/shadcn.png'
  };

  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <h1 className='text-2xl font-bold'>Profile</h1>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal information here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='mb-6 flex justify-center'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input id='name' defaultValue={user.fullName} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' defaultValue={user.email} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea id='bio' defaultValue={user.bio} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='current-password'>Current Password</Label>
                <Input id='current-password' type='password' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='new-password'>New Password</Label>
                <Input id='new-password' type='password' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
                <Input id='confirm-password' type='password' />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Update Password</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
