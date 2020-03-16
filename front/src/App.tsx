import React from 'react';
import * as ReactRedux from 'react-redux';
import style from './App.module.scss';
import TitleBar from './components/TitleBar/TitleBar';
import createApplicationStore from './store';
import CPULoadChart from './application/CPULoads/components/CPULoadChart';
import AlertingEvents from './application/AlertingEvents/component/AlertingEvents';

const store = createApplicationStore();
function App() {
  return (
    <ReactRedux.Provider store={store}>
      <div className={style.root}>
        <div className={style.App}>
          <TitleBar title="Monitoring OS" />
        </div>
        <div className={style.body}>
          <div className={style.dataContainer}>
            <CPULoadChart />
            <AlertingEvents />
          </div>
        </div>
      </div>
    </ReactRedux.Provider>
  );
}

export default App;
