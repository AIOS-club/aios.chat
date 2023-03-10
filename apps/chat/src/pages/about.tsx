import { log } from "logger";
import Head from "next/head";
import { CounterButton, NewTabLink } from "ui";

export default function About() {
  log("Hey! This is Home.");
  return (
    <div className="container">
      <Head>
        <title>Store | Kitchen Sink</title>
      </Head>
      <h1 className="title font-thin text-lg">
      About <br />
        <span>Kitchen Sink</span>
      </h1>
      <CounterButton />
      <p className="description">
        Built With{" "}
        <NewTabLink href="https://turbo.build/repo">Turborepo</NewTabLink> +{" "}
        <NewTabLink href="https://nextjs.org/">Next.js</NewTabLink>
      </p>
    </div>
  );
}
