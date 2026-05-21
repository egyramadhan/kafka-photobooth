import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import SetupPage from './pages/SetupPage'
import BoothPage from './pages/BoothPage'
import ResultPage from './pages/ResultPage'
import DownloadPage from './pages/DownloadPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <SetupPage />,
      },
      {
        path: 'booth',
        element: <BoothPage />,
      },
      {
        path: 'result',
        element: <ResultPage />,
      },
    ],
  },
  {
    path: '/download/:fileId',
    element: <DownloadPage />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
