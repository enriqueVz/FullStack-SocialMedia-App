/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(main)/editProfile` | `/(main)/home` | `/(main)/newPost` | `/(main)/notifications` | `/(main)/profile` | `/_sitemap` | `/editProfile` | `/home` | `/login` | `/newPost` | `/notifications` | `/profile` | `/signUp` | `/welcome`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
