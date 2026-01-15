declare global {
  export type RouteType = "public" | "private" | "common" | "client" | "admin";

  export interface RouteConfig {
    path: string;
    component: ComponentType;
    type: RouteType;
  }
}

export {};
