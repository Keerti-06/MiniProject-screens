// In app/index.js
import { Redirect } from 'expo-router';

export default function Index() {
  // This tells the app: "Go straight to the login page"
  return <Redirect href="/(auth)/login" />;
}