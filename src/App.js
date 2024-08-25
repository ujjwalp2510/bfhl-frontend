import React, { useState } from 'react';
import './App.css';  // Ensure you have the CSS file for styling

function App() {
    const [jsonData, setJsonData] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);  // Reset error state
        setResponse(null);  // Reset response state

        try {
            // Try to parse the JSON to check for validity
            const parsedData = JSON.parse(jsonData);

            const res = await fetch('https://bfhl-backend-gilt.vercel.app/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),  // Send parsed JSON directly
            });

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data);

        } catch (err) {
            if (err instanceof SyntaxError) {
                setError('Invalid JSON format. Please enter valid JSON data.');
            } else {
                setError(`Error: ${err.message}`);
            }
            console.error('Error:', err);
        }
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setSelectedOptions(prevOptions => 
            prevOptions.includes(value)
                ? prevOptions.filter(option => option !== value)
                : [...prevOptions, value]
        );
    };

    const renderResponse = () => {
        if (!response) return null;

        const filteredResponse = {};
        selectedOptions.forEach((option) => {
            if (response.hasOwnProperty(option)) {
                filteredResponse[option] = response[option];
            }
        });

        // Format response as plain text
        return Object.entries(filteredResponse).map(([key, value]) => (
            <div key={key} className="response-item">
                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </div>
        ));
    };

    return (
        <div className="App">
            <h1 className="title">BFHL Frontend</h1>
            <form className="form" onSubmit={handleSubmit}>
                <textarea
                    className="textarea"
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    placeholder='Enter JSON data here'
                    rows="10"
                />
                <button className="submit-button" type="submit">Submit</button>
            </form>
            {error && <p className="error-message">{error}</p>}  {/* Display error message */}
            {response && (
                <div className="response-container">
                    <fieldset className="response-fieldset">
                        <legend>Select Response Fields:</legend>
                        <label>
                            <input
                                type="checkbox"
                                value="alphabets"
                                checked={selectedOptions.includes('alphabets')}
                                onChange={handleCheckboxChange}
                            />
                            Alphabets
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="numbers"
                                checked={selectedOptions.includes('numbers')}
                                onChange={handleCheckboxChange}
                            />
                            Numbers
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="highest_lowercase_alphabet"
                                checked={selectedOptions.includes('highest_lowercase_alphabet')}
                                onChange={handleCheckboxChange}
                            />
                            Highest Lowercase Alphabet
                        </label>
                    </fieldset>
                    <div className="response-output">
                        {renderResponse()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
