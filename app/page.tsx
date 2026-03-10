export default function Home() {
  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <header className="text-4xl">
          <h1>Walter Phillips</h1>
        </header>

        <div className="flex flex-col items-center justify-center w-1/2 box-border">
          <section className="text-center leading-relaxed text-[15.5px]">
            <p>
              Currently working on{" "}
              <a href="https://www.sail.exchange/">Sail</a>. I enjoy theoretical
              physics, football(soccer), photography, and climbing. I&apos;m
              trying to climb V12 by the end of 2023. I watch all my youtube
              videos at 3x speed. I wrote my first line of code in 2014; I was
              trying to replicate voices in real-time, and I finally figured out
              how to do it in 2021. I like sushi. I think we should teach babies
              deep learning. My only goal in life is to open a school. Everything
              else is in service of that.
            </p>
          </section>

          <section className="mt-4">
            <a
              className="text-black underline"
              href="https://www.linkedin.com/in/walter-phillips-1922741a5/"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              className="text-black underline ml-4"
              href="https://github.com/Walter-Phillips"
              target="_blank"
            >
              Github
            </a>
          </section>
        </div>

        <p className="pt-5 italic">
          Social norms are a safety mechanism, they shouldn&apos;t be the
          boundary of human experience.
        </p>
      </div>
    </section>
  );
}
