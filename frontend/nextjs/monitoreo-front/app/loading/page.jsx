"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

const LoadingPage = () => {
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        const externalUser = getExternalUser();

        if (!token || !externalUser) {
            // console.error("No se pudo obtener el external del usuario desde el sessionStorage");
            router.push("/loading");
        } else {
            router.push("/sensores");
        }
    }, []);

    return (
        <div>
            <h1>Loading...</h1>
            {/* Add any additional loading indicators or messages here */}
        </div>
    );
};

export default LoadingPage;
