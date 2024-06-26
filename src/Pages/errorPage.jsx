import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorImage from '../asset/error.jpg';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 p-4">
            <img src={errorImage} alt="Error" className="w-full max-w-md h-auto" />
            <h1 className="text-2xl md:text-4xl font-bold mt-8 text-center">Oops! Page Not Found</h1>
            <p className="text-md md:text-lg mt-4 text-center">Sorry, the page you are looking for does not exist.</p>
            <button
                onClick={handleGoBack}
                className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default ErrorPage;
