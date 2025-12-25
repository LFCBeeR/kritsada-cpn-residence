import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="https://residence.centralpattana.co.th/favicon.ico" />
        <title>Kritsada-Assessment</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}