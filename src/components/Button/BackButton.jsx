import { useRouter } from "next/router";

const BackButton = () => {
    const { asPath } = useRouter();
    const backUrl = asPath.slice(0, asPath.lastIndexOf('/'));
 
    return <a href={backUrl}> Back </a>;
 }

 export default BackButton;