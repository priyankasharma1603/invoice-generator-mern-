// src/InvoiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './InvoiceForm.css';

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        logo: '',
        sellerDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            panNo: '',
            gstNo: ''
        },
        placeOfSupply: '',
        billingDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            stateCode: ''
        },
        shippingDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            stateCode: ''
        },
        placeOfDelivery: '',
        orderDetails: {
            orderNo: '',
            orderDate: ''
        },
        invoiceDetails: {
            invoiceNo: '',
            invoiceDate: ''
        },
        reverseCharge: false,
        items: [
            {
                description: '',
                unitPrice: 0,
                quantity: 0,
                discount: 0,
                netAmount: 0,
                taxRate: 18
            }
        ],
        signature: '' // Base64 or URL for signature image
    });

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItems = formData.items.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setFormData({ ...formData, items: updatedItems });
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    description: '',
                    unitPrice: 0,
                    quantity: 0,
                    discount: 0,
                    netAmount: 0,
                    taxRate: 18
                }
            ]
        });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/generate-invoice', formData, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error("Error generating invoice", error);
        }
    };

    return (
        <div className="invoice-form-container">
            <h1 className="form-title">Invoice Generator</h1>
            <form onSubmit={handleSubmit}>
                <h2>Company Logo</h2>
                <input type="file" name="logo" onChange={(e) => handleChange(e)} />

                <h2>Seller Details</h2>
                {/* Inputs for seller details */}
                
                <h2>Billing Details</h2>
                {/* Inputs for billing details */}

                <h2>Shipping Details</h2>
                {/* Inputs for shipping details */}

                <h2>Order Details</h2>
                {/* Inputs for order details */}

                <h2>Invoice Details</h2>
                {/* Inputs for invoice details */}

                <h2>Items</h2>
                {formData.items.map((item, index) => (
                    <div key={index} className="item-group">
                        <div className="form-group">
                            <label>Description:</label>
                            <input type="text" name="description" value={item.description} onChange={(e) => handleChange(e, index)} required />
                        </div>
                        <div className="form-group">
                            <label>Unit Price:</label>
                            <input type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleChange(e, index)} required />
                        </div>
                        <div className="form-group">
                            <label>Quantity:</label>
                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleChange(e, index)} required />
                        </div>
                        <div className="form-group">
                            <label>Discount:</label>
                            <input type="number" name="discount" value={item.discount} onChange={(e) => handleChange(e, index)} required />
                        </div>
                        <div className="form-group">
                            <label>Net Amount:</label>
                            <input type="text" name="netAmount" value={item.netAmount} readOnly />
                        </div>
                        <div className="form-group">
                        <label>Tax Rate:</label>
                            <input type="number" name="taxRate" value={item.taxRate} onChange={(e) => handleChange(e, index)} required />
                        </div>
                        <div className="form-group">
                            <label>Tax Amount:</label>
                            <input type="text" name="taxAmount" value={item.taxAmount} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Total Amount:</label>
                            <input type="text" name="totalAmount" value={item.totalAmount} readOnly />
                        </div>
                        <button type="button" onClick={() => handleRemoveItem(index)} className="remove-btn">Remove Item</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddItem} className="add-btn">Add Another Item</button>

                <h2>Signature</h2>
                <input type="file" name="signature" onChange={(e) => handleChange(e)} />

                <button type="submit" className="submit-btn">Generate Invoice</button>
            </form>
        </div>
    );
};

export default InvoiceForm;

