"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Signin() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div>sign in as {session?.user.email}</div> <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <div> Not sign in</div> <br />
      <button className="bg-green-300 p-3 m-2" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
