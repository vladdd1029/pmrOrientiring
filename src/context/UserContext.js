import React, { createContext, useContext, useState, useEffect } from 'react'; // Добавляем необходимые импорты
import { supabase } from '../services/supabaseClient';


const UserContext = createContext(); // Создаем контекст

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                if (user) {
                    setUser(user);
                    const { data, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profileError) throw profileError;
                    setProfile(data);
                }
            } catch (err) {
                console.error('Ошибка загрузки пользователя:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data, error }) => {
                        if (!error) setProfile(data);
                        setIsLoading(false);
                    });
            } else {
                setUser(null);
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe(); // Удаляем подписку
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, profile, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};