"use client"
import ChartComponent from '@/componentes/grafica';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import MenuInicio from '@/componentes/menuInicio';



const Page = () => {
    const router = useRouter();
    router.push("/principal");

};

export default Page;