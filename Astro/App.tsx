import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '~/app/navigation/RootNavigator';
import { Provider } from 'react-redux';
import { store } from '~/store';
import '~/shared/i18n';
import { CustomAlertDialog, initCustomAlert } from '~/shared/components/CustomAlertDialog';

// Initialize clean, minimal global alert system
initCustomAlert();

function App(): React.JSX.Element {
  useEffect(() => {
    initCustomAlert();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
        <CustomAlertDialog />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
