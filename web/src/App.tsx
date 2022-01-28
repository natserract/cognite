import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

// Refine packages:
import { Refine } from '@pankod/refine'
import routerProvider from '@pankod/refine-react-router'
import '@pankod/refine/dist/styles.min.css'
import dataProvider from './libs/refine/data-provider'
import client from './libs/refine'
import { Header, Footer, Layout } from './layouts'
import { Title, Sider, OffLayoutArea } from './components'
import resources from './resource'
import { AllContextProvider as AppProvider } from './store';
import { Toaster } from '@redwoodjs/web/toast'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'
import LoginPage from './pages/Auth/LoginPage/loginPage'
import { CognitoProvider } from './libs/cognito'
import accessControlProvider from './libs/refine/access.control'

const gqlDataProvider = dataProvider(client)

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <CognitoProvider>
        <RedwoodApolloProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{ success: { duration: 3000 } }}
          />

          <Refine
            LoginPage={LoginPage}
            routerProvider={{
              ...routerProvider as any,
              routes: [
                {
                  exact: true,
                  component: LoginPage,
                  path: "/login",
                }
              ]
            }}
            dataProvider={gqlDataProvider as any}
            Title={Title}
            Header={Header}
            Sider={Sider}
            Footer={Footer}
            Layout={Layout}
            OffLayoutArea={OffLayoutArea}
            resources={resources}
            accessControlProvider={accessControlProvider()}
          />
        </RedwoodApolloProvider>
      </CognitoProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
