import React, { useEffect, useState } from 'react';
import { Auth } from './components/auth';
import { auth } from "./firebase";
import { MainApp } from './components/MainApp';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                // User is logged in
                const localStorageData = JSON.parse(localStorage.getItem('userData'));

                if (localStorageData) {
                    // If user data is found in localStorage, use it
                    setUser(localStorageData);
                } else {
                    // Otherwise, set the user from Firebase authentication
                    setUser(authUser);
                }
            } else {
                // User is not logged in
                setUser(null);
            }

            setLoading(false);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {user ? (
                <MainApp user={user} />
            ) : (
                <Auth setUser={setUser} />
            )}
        </>
    );
}

export default App;
