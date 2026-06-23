// import { use } from 'react';
import { useEffect } from 'react';
import MealItem from './MealItem';
import useHttp from '../hooks/useHttp';
import Error from './Error';

const requestConfig = {}

export default function Meals({ searchTerm }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const { data: loadedMeals, isLoading, error } = useHttp(`${backendUrl}/meals`, requestConfig, []);

    const filteredMeals = loadedMeals.filter((meal) => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <p className='center'>Fetching Meals...</p>
    }

    if (error){
        return <Error title="Failed to load meals" message={error} />
    }

    // if (!data){
    //     return <p>Failed to load meals.</p>
    // }

    return (
        <>
            {filteredMeals.length === 0 ? (
                <p className='center'>No meals found matching "{searchTerm}"</p>
            ) : (
                <ul id="meals">
                    {filteredMeals.map((meal) => (<MealItem key={meal.id} meal={meal} />))}
                </ul>
            )}
        </>
    )
}