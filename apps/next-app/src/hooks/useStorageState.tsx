import React, { useEffect, useState } from 'react';

const useStorageState = (key: string): [boolean, () => void] => {
    const [state, setState] = useState<boolean>(true);
    useEffect(() => {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            setState(stored === 'true');
        }
    }, []);

    const update = () => {
        const newVal = !state;
        localStorage.setItem(key, newVal.toString());
        setState(newVal);
    }

    return [state, update];
}

export default useStorageState;