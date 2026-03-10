import Link from "next/link";

const projects = [
  {
    title: "NFT Smart Contracts",
    description: "Smart contracts for a NFT marketplace",
    href: "https://github.com/Walter-Phillips/NFT_Marketplace",
  },
  {
    title: "Transformer",
    description: "Implementing Transformers in Pytorch from original paper",
    href: "https://github.com/Walter-Phillips/transformers",
  },
  {
    title: "Style Transfer",
    description:
      "Using feed forward neural network to implement image style transfer.",
    href: "https://github.com/Walter-Phillips/Style_Transfer",
  },
  {
    title: "Decentralized Exchange",
    description: "Decentralized Exchange smart contracts",
    href: "https://github.com/Walter-Phillips/Dex",
  },
  {
    title: "Snake AI",
    description: "AI model learns to play Snake game.",
    href: "https://github.com/Walter-Phillips/Snake-AI",
  },
  {
    title: "Flask ML deployment",
    description:
      "Machine Learning model made with Pytorch made into API endpoint with Flask",
    href: "https://github.com/Walter-Phillips/flask_model",
  },
];

export default function Projects() {
  return (
    <div>
      <Link href="/" className="absolute right-4 top-2.5 text-black">
        Back
      </Link>

      <section>
        <header className="ml-2.5">
          <h2 className="text-2xl font-bold">Projects</h2>
        </header>

        <section className="flex flex-row flex-wrap justify-around">
          {projects.map((project) => (
            <section
              key={project.title}
              className="box-border rounded-lg p-2.5 w-[49%] mb-1.5 shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p>{project.description}</p>
              <a
                href={project.href}
                target="_blank"
                className="inline-block mt-2 text-white bg-black px-6 py-3.5 text-center no-underline rounded-lg"
              >
                Source Code
              </a>
            </section>
          ))}
        </section>
      </section>
    </div>
  );
}
