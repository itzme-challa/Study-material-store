import Head from 'next/head';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script src="https://sdk.cashfree.com/js/v3/cashfree.test.js"></script>
      </Head>
      <ToastContainer position="top-center" autoClose={3000} />
      <Component {...pageProps} />
    </>
  );
}
