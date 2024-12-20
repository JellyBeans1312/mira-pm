"use client";

import { z } from 'zod';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import  {
    Card,
    CardHeader,
    CardContent,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

import { loginSchema } from '@/features/auth/schemas';
import { useLogin } from '@/features/auth/api/use-login';






export const SignInCard = () => {
    const { mutate, isPending } = useLogin();
    
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate({ json: values });
    }
    

    return (
        <Card className='w-full h-full md:w-[486px] border-none shadow-none'>
            <CardHeader className='flex items-center justify-center text-center p-7'>
                <CardTitle className='text-2xl'>
                    Welcome Back!
                </CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form  onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            type='email'
                                            placeholder='Enter email address'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            type='password'
                                            placeholder='Enter password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <Button 
                            className='w-full'
                            disabled={isPending}
                            size={"lg"}
                        >
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7 flex flex-col gap-y-4'>
                <Button
                    disabled={isPending}
                    variant={'secondary'}
                    size={'lg'}
                    className='w-full'
                    onClick={() => signUpWithGoogle()}
                >
                    <FcGoogle className='mr-2 size-5' />
                    Login with Google
                </Button>
                <Button
                    disabled={isPending}
                    variant={'secondary'}
                    size={'lg'}
                    className='w-full'
                    onClick={() => signUpWithGithub()}
                >
                    <FaGithub className='mr-2 size-5' />
                    Login with GitHub
                </Button>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7 flex items-center justify-center'>
                Don&apos;t have an account yet?
                <Link href={'/sign-up'}>
                    <span className='text-blue-700'> &nbsp; Sign Up </span>
                </Link>
            </CardContent>
        </Card>
    );
};