import React from 'react'

export const GetMovies = async (endpoint) => {

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const url = `https://api.themoviedb.org/3/${endpoint}`
    const idioma = '?language=es-ES';

    try {
        const response = await fetch(`${url}${idioma}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        });
        const data = await response.json();
        return data;        
    } catch (error) {
        console.log('Error fetching movies:', error);        
    }
}
