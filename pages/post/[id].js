/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";


const postPage = () => {
    const router = useRouter();
    const query = router.query
    console.log(query)

    return (
        <div>This is the post page</div>
    )
}

export default postPage;