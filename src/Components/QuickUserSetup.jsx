
import React, { useState } from 'react';
import Ldap from './Ldap';
import UserForm from './UserForm';
import { useEffect } from 'react';
import AccountWithQos from './AccountWithQos';

const QuickUserSetup = () => {
    const [step, setStep] = useState(1);

    const steps = ['LDAP', 'SLURM Account', 'QOS', 'Disk Quota'];

    const nextStep = () => {
        setStep(prev => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h3>Quick User Setup</h3>
            </div>


            {/* Step Progress Bar */}
            <div className="step-progress d-flex align-items-center justify-content-between my-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = step === stepNumber;
                    const isCompleted = step > stepNumber;


                    return (
                        <div key={index} className="d-flex align-items-center flex-grow-1">
                            <div
                                className={`step-circle text-center rounded-circle me-2 ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                style={{ width: '40px', height: '40px', lineHeight: '40px' }}
                            >
                                {stepNumber}
                            </div>
                            <div className="me-2">{label}</div>
                            {index !== steps.length - 1 && (
                                <div className={`flex-grow-1 step-line ${isCompleted ? 'bg-primary' : 'bg-white'}`} style={{ height: '4px' }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            {step === 1 && (
                <div className="row">
                    <div className="col-12 col-md-10 px-0">
                        <Ldap />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="row">
                <div className="col-12 col-md-10 px-0">
                    <UserForm />
                </div>
                </div>
            )}

            {step === 3 && (
                <div className="row">
                <div className="col-md-10 px-0">
                    <AccountWithQos />
                </div>
                </div>
            )}

            {step === 4 && (
                <div className="row">
                <div className="col-md-10 px-0">
                    <h4>Step 4: Disk Quota</h4>
                    <form>
                        <div className="mb-3">
                            <label>Disk Quota (GB)</label>
                            <input type="number" className="form-control" placeholder="Enter quota size" />
                        </div>
                    </form>
                </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="row mt-4 mb-5">
                <div className="col-12 col-md-10 d-flex flex-column flex-md-row justify-content-between gap-2 px-0">
                    <button className="btn btn-secondary" onClick={prevStep} disabled={step === 1}>
                        Back
                    </button>
                    <button className="btn btn-primary" onClick={nextStep} disabled={step === steps.length}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickUserSetup;
