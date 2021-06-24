import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from './pages/Home';
import { NewRoom } from "./pages/NewRoom";

import { AuthContextProvider } from './contexts/AuthContext'
import { Rooms } from "./pages/Rooms";


function App() {  

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/rooms/new' exact component={NewRoom} />
          <Route path='/rooms/:id' component={Rooms} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
