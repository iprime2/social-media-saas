import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <h1 className="w-[180px] h-[60px] border border-dotted flex items-center justify-center p-4">
          Welcome to Krishil!
        </h1>
      </main>
    </>
  );
}