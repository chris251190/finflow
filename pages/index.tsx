import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav>
     <h1>Welcome to FinFlow!</h1>
      {session ? (
        <>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login"><button>Login</button></Link>
          <Link href="/register"><button>Register</button></Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;