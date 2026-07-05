import { useAppSelector } from "../store/hooks";

const Home = () => {
    const auth = useAppSelector((state) => state.auth);

    return (
        <div>
            <h1>Home Page</h1>

            <pre>{JSON.stringify(auth, null, 2)}</pre>
        </div>
    );
};

export default Home;