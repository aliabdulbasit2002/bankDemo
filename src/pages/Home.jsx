import { Link } from "@nextui-org/react";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gap-x-4">
      <Link href="/signup">Sign Up</Link>
      <Link href="/login">Log In</Link>
    </div>
  );
};
export default Home;
