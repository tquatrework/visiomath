// App.tsx
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './providers/UserContext';
import { router } from './routes';

function App(): JSX.Element {

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;