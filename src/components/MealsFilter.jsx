import { useState } from 'react';

export default function MealsFilter({ onSearchChange }) {
    const [searchTerm, setSearchTerm] = useState('');

    function handleSearchChange(e) {
        const term = e.target.value;
        setSearchTerm(term);
        onSearchChange(term);
    }

    return (
        <div className="meals-filter">
            <input
                type="text"
                placeholder="🔍 Search meals by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
        </div>
    );
}
