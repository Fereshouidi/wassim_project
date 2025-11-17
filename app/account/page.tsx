"use client";
import { useClient } from '@/contexts/client';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const AccountPage = () => {

    const route = useRouter();
    const { client, setClient } = useClient();
    const { setLoadingScreen } = useLoadingScreen();

    useEffect(() => {
        setLoadingScreen(false);
    }, [])

    return (
        <div
            className='w-full h-full'
            onClick={() => {
                localStorage.removeItem('clientToken');
                setClient(null);
                route.push('/');
            }}
        >
            AccountPage
        </div>
    )
}

export default AccountPage
