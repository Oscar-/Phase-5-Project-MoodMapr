import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const NewPlaceForm = ({ locations = [] }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            image: '',
            link: '',
            location_id: '',   
            coordinates: '',   
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            coordinates: Yup.string()
                .matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, 'Must be in format: "latitude, longitude"')
                .nullable(),  
        }),
        onSubmit: (values) => {
            const dataToSubmit = {
                ...values,
                location_id: values.location_id || null,
                coordinates: values.coordinates || null,
            };

            fetch('http://127.0.0.1:5555/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error creating place');
            })
            .then((data) => {
                console.log('Place created successfully:', data);
                formik.resetForm(); 
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to create place. Please try again.'); 
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="form-container">
            <h2>Create New Place</h2>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className={`form-input ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                />
                {formik.touched.name && formik.errors.name ? <div className="error-message">{formik.errors.name}</div> : null}
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    className="form-textarea"
                />
            </div>
            <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                    id="image"
                    type="text"
                    name="image"
                    onChange={formik.handleChange}
                    value={formik.values.image}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="link">Link</label>
                <input
                    id="link"
                    type="text"
                    name="link"
                    onChange={formik.handleChange}
                    value={formik.values.link}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="location_id">Location</label>
                <select
                    id="location_id"
                    name="location_id"
                    onChange={formik.handleChange}
                    value={formik.values.location_id}
                    className="form-select"
                >
                    <option value="">Select a location (optional)</option>
                    {locations.length > 0 ? (
                        locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.city_name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No locations available</option>
                    )}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="coordinates">Coordinates</label>
                <input
                    id="coordinates"
                    type="text"
                    name="coordinates"
                    placeholder="Latitude, Longitude (optional)"
                    onChange={formik.handleChange}
                    value={formik.values.coordinates}
                    className={`form-input ${formik.touched.coordinates && formik.errors.coordinates ? 'input-error' : ''}`}
                />
                {formik.touched.coordinates && formik.errors.coordinates ? <div className="error-message">{formik.errors.coordinates}</div> : null}
            </div>
            <button type="submit" className="form-button">Create Place</button>
        </form>
    );
};

export default NewPlaceForm;
