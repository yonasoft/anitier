// home.jsx
import React, { useState } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'
import CreateBuild from './create_build';
import CreateSetup from './create_setup';


export default function Create() {

  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  }

  const previousStep = () => {
    setStep(prevStep => prevStep - 1);
  }

  return (
    <div className='root'>
      {step === 0 && <CreateSetup nextStep={nextStep} />}
      {step === 1 && <CreateBuild nextStep={nextStep} previousStep={previousStep} />}
    </div>
  )
}