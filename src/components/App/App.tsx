import { Provider as ReduxProvider } from 'react-redux';
import { store} from '../../store';
import ViewBrowser from '../ViewBrowser';

function App() {
  return (
    <ReduxProvider store={store}>
      <ViewBrowser expandedFolders={['/Common7']}/>
    </ReduxProvider>
  );
}

export default App;
