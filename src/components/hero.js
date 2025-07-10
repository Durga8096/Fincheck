import React from "react";
import { useNavigate } from "react-router-dom";

const Hero =()=>{
    const navigate=useNavigate()
    function handleGetStarted(){
        navigate('/Login')
    }
    return(
        <div >
        <div>
            <img className="w-full h-[60vh] object-cover" src='hero.jpg' alt='hero'/>
        </div>
       <div className="flex-col justify-center mb-4 text-center">
        <p className="pt-10 text-xl font-bold text-shadow-md ">
        "Track expenses, manage budgets, and achieve your financial goals with ease."</p>
        <button className="px-4 py-2 mt-6 text-white bg-blue-600 rounded-lg" onClick={handleGetStarted}>Get Started</button>
        </div>
        </div>
    )
}

export default Hero;