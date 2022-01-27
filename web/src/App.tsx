import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

// Refine packages:
import { Refine } from '@pankod/refine'
import routerProvider from '@pankod/refine-react-router'
import '@pankod/refine/dist/styles.min.css'
import dataProvider from './services/refine/data-provider'
import client from './services/refine'
import { Header, Footer, Layout } from './layouts'
import { Title, Sider, OffLayoutArea } from './components'
import resources from './resource'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'

const gqlDataProvider = dataProvider(client)

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <RedwoodApolloProvider>
        <Refine
          routerProvider={routerProvider}
          dataProvider={gqlDataProvider as any}
          Title={Title}
          Header={Header}
          Sider={Sider}
          Footer={Footer}
          Layout={Layout}
          OffLayoutArea={OffLayoutArea}
          resources={resources}
        />
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
