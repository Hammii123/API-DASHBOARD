import { useState, useMemo } from 'react';

const SORT_OPTIONS = {
    default: { label: 'Default', compare: null },
    nameAsc: { label: 'Name (A-Z)', compare: (a, b) => a.name.localeCompare(b.name) },
    nameDesc: { label: 'Name (Z-A)', compare: (a, b) => b.name.localeCompare(a.name) },
};

function useTableFilter(data, searchKeys = []) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('default');

    const filteredData = useMemo(() => {
        let result = data;

        if (searchTerm.trim() !== '') {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter((item) =>
                searchKeys.some((key) =>
                    String(item[key]).toLowerCase().includes(lowerTerm)
                )
            );
        }

        const sortConfig = SORT_OPTIONS[sortKey];
        if (sortConfig && sortConfig.compare) {
            result = [...result].sort(sortConfig.compare);
        }

        return result;
    }, [data, searchTerm, sortKey]);

    return { filteredData, searchTerm, setSearchTerm, sortKey, setSortKey, sortOptions: SORT_OPTIONS };
}

export default useTableFilter;
export { SORT_OPTIONS };