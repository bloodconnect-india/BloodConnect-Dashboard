import React, { ReactElement, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Autosuggest from 'react-autosuggest';

import './Search.css'
import theme from "./SearchTheme.module.css"
interface Props {
    handleChange: (c: string) => void
}
interface CityProps {
    name: string
}

export default function Search({ handleChange }: Props): ReactElement {

    const [suggestions, setSuggestion] = useState<CityProps[]>([])
    const [value, setValue] = useState('')
    const city = [
        { name: 'Delhi NCR' },
        { name: 'Agra' },
        { name: 'Lucknow' },
        { name: 'Jaipur' },
        { name: 'Kolkata' },
        { name: 'Ranchi' },
        { name: 'Odisha' },
        { name: 'Varanasi' },
        { name: 'Pune' },
        { name: 'Kanpur' },
        { name: 'Consulting' }
    ]
    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : city.filter(c =>
            c.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    const getSuggestionValue = suggestion => suggestion.name;

    // Use your imagination to render suggestions.
    const renderSuggestion = suggestion => (
        <div className="suggestion">
            {suggestion.name}
        </div>
    );

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestion(getSuggestions(value))
    };

    const onSuggestionsClearRequested = () => {
        setSuggestion([])
    }
    const onChange = (event, { newValue }) => {
        setValue(newValue)
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleChange(e.target.value)
        }
    }

    const inputProps = {
        placeholder: 'Enter the city',
        value,
        onChange: onChange,
        onKeyDown: handleKeyDown
    };
    return (
        <div className="my-4 col-lg-6">
            <div className="d-flex container">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    theme={theme}
                />
                
                <div className="search-icon" onClick={() => {
                    console.log(value)
                    handleChange(value)
                }}>
                    <FiSearch color="white" />
                </div>
            </div>
        </div>
    )
}
