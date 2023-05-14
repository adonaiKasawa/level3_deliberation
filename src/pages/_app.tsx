import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import '../../styles/globals.css'
import AdminLayout from '../components/admin/adminLayout'
import { appPersist, store } from '../global'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
}

function MyApp({ Component, pageProps }: ExtendedAppProps) {


  const getLayout = Component.getLayout ?? (page => <AdminLayout>{page}</AdminLayout>)

  return <Provider store={store}>
      <PersistGate loading={null} persistor={ appPersist }>
        <Head>
          <meta charSet="utf-8"/>
          <title>Level3 Déliberation</title>
        </Head>
            {getLayout(<Component {...pageProps} />)}
      </PersistGate>
  </Provider>
}

export default MyApp
