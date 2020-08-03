import React, { ReactElement } from 'react'
import { FiSearch } from 'react-icons/fi'

import './Search.css'
interface Props {
    
}

export default function Search(): ReactElement {
    return (
        <div className="my-4">
            <div className="d-flex align-items-center">
                <input type="text" className="search-input" placeholder="city name" />
                <div className="search-icon">
                    <FiSearch color="white" />
                </div>
            </div>
        </div>
    )
}
