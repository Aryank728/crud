import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { app, image } from '../firebase'; // Adjust the import according to your setup
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const indianStates = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
];

const Firestore = getFirestore(app);

function PalaceForm() {
    const [state, setState] = useState('');
    const [placeImage, setPlaceImage] = useState(null);
    const [placeDescription, setPlaceDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const uploadImage = async (imageFile, folder) => {
        const imageRef = ref(image, `${folder}/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile, {
            contentType: imageFile.type,
        });
        console.log(`${folder} image uploaded successfully`);
        return imageRef.fullPath;
    };

    const handlePlaceImageChange = (e) => {
        setPlaceImage(e.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!placeImage) {
            alert('Please select an image');
            return;
        }

        setIsSubmitting(true);

        try {
            const placeImagePath = await uploadImage(placeImage, 'placeImage');

            await addDoc(collection(Firestore, 'place'), {
                state,
                placeDescription,
                placeImagePath,
            });
            console.log('Document added successfully');
            clearForm();
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Error adding document: ', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearForm = () => {
        setState('');
        setPlaceImage(null);
        setPlaceDescription('');
        if (document.getElementById('placeImage')) {
            document.getElementById('placeImage').value = ''; // <--- Reset file input
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <Navbar />
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <h2 className="col-span-1 md:col-span-2 text-3xl font-bold text-center text-blue-600">Place Form</h2>
                    <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-gray-700">State:</label>
                        <select
                            id="state"
                            onChange={(e) => setState(e.target.value)}
                            value={state}
                            required
                            className="mt-1 p-3 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select State</option>
                            {indianStates.map((stateName, index) => (
                                <option key={index} value={stateName}>{stateName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="placeImage" className="block text-sm font-semibold text-gray-700">Place Image:</label>
                        <input
                            id="placeImage"
                            onChange={handlePlaceImageChange}
                            type="file"
                            accept="image/*"
                            required
                            className="mt-1 p-3 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="placeDescription" className="block text-sm font-semibold text-gray-700">Place Description:</label>
                        <textarea
                            id="placeDescription"
                            onChange={(e) => setPlaceDescription(e.target.value)}
                            value={placeDescription}
                            rows="4"
                            required
                            placeholder="Enter Place Description"
                            className="mt-1 p-3 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`col-span-1 md:col-span-2 w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                {showModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-2xl font-semibold text-blue-500">Data Added Successfully</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PalaceForm;