"use client";
import { useClient } from '@/contexts/client';
import { useRouter } from 'next/navigation';
import React from 'react'

const AccountPage = () => {

    const route = useRouter();
    const { client, setClient } = useClient();

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
