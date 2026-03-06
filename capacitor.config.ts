import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dhyana.meditation',
  appName: 'Dhyana',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
